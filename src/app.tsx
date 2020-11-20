import { JSX } from "./jsx";

const App = (props: any) => {
	const { id, className } = props;

	if(id === "foo") {
		return null;
	}

	return (<panel id="App" className={ className }></panel>);
};

JSX.render(
	<panel id="panel1" margin={ 100 }>
		<App className="FooBar" />
	</panel>,
	document.getElementById("canvas") as HTMLCanvasElement);
