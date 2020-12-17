type DebounceCallback = () => void;
const debounceMap = new Map<DebounceCallback, number>();
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
