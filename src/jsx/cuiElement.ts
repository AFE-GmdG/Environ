//#region CUIElement

import { CUIContext } from "./cuiContext";

/** The Canvas UI Element is the most general base class from which all objects in a Canvas UI Environment inherit. */
export abstract class CUIElement {

	private _context: CUIContext | null;
	public get context(): CUIContext | null {
		return this._context;
	}
	public set context(value: CUIContext | null) {
		this._context = value;
	}

	constructor() {
		this._context = null;
	}

};

//#endregion
