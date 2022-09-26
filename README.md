# Type-Safe Event Dispatcher

This is simple event dispatcher which implements the mediator pattern, where a well-known centralised object is available to send and recieve messages.

Messages sent (with `.dispatch()`) have an assigned event type (or event key) which can be any type (Symbol, string, number, objects, functions etc.).
Recievers can subscribe (with `.addListener()`) to these specifict event types.

## WHY?

There are too many Event Dispatcher implementations on the net. Yet here I am making another one.
To be honest a fully functional event dispatcher can be made with 3 lines of code.
What this package additionally provides are a set of type declarations attached to the dispatcher class.
With these type declarations your IDE will provide code completion for all possible event.

## Usage

```ts
import { Dispatcher } from 'ts-dispatcher';

// make a type which lists all possible events
type DispatchedEvents =
  Dispatcher.Event<'event-key-1', string, number> |
  Dispatcher.Event<'event-key-2', string> |
  Dispatcher.Event<'event-key-3', number>;

// create a dispatcher
const dispatcher = new Dispatcher<DispatchedEvents>();

dispatcher.dispatch('event-key-1', 'abc', 123); // OK.
dispatcher.dispatch('event-key-1', 'abc'); // type error: missing third parameter (number).

dispatcher.dispatch('event-key-2', 'abc'); // OK.
dispatcher.dispatch('event-key-2', 'abc', 123); // type error: unknown third parameter (number).

dispatcher.addListener('event-key-3', (param1) => console.log(param1)); // OK.
dispatcher.addListener('event-key-3', (param1, param2) => console.log(param1)); // type error: unknown argument param2.

dispatcher.addListener('event-key-4', () => console.log(4)); // type error: unknown 'event-key-4' argument.
```

## Usage with interfaces

```ts
// src/component.ts

import { dispatcher } from './dispatcher.ts';

declare global {
  interface DispatchedEvents {
    'event-key-1': [string, number];
  }
}

dispatcher.dispatch('event-key-1', 'abc', 123); // OK.
dispatcher.dispatch('event-key-1', 'abc'); // type error: missing third parameter (number).
```

```ts
// src/dispatcher.ts

import { Dispatcher } from 'ts-dispatcher';

export const dispatcher = new Dispatcher<Dispatcher.FromInterface<DispatchedEvents>>();
```

> Note: With interfaces only string keys are possible as event keys, but allows you to separate the dispatched event types into modules.

## Docs

### `new Dispatcher<Events>()`

The `Events` generic parameter expects a touple type (`[T1, T2]`) where `T1` is the event key and `T2` is an array of the expected arguments of the dispatched message.

Example:
```ts
const dispatcher = new Dispatcher<['hello', [string, number]] | ['world', [string]] | ['no-params', []]>();
```

There is a helper type to make touples more readable: `Dispatcher.Event<Key, P1, P2, ...>`

Example:
```ts
const dispatcher = new Dispatcher<Dispatcher.Event<'hello', string, number> | Dispatcher.Event<'world', string> | Dispatcher.Event<'no-params'>>();
```

### `dispatcher.dispatch(eventKey, param1, param2, ...)`

Notifies all registered event listeners passing the param1, param2, ... to the listener as arguments.

### `dispatcher.addListener(eventKey, listener)`

Register a new event listener. Registering the same listener for the same event type multiple times is ignored.

### `dispatcher.removeListener(eventKey, listener)`

Removes a registered event listener.
