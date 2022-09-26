export namespace Dispatcher {
	/**
	 * Simple wrapper for convenience and readability.\
	 * Creates a touple type `[K, [A1, ..., An]]` from `Event<K, A1, ..., An>`.
	 */
	export type Event <K, A = never, A2 = never, A3 = never, A4 = never, A5 = never, A6 = never, A7 = never, A8 = never, A9 = never> =
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [never, never, never, never, never, never, never, never, never]] ? [K, unknown[]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, never, never, never, never, never, never, never, never]] ? [K, [A]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, unknown, never, never, never, never, never, never, never]] ? [K, [A, A2]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, unknown, unknown, never, never, never, never, never, never]] ? [K, [A, A2, A3]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, unknown, unknown, unknown, never, never, never, never, never]] ? [K, [A, A2, A3, A4]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, unknown, unknown, unknown, unknown, never, never, never, never]] ? [K, [A, A2, A3, A4, A5]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, unknown, unknown, unknown, unknown, unknown, never, never, never]] ? [K, [A, A2, A3, A4, A5, A6]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, unknown, unknown, unknown, unknown, unknown, unknown, never, never]] ? [K, [A, A2, A3, A4, A5, A6, A7]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, never]] ? [K, [A, A2, A3, A4, A5, A6, A7, A8]] :
		[K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] extends [K, [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]] ? [K, [A, A2, A3, A4, A5, A6, A7, A8, A9]] :
		never;

	/**
	 * Creates a touple type `[K, [A1, ..., An]]` from an interface.
	 */
	export type FromInterface<I> = { [P in keyof I]: [P, I[P]]; }[keyof I];
}

type EventKey<T extends [unknown, unknown[]]> = T[0];
type EventArgs<T, K> = T extends [K, infer X] ? X : never;

export class Dispatcher<T extends [any, unknown[]]> {
	private listeners = new Map<unknown, Set<Function>>();

	/**
	 * Register a new event listener. Registering the same listener for the same event type multiple times is ignored.
	 */
	public addListener<K extends EventKey<T>>(event: K, listener: { (...arg: EventArgs<T, K>): void }) {
		this.listeners.get(event)?.add(listener) ?? this.listeners.set(event, new Set([listener]));
	}

	/**
	 * Removes a registered event listener.
	 */
	public removeListener<K extends EventKey<T>>(event: K, listener: { (...arg: EventArgs<T, K>): void }) {
		return this.listeners.get(event)?.delete(listener) ?? false;
	}

	/**
	 * Notifies all registered event listeners.
	 */
	public dispatch<K extends EventKey<T>>(event: K, ...arg: EventArgs<T, K>) {
		this.listeners.get(event)?.forEach(x => x(...arg));
	}
}

export default Dispatcher;
