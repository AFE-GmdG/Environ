export interface IDisposable {
  dispose(): void;
}

export function using<Disposable extends IDisposable>(disposable: Disposable, cb: (disposable: Disposable) => void) {
  try {
    cb(disposable);
  } finally {
    disposable.dispose();
  }
}

export async function usingAsync<Disposable extends IDisposable>(disposable: Disposable, cb: (disposable: Disposable) => Promise<void>) {
  try {
    await cb(disposable);
  } finally {
    disposable.dispose();
  }
}
