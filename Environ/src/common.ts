type DebounceCallback = () => void;
const debounceMap = new Map<DebounceCallback, number>();

/**
 * Debounce a function.
 * The debounced function is only called if no further call occurs within 100 ms.
 * @param cb The function to debounce.
 */
export function debounce(cb: DebounceCallback) {
  let handle = debounceMap.get(cb);
  if (handle !== undefined) {
    window.clearTimeout(handle);
  }
  handle = window.setTimeout(() => {
    debounceMap.delete(cb);
    cb();
  }, 100);
  debounceMap.set(cb, handle);
}

/**
 * Returns a promise which is resolved after the delay in ms.
 *
 * The simples use is via async/await:
 * ```typescript
 * await delay(1000);
 * ```
 * @param ms The delay in ms.
 */
export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function invariant(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}
