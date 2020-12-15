import { Alignment } from "./alignment";
import { CUIContext } from "./cuiContext";
import { Size } from "./size";

export class CUIContainer {
  // #region Fields
  private _availableSize: Size;

  private _context: CUIContext;

  private _horizontalAlignment: Alignment;

  private _isDirty: boolean;

  private _verticalAlignment: Alignment;
  // #endregion

  // #region Properties
  get context(): CUIContext { return this._context; }

  get isDirty(): boolean { return this._isDirty; }
  // #endregion

  // #region ctor
  constructor(context: CUIContext, _element: React.ReactElement | React.FunctionComponentElement<any>) {
    this._availableSize = Size.infinite;
    this._context = context;
    this._horizontalAlignment = Alignment.Stretch;
    this._isDirty = true;
    this._verticalAlignment = Alignment.Stretch;
  }
  // #endregion

  // eslint-disable-next-line class-methods-use-this
  arrange(finalSize: Size): Size {
    if (!finalSize.isFinite) {
      throw new Error("The final size must not be infinite.");
    }

    if (finalSize.isEmpty) {
      return finalSize;
    }

    return finalSize;
  }

  measure(availableSize: Size): Size {
    this._availableSize = availableSize;
    return availableSize;
  }
}

export function isCUIContainer(item: any): item is CUIContainer {
  return item instanceof CUIContainer;
}
