// https://github.com/meziantou/PasswordManager/blob/28ee089aad917cd7f6717f778d1068ef5dda69ae/Meziantou.PasswordManager.Web/wwwroot/js/declarations/jsx.d.ts

declare namespace JSX {
	interface IntrinsicElements {
		panel: IntrinsicPanelElement
	}

	interface IntrinsicElement {
		id?: string;
		className?: string;
	}

	interface IntrinsicPanelElement extends IntrinsicElement {
		margin?: string | number | Margin;
	}

	interface Margin {
		top: number;
		right: number;
		bottom: number;
		left: number;
	}

}
