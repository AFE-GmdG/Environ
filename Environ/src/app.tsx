import * as React from "react";
import * as ReactDOM from "react-dom";
import { debounce } from "./common";
import { getCUIContext } from "./cui";

const kagami = require("./assets/kagami.png").default;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const div = document.getElementById("app") as HTMLDivElement;
const context = getCUIContext(canvas, 0.122, 0.122, 0.122);
window.addEventListener("resize", () => debounce(context.resize));

type AppProps = {
  onClick: () => void;
};

const CuiApp: React.FC<AppProps> = (props) => {
  debugger;

  const { onClick } = props;
  const [isEnabled, setIsEnabled] = React.useState(true);

  return (
    <cuiPanel>
      <cuiButton onClick={onClick} disabled={!isEnabled}>This is a cui button.</cuiButton>
      <cuiButton onClick={() => setIsEnabled(!isEnabled)}>Enable/Disable other cui button.</cuiButton>
    </cuiPanel>
  );
};

const ReactApp: React.FC<AppProps> = (props) => {
  debugger;

  const { onClick } = props;
  const [isEnabled, setIsEnabled] = React.useState(true);

  return (
    <div>
      <button type="button" onClick={onClick} disabled={!isEnabled}>This is a html button.</button>
      <button type="button" onClick={() => setIsEnabled(!isEnabled)}>Enable/Disable other html button.</button>
    </div>
  );
};

function appOnClick(caller: string) {
  console.log(`${caller}: OnClick()`);
}

ReactDOM.render([
  <img key="imgage" alt="Single Rendered Tag" src={kagami} style={{ width: "100%" }} />,
  <ReactApp onClick={() => appOnClick("ReactApp")} key="app" />,
], div);
context.render(<CuiApp onClick={() => appOnClick("CuiApp")} />);
