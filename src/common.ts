export function delay(ms: number) {
	return new Promise<void>(resolve => {
		window.setTimeout(resolve, ms);
	});
}

export function invariant(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(message);
	}
}
