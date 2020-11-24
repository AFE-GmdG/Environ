/// <reference path="./jsx.d.ts" />

import { Rect } from "./rect";
import { Size } from "./size";
import { render } from "./canvas";

type Key = string | number;
type JsxElementConstructor<P> = ((props: P) => JsxElement | null);

export class JsxElement<P = any, T extends keyof JSX.IntrinsicElements | JsxElementConstructor<any> = keyof JSX.IntrinsicElements | JsxElementConstructor<any>> {

	public readonly type: T;
	public props: P;
	public key: Key | null;

	private _minimumSize: Size;

	constructor(type: T, props: P, key?: Key | null) {
		this.type = type;
		this.props = props;
		this.key = key === undefined ? null : key;

		this._minimumSize = new Size(0, 0);
	}

	public measure(_availableSize: Size): void {
	}

	public arrange(_finalRect: Rect): void {
	}
}

type JsxElementFactory =
	keyof JSX.IntrinsicElements |
	((props?: JSX.IntrinsicElement) => JsxElement);


function createElement(factory: JsxElementFactory, props: JSX.IntrinsicElement, ...children: JsxElementFactory[]): JsxElement | null {
	if (typeof factory === "function") {
		return factory(props);
	}

	for (const child of children) {
		console.log(child);
	}

	return new JsxElement(factory, props);
}

export const JSX = {
	createElement,
	render
};
