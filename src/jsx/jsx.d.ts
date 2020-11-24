declare namespace JSX {

	//#region Intrinsic Elements

	interface IntrinsicElements {
		panel: IntrinsicPanelElement;
		button: IntrinsicButtonElement;
	}

	interface IntrinsicElement {
		id?: string;
	}

	interface IntrinsicPanelElement extends IntrinsicElement {
		margin?: string | number | Margin;
	}

	interface IntrinsicButtonElement extends IntrinsicPanelElement {
		disabled?: boolean;
	}

	//#endregion

	//#region Styling Attributes

	interface Margin {
		top: number;
		right: number;
		bottom: number;
		left: number;
	}

	//#endregion

	//#region Events
	/*
	interface JsxEvent<T = unknown, C = unknown> {
		currentTarget: C;
		target: T;
		bubbles: boolean;
		cancelable: boolean;
		defaultPrevented: boolean;
		preventDefault(): void;
		stopPropagation(): void;
		timestamp: number;
		type: string;
	}

	interface SyntheticEvent<T, E> extends BaseSyntheticEvent<E, EventTarget & T> {}

	type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

	interface EventAttributes {
	}

	interface FocusEventAttributes<T> {
		onFocus?: FocusEventHandler<T>;
		onBlur?: FocusEventHandler<T>;
	}

	interface MouseEventAttributes {
	}
	*/
	//#endregion

}
