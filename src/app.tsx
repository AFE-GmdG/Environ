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
};

const CuiApp: React.FC<AppProps> = (_props) => {
  const [isEnabled, setIsEnabled] = React.useState(true);
  debugger;
  return (
    <cuiPanel>
      <cuiButton disabled={!isEnabled}>This is a cui button.</cuiButton>
      <cuiButton onClick={() => setIsEnabled(!isEnabled)}>Enable/Disable other cui button.</cuiButton>
    </cuiPanel>
  );
};

// const ReactApp: React.FC<AppProps> = (_props) => {
//   const [isEnabled, setIsEnabled] = React.useState(true);
//   debugger;
//   return (
//     <div>
//       <button type="button" disabled={!isEnabled}>This is a html button.</button>
//       <button type="button" onClick={() => setIsEnabled(!isEnabled)}>Enable/Disable other html button.</button>
//     </div>
//   );
// };

ReactDOM.render(<img alt="Single Rendered Tag" src={kagami} style={{ width: "100%" }} />, div);
// context.render(<cuiPanel onClick={(e: any) => console.log({ onClick: e })} />);
context.render(<CuiApp />);
