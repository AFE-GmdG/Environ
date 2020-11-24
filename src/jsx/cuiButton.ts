import { PropsWithChildren } from "./jsx";
import { CUIPanel } from "./cuiPanel";

export class CUIButton extends CUIPanel {
	constructor(props: PropsWithChildren<JSX.ButtonProps>) {
		super(props);
	}
}
