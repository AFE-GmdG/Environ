import { JSX, getCUIContext, FC } from "./jsx";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = getCUIContext(canvas, 0.122, 0.122, 0.122);
window.addEventListener("resize", context.resize);

type AppProps = {
	id: string;
};

const App: FC<AppProps> = props => {
	const { id, children } = props;

	return (
		<panel>{ children }</panel>
	);
};

context.render(
	<App id="app">
		<button disabled={ true }>This is a Button.</button>
	</App>
);
