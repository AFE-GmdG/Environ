import * as ReactDOM from "react-dom";
import { IDisposable } from "../disposable";
import { CUIContainer } from "./cuiContainer";
import { Margin } from "./primitives/margin";
import { Size } from "./primitives/size";

type ElementParameterOfReactDomRender = Parameters<ReactDOM.Renderer>[0][0];

function registerEventHandler(canvas: HTMLCanvasElement, context: CUIContextImpl) {
  canvas.addEventListener("mousemove", context.onMouseMove);
}

function unregisterEventHandler(canvas: HTMLCanvasElement, context: CUIContextImpl) {
  canvas.removeEventListener("mousemove", context.onMouseMove);
}

const knownCanvases = new Map<HTMLCanvasElement, CUIContextImpl>();
const canvasObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLCanvasElement) {
        const context = knownCanvases.get(node);
        if (context) {
          // add EventListener for Mouse, etc...
          registerEventHandler(node, context);
          context.requestAnimationFrame(true);
        }
      }
    });

    mutation.removedNodes.forEach((node) => {
      if (node instanceof HTMLCanvasElement) {
        const context = knownCanvases.get(node);
        if (context) {
          // remove EventListener for Mouse, etc...
        }
      }
    });
  });
});
canvasObserver.observe(document.body, { childList: true, subtree: true });

export interface CUIContext extends IDisposable {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  padding: Margin;
  readonly size: Size;

  // removeChild(child: CUIElement): CUIElement;
  render(root: ElementParameterOfReactDomRender): void;
  resize(): void;
  updateClearColor(clearColorRed: number, clearColorGreen: number, clearColorBlue: number): void;
}

class CUIContextImpl implements CUIContext, IDisposable {
  // #region Fields/Properties
  readonly canvas: HTMLCanvasElement;

  readonly gl: WebGL2RenderingContext;

  private _isDirty: boolean;

  private _isAnimationRunning: boolean;

  private _animationFrameHandle: number;

  private _rootContainer: CUIContainer | null;

  private _padding: Margin;
  // #endregion

  // #region Properties
  get padding(): Margin {
    return this._padding;
  }

  set padding(value: Margin) {
    this._padding = value;
    this.requestAnimationFrame(true);
  }

  get size(): Size {
    return new Size(this.canvas.width, this.canvas.height);
  }
  // #endregion

  // #region ctor/dispose
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
      stencil: false,
    });
    if (!gl) {
      throw new Error("Could not get the WebGL2 rendering context.");
    }
    this.gl = gl;
    this.gl.clearColor(
      Math.max(0.0, Math.min(1.0, clearColorRed)),
      Math.max(0.0, Math.min(1.0, clearColorGreen)),
      Math.max(0.0, Math.min(1.0, clearColorBlue)),
      1.0,
    );

    this._isDirty = true;
    this._isAnimationRunning = false;
    this._animationFrameHandle = 0;

    this._rootContainer = null;

    this._padding = new Margin();

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
  };
  // #endregion

  // #region EventHandler
  onMouseMove = (_event: MouseEvent) => {
  };

  onRequestAnimationFrame = (_time: number) => {
    this._animationFrameHandle = 0;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    if (!this._rootContainer) {
      return;
    }

    if (this._isDirty) {
      const { width, height } = this.canvas.getBoundingClientRect();
      const availableSize = new Size(width, height);
      const necessarySize = this._rootContainer.measure(availableSize);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const finalSize = this._rootContainer.arrange(necessarySize);
    }

    if (this._isAnimationRunning) {
      this._animationFrameHandle = window.requestAnimationFrame(this.onRequestAnimationFrame);
    }
  };
  // #endregion

  // #region Private CUIContext API (only available from within this file)
  requestAnimationFrame = (isDirty: boolean = false) => {
    this._isDirty ||= isDirty;
    if (this._animationFrameHandle !== 0) {
      return;
    }

    this._animationFrameHandle = window.requestAnimationFrame(this.onRequestAnimationFrame);
  };
  // #endregion

  // #region Public CUIContext API
  render = (root: ElementParameterOfReactDomRender) => {
    if (this._rootContainer) {
      debugger;
    } else {
      this._rootContainer = new CUIContainer(this, root);
    }

    this.requestAnimationFrame(true);
  };

  resize = () => {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.requestAnimationFrame(true);
  };

  updateClearColor = (clearColorRed: number, clearColorGreen: number, clearColorBlue: number) => {
    this.gl.clearColor(
      Math.max(0.0, Math.min(1.0, clearColorRed)),
      Math.max(0.0, Math.min(1.0, clearColorGreen)),
      Math.max(0.0, Math.min(1.0, clearColorBlue)),
      1.0,
    );
    this.requestAnimationFrame();
  };
  // #endregion
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
