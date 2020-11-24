import { JSX, getCUIContext } from "./jsx";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = getCUIContext(canvas, 0.122, 0.122, 0.122);
window.addEventListener("resize", context.resize);

// const App: any = () => { };
