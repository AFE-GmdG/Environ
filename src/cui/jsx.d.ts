declare namespace JSX {
	interface IntrinsicElements {
		cuiPanel: any;
		cuiButton: any;
	}

	interface CUIElement extends Element { }
	interface CUIPanelElement extends CUIElement { }
	interface CUIButtonElement extends CUIElement { }

	type CUIFactory<P> = (props?: React.Attributes & P | null, ...children: React.ReactNode[]) => CUIElement<P>;

}
