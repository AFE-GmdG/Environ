declare namespace JSX {

	//#region Intrinsic Elements

	interface IntrinsicElements {
		panel: PanelProps;
		button: ButtonProps;
	}

	//#endregion

	type Key = string | number;

	interface ElementProps {
		id?: Key;
	}

	interface PanelProps extends ElementProps {
		margin?: string | number | TopRightBottomLeft;
		padding?: string | number | TopRightBottomLeft;
		width?: number;
		height?: number;
	}

	interface ButtonProps extends PanelProps {
		disabled?: boolean;
	}

	//#region Styling Attributes

	interface TopRightBottomLeft {
		top: number;
		right: number;
		bottom: number;
		left: number;
	}

	//#endregion

}
