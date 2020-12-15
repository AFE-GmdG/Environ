/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace JSX {
  interface IntrinsicElements {
    cuiPanel: any;
    cuiButton: any;
    // cuiPanel: CUIPanelElement;
    // cuiButton: CUIButtonElement;
  }

  interface CUIElement extends Element { }
  interface CUIPanelElement extends CUIElement { }
  interface CUIButtonElement extends CUIElement { }

  type CUIFactory<P> = (props?: React.Attributes & P | null, ...children: React.ReactNode[]) => CUIElement<P>;

}
