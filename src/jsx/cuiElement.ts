import { CUIContext, isCUIContext } from "./cuiContext";
import { IDisposable } from "./disposable";

/** The Canvas UI Element is the most general base class from which all objects in a Canvas UI Environment inherit. */
export abstract class CUIElement implements IDisposable {

	private _children: CUIElement[] | string | null;
	private _parent: CUIContext | CUIElement | null;

	get context(): CUIContext | null {
		if (!this._parent) {
			return null;
		}
		if (isCUIContext(this._parent)) {
			return this._parent;
		}
		return this._parent.context;
	}
	set context(value: CUIContext | null) {
		if (value && !this._parent) {
			this._parent = value;
		} else if (!value && isCUIContext(this._parent)) {
			this._parent.render(null);
			this._parent = null;
		} else {
			throw new Error("Invalid operation.");
		}
	}

	get hasChildren(): boolean {
		return this._children !== null && this._children.length > 0;
	}

	get parent(): CUIElement | null {
		return isCUIContext(this._parent) ? null : this._parent;
	}

	//#region ctor/dispose
	constructor() {
		this._children = null;
		this._parent = null;
	}

	dispose = () => {
		if(this._children && typeof this._children !== "string") {
			this._children.forEach(child => {
				child._parent = null;
				child.dispose();
			});
			this._children = null;
			if (this._parent !== null) {
				this._parent.removeChild(this);
			}
		}
	}
	//#endregion

	appendChild = (child: CUIElement): CUIElement => {
		if (child._parent) {
			if (child._parent === this) {
				return child;
			}
			throw new Error("Invalid operation: The child element belongs to another parent.");
		}
		if (typeof this._children === "string") {
			throw new Error("Invalid operation: The content is a string.");
		}
		if (this._children === null) {
			this._children = [];
		};
		child._parent = this;
		this._children.push(child);
		return child;
	}

	insertBefore = (child: CUIElement, reference: CUIElement | null): CUIElement => {
		if (child._parent && child._parent !== this) {
			throw new Error("Invalid operation: The child element belongs to another parent.");
		}
		if (reference && reference._parent !== this) {
			throw new Error("Invalid operation: The reference element belongs to another parent.");
		}

		throw new Error("Not implemented.");
	}

	removeChild = (child: CUIElement): CUIElement => {
		let index = -1;
		if (child._parent !== this || this._children === null || typeof this._children === "string" || (index = this._children.indexOf(child)) === -1) {
			throw new Error("Invalid operation: The child is not an element of children.");
		}
		child._parent = null;
		this._children.splice(index, 1);
		return child;
	}

	setText = (text: string): string => {
		if (this._children === null || typeof this._children === "string") {
			this._children = text;
			return text;
		}
		throw new Error("Invalid operation: The content is a cui element array.");
	}

};
