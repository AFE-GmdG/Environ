import { CUIContainer, isCUIContainer } from "../cuiContainer";
import { CUIContext } from "../cuiContext";
import { Orientation } from "./orientation";
import { Unit } from "./unit";

export class Length {
  value: number;

  unit: Unit;

  constructor(value: number = 0, unit: Unit = Unit.Px) {
    if (Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
      throw new Error("The value must be a positive number.");
    }

    this.value = value;
    this.unit = unit;
  }

  calculatePixel(element: CUIContainer | CUIContext, _orientation: Orientation = Orientation.Horiziontal) {
    if (this.unit === Unit.Px) {
      // eslint-disable-next-line no-bitwise
      return this.value | 0;
    }

    if (this.unit === Unit.Rem) {
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
