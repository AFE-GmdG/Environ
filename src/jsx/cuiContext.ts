import { CUIElement } from "./cuiElement";
import { IDisposable } from "./disposable";

const knownCanvases = new Map<HTMLCanvasElement, CUIContextImpl>();
const canvasObserver = new MutationObserver(mutations => {
	for (const mutation of mutations) {
		mutation.addedNodes.forEach(node => {
			if (node instanceof HTMLCanvasElement) {
				const context = knownCanvases.get(node);
				if (context) {
					// add EventListener for Mouse, etc...
					registerEventHandler(node, context);
					context.requestAnimationFrame(true);
				}
			}
		});
		mutation.removedNodes.forEach(node => {
			if (node instanceof HTMLCanvasElement) {
				const context = knownCanvases.get(node);
				if (context) {
					// remove EventListener for Mouse, etc...
				}
			}
		})
	}
});
canvasObserver.observe(document.body, { childList: true, subtree: true });

function registerEventHandler(canvas: HTMLCanvasElement, context: CUIContextImpl) {
	canvas.addEventListener("mousemove", context.onMouseMove);
}

function unregisterEventHandler(canvas: HTMLCanvasElement, context: CUIContextImpl) {
	canvas.removeEventListener("mousemove", context.onMouseMove)
}

export interface CUIContext extends IDisposable {
	readonly canvas: HTMLCanvasElement;
	readonly gl: WebGL2RenderingContext;

	readonly root: CUIElement | null;

	removeChild(child: CUIElement): CUIElement;
	render(root: CUIElement | null): void;
	resize(): void;
	updateClearColor(clearColorRed: number, clearColorGreen: number, clearColorBlue: number): void;
}

class CUIContextImpl implements CUIContext, IDisposable {

	//#region Fields/Properties
	readonly canvas: HTMLCanvasElement;
	readonly gl: WebGL2RenderingContext;

	private _isDirty: boolean;
	private _isAnimationRunning: boolean;
	private _animationFrameHandle: number;
	private _rendering: boolean;

	private _root: CUIElement | null;
	get root(): CUIElement | null {
		return this._root;
	}
	//#endregion

	//#region ctor/dispose
	constructor(canvas: HTMLCanvasElement, clearColorRed: number = 1.0, clearColorGreen: number = 1.0, clearColorBlue: number = 1.0) {
		this.canvas = canvas;

		const gl = canvas.getContext("webgl2", {
			alpha: false,
			antialias: false,
			depth: false,
			desynchronized: true,
			failIfMajorPerformanceCaveat: true,
			powerPreference: "high-performance",
			premultipliedAlpha: false,
			preserveDrawingBuffer: true,
			stencil: false
		});
		if (!gl) {
			throw new Error("Could not get the WebGL2 rendering context.");
		}
		this.gl = gl;
		this.gl.clearColor(
			Math.max(0.0, Math.min(1.0, clearColorRed)),
			Math.max(0.0, Math.min(1.0, clearColorGreen)),
			Math.max(0.0, Math.min(1.0, clearColorBlue)),
			1.0);

		this._isDirty = true;
		this._isAnimationRunning = false;
		this._animationFrameHandle = 0;
		this._rendering = false;
		this._root = null;

		knownCanvases.set(canvas, this);
		if (canvas.isConnected) {
			registerEventHandler(canvas, this);
			this.requestAnimationFrame();
		}
	}

	dispose = () => {
		if (this.canvas.isConnected) {
			unregisterEventHandler(this.canvas, this);
		}
	}
	//#endregion

	//#region EventHandler
	onMouseMove = (_event: MouseEvent) => {
	}

	onRequestAnimationFrame = (_time: number) => {
		this._animationFrameHandle = 0;
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		if (!this._root) {
			return;
		}

		if (this._isDirty) {
			const { width, height } = this.canvas.getBoundingClientRect();
			// this._root.context
		}

		if (this._isAnimationRunning) {
			this._animationFrameHandle = window.requestAnimationFrame(this.onRequestAnimationFrame);
		}
	}
	//#endregion

	//#region Private CUIContext API (only available from within this file)
	requestAnimationFrame = (isDirty: boolean = false) => {
		this._isDirty ||= isDirty;
		if (this._animationFrameHandle !== 0) {
			return;
		}

		this._animationFrameHandle = window.requestAnimationFrame(this.onRequestAnimationFrame);
	}
	//#endregion

	//#region Public CUIContext API
	removeChild = (child: CUIElement): CUIElement => {
		if(this._root === child) {
			const rendering = this._rendering;
			this._rendering = true;
			child.context = null;
			this._root = null;
			this._rendering = rendering;
			return child;
		}
		throw new Error("Invalid operation: The cild isn't the root element.");
	}

	render = (root: CUIElement | null) => {
		if (this._rendering) {
			return;
		}
		this._rendering = true;
		try {
			if (this._root && this._root !== root) {
				// Destroy old _root
				this._root.context = null;
				this._root.dispose();
				this._root = null;
				this.requestAnimationFrame(true);
			}

			if (root) {
				if (root.context && root.context !== this) {
					throw new Error("Invalid operation: The root component belongs to another cui context.");
				}
				root.context = this;
				this._root = root;
				this.requestAnimationFrame(true);
			}
		} finally {
			this._rendering = false;
		}
	}

	resize = () => {
		const { width, height } = this.canvas.getBoundingClientRect();
		this.canvas.width = width;
		this.canvas.height = height;
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.requestAnimationFrame(true);
	}

	updateClearColor = (clearColorRed: number, clearColorGreen: number, clearColorBlue: number) => {
		this.gl.clearColor(
			Math.max(0.0, Math.min(1.0, clearColorRed)),
			Math.max(0.0, Math.min(1.0, clearColorGreen)),
			Math.max(0.0, Math.min(1.0, clearColorBlue)),
			1.0);
		this.requestAnimationFrame();
	}
	//#endregion

}

export function getCUIContext(canvas: HTMLCanvasElement): CUIContext;
export function getCUIContext(canvas: HTMLCanvasElement, clearColorRed: number, clearColorGreen: number, clearColorBlue: number): CUIContext;
export function getCUIContext(canvas: HTMLCanvasElement, clearColorRed?: number, clearColorGreen?: number, clearColorBlue?: number): CUIContext {
	if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
		throw new Error("ArgumentNullError: a valid canvas must be provided.");
	}

	const context = knownCanvases.get(canvas);
	if (context) {
		if (clearColorRed !== undefined && clearColorGreen !== undefined && clearColorBlue !== undefined) {
			context.updateClearColor(clearColorRed, clearColorGreen, clearColorBlue);
		}
		return context;
	}
	return new CUIContextImpl(canvas, clearColorRed, clearColorGreen, clearColorBlue);
}

export function isCUIContext(maybeContext: any): maybeContext is CUIContext {
	return maybeContext instanceof CUIContextImpl;
}
