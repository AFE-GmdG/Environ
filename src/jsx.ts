/// <reference path="./jsx.d.ts" />

class JsxElement {

	public readonly tagName: keyof JSX.IntrinsicElements;

	constructor(tagName: keyof JSX.IntrinsicElements) {
		this.tagName = tagName;
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

	return new JsxElement(factory);
}

function render(element: JsxElement, _canvas: HTMLCanvasElement) {
	console.log(element.tagName);
}

export const JSX = {
	createElement,
	render
};
