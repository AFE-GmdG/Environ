import { invariant } from "./invariant";

// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactInternalTypes.js#L46
export type PriorityLevel = 99 | 98 | 97 | 96 | 95 | 90;

// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactFiberHooks.new.js#L96
export type Update<TState, TAction> = {
	lane: /*Lane*/number; // https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactFiberLane.js
	action: TAction;
	//eagerReducer: Reducer<TState, TAction> | null;
	eagerState: TState | null;
	next: Update<TState, TAction>;
	priority?: PriorityLevel;
};

// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactFiberHooks.new.js#L105
export type UpdateQueue<TState, TAction> = {
	pending: Update<TState, TAction> | null;
	dispatch: Dispatch<TAction> | null;
	//lastRenderedReducer: Reducer<TState, TAction> | null;
	lastRenderedState: TState | null;
};

// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactInternalTypes.js#L30
export type HookType = "useState" | "useEffect" | "useLayoutEffect";

// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactFiberHooks.new.js#L119
export type Hook = {
	memorizedState: any;
	baseState: any;
	baseQueue: Update<any, any> | null;
	queue: UpdateQueue<any, any> | null;
	next: Hook | null;
};

// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactHookEffectTags.js#L10
export enum HookFlags {
	NoFlags = /****/ 0b000,
	HasEffect = /**/ 0b001,
	Layout = /*****/ 0b010,
	Passive = /****/ 0b100,
}

// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactFiberHooks.new.js#L127
export type Effect = {
	tag: HookFlags;
	create: () => (() => void) | void;
	destroy: (() => void) | void;
	deps: any[] | null;
	next: Effect;
};

export type BasicStateAction<TState> = ((state: TState) => TState) | TState;
//export type Reducer<TState, TAction> = (state: TState, action: TAction) => TState;
export type Dispatch<TAction> = (action: TAction) => void;
export type Dispatcher = {
	useState: <TState>(initialState: StateResolver<TState>) => [TState, Dispatch<BasicStateAction<TState>>];
	useEffect: any;
	useLayoutEffect: any;
}
export type StateResolver<TState> = (() => TState) | TState;

function isStateFunction<TState>(state: StateResolver<TState>): state is () => TState {
	return typeof state === "function";
}

const CurrentDispatcher = {
	current: null as (Dispatcher | null),
};

export function resolveDispatcher() {
	const dispatcher = CurrentDispatcher.current;
	invariant(dispatcher !== null, "Invalid hook call.");
	return dispatcher!;
}

let currentHook: Hook | null = null;
let workInProgressHook: Hook | null = null;
let currentHookNameInDev: HookType | null = null;

// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactFiberHooks.new.js#L193
// function mountHookTypesDev() {
// 	if (process.env.NODE_ENV === "development") {
// 		const hookName = currentHookNameInDev;

// 	}
// }

function mountWorkInProgressHook(): Hook {
	const hook = {
		memorizedState: null,
		baseState: null,
		baseQueue: null,
		queue: null,
		next: null
	};

	if (workInProgressHook === null) {
		// This is the first hook in the list
		workInProgressHook = hook;
	} else {
		// Append to the end of the list
		workInProgressHook = workInProgressHook.next = hook;
	}
	return workInProgressHook;
}

function updateWorkInProgressHook(): Hook {
	// This function is used both for updates and for re-renders triggered by a
	// render phase update. It assumes there is either a current hook we can
	// clone, or a work-in-progress hook from a previous render pass that we can
	// use as a base. When we reach the end of the base list, we must switch to
	// the dispatcher used for mounts.
	let nextCurrentHook: null | Hook;
	if (currentHook === null) {
		// const current = currentlyRenderingFiber.alternate;
		// if (current !== null) {
		//   nextCurrentHook = current.memoizedState;
		// } else {
		//   nextCurrentHook = null;
		// }
		nextCurrentHook = null;
	} else {
		nextCurrentHook = currentHook.next;
	}

	let nextWorkInProgressHook: null | Hook;
	if (workInProgressHook === null) {
		nextWorkInProgressHook = null; //currentlyRenderingFiber.memoizedState;
	} else {
		nextWorkInProgressHook = workInProgressHook.next;
	}

	if (nextWorkInProgressHook !== null) {
		// There's already a work-in-progress. Reuse it.
		workInProgressHook = nextWorkInProgressHook;
		nextWorkInProgressHook = workInProgressHook.next;

		currentHook = nextCurrentHook;
	} else {
		// Clone from the current hook.

		invariant(
			nextCurrentHook !== null,
			'Rendered more hooks than during the previous render.',
		);
		currentHook = nextCurrentHook!;

		const newHook: Hook = {
			memorizedState: currentHook.memorizedState,
			baseState: currentHook.baseState,
			baseQueue: currentHook.baseQueue,
			queue: currentHook.queue,
			next: null,
		};

		if (workInProgressHook === null) {
			// This is the first hook in the list.
			workInProgressHook = newHook;
		} else {
			// Append to the end of the list.
			workInProgressHook = workInProgressHook.next = newHook;
		}
	}
	return workInProgressHook;
}

function mountState<TState>(initialState: StateResolver<TState>): [TState, Dispatch<BasicStateAction<TState>>] {
	const hook = mountWorkInProgressHook();
	if (isStateFunction(initialState)) {
		initialState = initialState();
	}
	hook.memorizedState = hook.baseState = initialState;
	// https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactFiberHooks.new.js#L1107
	const queue: UpdateQueue<TState, any> = hook.queue = {
		pending: null,
		dispatch: null,
		//lastRenderedReducer: basicStateReducer,
		lastRenderedState: initialState,
	};
	const dispatch: Dispatch<BasicStateAction<TState>> = (queue.dispatch = (dispatchAction.bind(
		null,
		null, //currentlyRenderingFiber,
		queue
	) as Dispatch<BasicStateAction<TState>>));
	return [hook.memorizedState, dispatch];
}

function dispatchAction<TState, TAction>(_fiber: any, _queue: UpdateQueue<TState, TAction>, _action: TAction) {
	if (process.env.NODE_ENV === "development") {
		if (typeof arguments[3] === "function") {
			console.error("State updates from the useState() Hook don't support the second callback argument.\n" +
				"To execute a side effect after rendering, declare it in the component body with useEffect().");
		}
	}

	const eventTime = Date.now(); // requestEventTime();

}

const HooksDispatcherOnMountInDEV: Dispatcher = {
	//https://github.com/facebook/react/blob/e6a0f276307fcb2f1c5bc41d630c5e4c9e95a037/packages/react-reconciler/src/ReactFiberHooks.new.js#L2010
	useState<TState>(initialState: StateResolver<TState>): [TState, Dispatch<BasicStateAction<TState>>] {
		currentHookNameInDev = "useState";
		//mountHookTypesDev();
		const prevDispatcher = CurrentDispatcher.current;
		CurrentDispatcher.current = InvalidNestedHooksDispatcherOnMountInDEV;
		try {
			return mountState(initialState);
		} finally {
			CurrentDispatcher.current = prevDispatcher;
		}
	},

	useEffect: null,

	useLayoutEffect: null,
};

const InvalidNestedHooksDispatcherOnMountInDEV: Dispatcher = {
	useState<TState>(initialState: StateResolver<TState>): [TState, Dispatch<BasicStateAction<TState>>] {
		currentHookNameInDev = 'useState';
		warnInvalidHookAccess();
		//mountHookTypesDev();
		const prevDispatcher = CurrentDispatcher.current;
		CurrentDispatcher.current = InvalidNestedHooksDispatcherOnMountInDEV;
		try {
			return mountState(initialState);
		} finally {
			CurrentDispatcher.current = prevDispatcher;
		}
	},

	useEffect: null,

	useLayoutEffect: null,
};

function warnInvalidHookAccess() {
	console.error("Do not call Hooks insede useEffect(...) or other build-in Hooks.");
}
