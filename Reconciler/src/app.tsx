import * as React from "react";
import Renderer from "./renderer";

const App: React.FC<{}> = (props) => {
  const { children } = props;

  return (
    <>
      <h1>Hello React Conciler</h1>
      { children}
    </>
  );
};

Renderer.render(<App />, document.getElementById("app") as HTMLDivElement);
