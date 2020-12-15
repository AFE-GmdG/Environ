import { CUIContainer, isCUIContainer } from "./cuiContainer";
import { CUIContext } from "./cuiContext";

export type Unit = "px" | "%" | "em" | "rem";

export class Length {
  value: number;

  unit: Unit;

  constructor(value: number = 0, unit: Unit = "px") {
    if (Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
      throw new Error("The value must be a positive number.");
    }

    this.value = value;
    this.unit = unit;
  }

  calculatePixel(element: CUIContainer | CUIContext, _orientation: "Horiziontal" | "Vertical" = "Horiziontal") {
    if (this.unit === "px") {
      // eslint-disable-next-line no-bitwise
      return this.value | 0;
    }

    if (this.unit === "rem") {
      // eslint-disable-next-line no-bitwise
      return (this.value * 14) | 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const context = isCUIContainer(element)
      ? element.context
      : element;

    throw new Error("Not implemented.");
  }
}
