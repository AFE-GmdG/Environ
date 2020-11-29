/// <reference path="./jsx.d.ts" />

import { CUIElement } from "./cuiElement";
import { CUIPanel } from "./cuiPanel";
import { CUIButton } from "./cuiButton";
import { BasicStateAction, Dispatch, resolveDispatcher } from "./dispatcher";

export type PossibleChild = CUIElement | string | null;

export type PropsWithChildren<TProps extends {} = {}> =
	TProps & {
		children?: PossibleChild[];
	};

export type FC<TProps extends {} = {}> = ((props: PropsWithChildren<TProps>) => CUIElement | null);

export type CUIElementFactory<TProps extends {} = {}> = keyof JSX.IntrinsicElements | FC<TProps>;

function cui<TProps extends {} = {}>(factory: CUIElementFactory<TProps>, props: TProps, ...children: PossibleChild[]): CUIElement | null {
	const propsWithChildren: PropsWithChildren<TProps> = {
		...props,
		children: children && children.length ? children : undefined
	};

	if (typeof factory === "function") {
		return factory(propsWithChildren);
	}

	// for (const child of children) {
	// 	console.log(child);
	// }

	switch (factory) {
		case "panel":
			return new CUIPanel(propsWithChildren);
		case "button":
			return new CUIButton(propsWithChildren);
		default:
			throw new Error("Unknown intrinsic element.");
	}
}

function useState<S>(initialState: (() => S) | S): [S, Dispatch<BasicStateAction<S>>] {
	return resolveDispatcher()
		.useState(initialState);
}

export const JSX = {
	cui,
	useState
};
