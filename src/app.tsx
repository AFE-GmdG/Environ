import * as React from "react";
import { getCUIContext } from "./cui";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = getCUIContext(canvas, 0.122, 0.122, 0.122);
window.addEventListener("resize", context.resize);

type AppProps = {
};

const App: React.FC<AppProps> = _props => {
	//const { children } = props;
	const [isEnabled, setIsEnabled] = React.useState(true);

	return (
		<cuiPanel>
			<cuiButton disabled={ isEnabled }>This is a cuiButton</cuiButton>
			<cuiButton onClick={() => setIsEnabled(!isEnabled) }>Enable/Disable other cuiButton</cuiButton>
		</cuiPanel>
	);
};

context.render(<App />);
