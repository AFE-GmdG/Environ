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
		onClick?: (e: any) => void;
	}

	//#region Styling Attributes

	interface RGB {
		r: number;
		g: number;
		b: number;
	}

	interface HSL {
		h: number;
		s: number;
		l: number;
	}

	interface TopRightBottomLeft {
		top: number;
		right: number;
		bottom: number;
		left: number;
	}

	//#endregion

}
