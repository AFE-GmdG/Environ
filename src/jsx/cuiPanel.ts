import { PropsWithChildren } from "./jsx";
import { CUIElement } from "./cuiElement";

export class CUIPanel extends CUIElement {

	id?: string;
	margin?: JSX.TopRightBottomLeft;
	padding?: JSX.TopRightBottomLeft;
	width?: number;

	constructor(_props: PropsWithChildren<JSX.PanelProps>) {
		super();
	}
}
