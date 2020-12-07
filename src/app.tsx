import * as React from "react";
import * as ReactDOM from "react-dom";
import { debounce } from "./common";
import { getCUIContext } from "./cui";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const div = document.getElementById("app") as HTMLDivElement;
const context = getCUIContext(canvas, 0.122, 0.122, 0.122);
window.addEventListener("resize", () => debounce(context.resize));

type AppProps = {
};

const CuiApp: React.FC<AppProps> = (_props) => {
  // const { children } = props;
  const [isEnabled, setIsEnabled] = React.useState(true);

  return (
    <cuiPanel>
      <cuiButton disabled={!isEnabled}>This is a cui button.</cuiButton>
      <cuiButton onClick={() => setIsEnabled(!isEnabled)}>Enable/Disable other cui button.</cuiButton>
    </cuiPanel>
  );
};

const ReactApp: React.FC<AppProps> = (_props) => {
  const [isEnabled, setIsEnabled] = React.useState(true);

  return (
    <div>
      <button type="button" disabled={!isEnabled}>This is a html button.</button>
      <button type="button" onClick={() => setIsEnabled(!isEnabled)}>Enable/Disable other html button.</button>
    </div>
  );
};

context.render(<CuiApp />);
ReactDOM.render(<ReactApp />, div);
