import { JSX, getCUIContext, FC } from "./jsx";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = getCUIContext(canvas, 0.122, 0.122, 0.122);
window.addEventListener("resize", context.resize);

type AppProps = {
};

const App: FC<AppProps> = _props => {
	//const { children } = props;
	const [isEnabled, setIsEnabled] = JSX.useState(true);

	return (
		<panel>
			<button disabled={ isEnabled }>This is a Button</button>
			<button onClick={() => setIsEnabled(!isEnabled) }>Enable/Disable other Button</button>
		</panel>
	);
};

context.render(<App />);
