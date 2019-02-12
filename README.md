# Forge

![](https://farm6.staticflickr.com/5541/9936685246_21e70691f0.jpg)

Forge is a dependency injection framework for Node.js. It was originally built as an experiment,
but is now in use in production at [Adzerk](http://adzerk.com/), where the software it powers
handles billions of requests each month.

**Table of Contents**

- [Motivation](#motivation)
- [New in 12.0.0](#new-in-1200)
- [Getting started](#getting-started)
- [So how's it work?](#so-hows-it-work)
- [Multiple bindings for a single component](#multiple-bindings-for-a-single-component)
- [Conditional bindings and resolution hints](#conditional-bindings-and-resolution-hints)
- [Dependency hints](#dependency-hints)
- [Lifecycles](#lifecycles)
- [Explicit arguments](#explicit-arguments)
- [Unbinding and Rebinding](#unbinding-and-rebinding)
- [License](#license)

## Motivation

Forge is a dependency injection framework for Node. Having written several sizable projects in Node,
I've come to believe that an object-oriented approach backed by a dependency injection system is
the most effective way to develop complex systems. You can do this injection by hand, of course,
but Forge tries to make things a little bit more automatic.

The goal is to make it easier to build software with a good design (highly cohesive, loosely coupled)
than it is to build software with a bad design.

I know that the general sentiment is that in a loosely-typed, dynamic language like JavaScript,
framework-aided dependency injection is unnecessary. This is something I built to scratch my own itch,
and have released it in the hopes that others will find it useful as well. If you'd like to use Forge,
please do, and if you don't, please don't. Either way, please don't feel it necessary to tell me
that I'm "doing it wrong". :)

## New in 12.0.0

After its humble beginnings in CoffeeScript, and after moving to ES6 in 11.0.0, Forge has now moved to TypeScript.
This only matters for development, since it's shipped transpiled to ES6 with first-class type definitions.

### Breaking changes!

The previous bare string syntax for dependency hints has been removed in 12.0.0. Honestly, it was a terrible design
decision that _sort of_ made sense when using CoffeeScript, but has no place in a post-ES6 world. Even though they
are technically supported by the ES spec, most transpilers will strip the bare strings out of code.

Instead, manual dependency hints can now be specified with `inject()`, which can be used as a decorator or as a
higher-order function. For example:

```js
import Forge, { inject } from 'forge-di';

@inject({ foo: 'bar' })
class Parent {
  constructor(foo) {
    this.foo = foo;
  }
}

class Foo {}
class Bar {}

const forge = new Forge();
forge.bind('parent').to.type(Parent);
forge.bind('foo').to.type(Foo);
forge.bind('bar').to.type(Bar);

// When Forge resolves the instance of Parent, the dependency hint will cause it to inject
// an instance of Bar instead of the instance of Foo that it would normally inject.
const parent = forge.get('parent');
assert(child.foo instanceof Bar);
```

Ephemeral bindings and the `Forge.create()` function have also been removed. They were an antipattern that
should be avoided.

## Getting started

You can install Forge from npm:

```
$ npm install forge-di
```

## So how's it work?

The API of Forge is inspired by some of my previous work on [Ninject](http://ninject.org),
a dependency injection framework for .NET. I wouldn't go so far as to call Forge "Ninject for Node,"
but it's not an entirely unreasonable moniker.

Forge allows you to define loosely-coupled components in a declarative way, and then wires them
together for you as necessary. Here's a quick example of typical usage:

```js
import Forge from 'forge-di';

// A class with a single dependency
class Foo {
  constructor(bar) {
    this.bar = bar;
  }
}

// A class with no dependencies
class Bar {
  constructor() {}
}

// Declare your bindings
let forge = new Forge();
forge.bind('foo').to.type(Foo);
forge.bind('bar').to.type(Bar);

// Resolve an instance, and Forge resolves the dependency graph for you
let obj = forge.get('foo');
assert(obj instanceof Foo);
assert(obj.bar instanceof Bar);
```

Forge works by examining the names of the constructor parameters on your types. In the example above,
the constructor of the class `Foo` had a parameter called `bar`. Forge sees this as a dependency,
resolves the component named `bar` and passes the resolved instance to the constructor of `Foo`.

Instead of constructors, you can also bind to functions, which Forge will call to resolve
the dependency. (This is helpful if you need to do something more manual to resolve the dependency.)
If the function has any parameters, Forge will attempt to resolve them when calling the function.

```js
import Forge from 'forge-di';

class Foo {
  constructor(bar) {
    this.bar = bar;
  }
}

class Bar {
  constructor() {}
}

// A simple factory function with a single dependency
let createFoo = bar => new Foo(bar);

// Declare a binding to the function, and another to the dependency it requires
let forge = new Forge();
forge.bind('foo').to.function(createFoo);
forge.bind('bar').to.type(Bar);

// Forge will call the function
let foo = forge.get('foo');
assert(foo instanceof Foo);
assert(foo.bar instanceof Bar);
```

## Multiple bindings for a single component

You can also register multiple bindings for a single component name. For example, you might want
to create a class that can operate as a facade over an arbitrary number of plugins:

```js
import Forge from 'forge-di';

class PluginOne {
  constructor() {}
}

class PluginTwo {
  constructor() {}
}

class Facade {
  constructor(plugins) {
    this.plugins = plugins;
  }
}

// Register multiple bindings for the "plugins" component
let forge = new Forge();
forge.bind('plugins').to.type(PluginOne);
forge.bind('plugins').to.type(PluginTwo);
forge.bind('facade').to.type(Facade);

// Forge passes an array of instances to the Facade constructor
let facade = forge.get('facade');
assert(typeof facade.plugins === 'array');
assert(facade.plugins.length === 2);
assert(facade.plugins[0] instanceof PluginOne);
assert(facade.plugins[1] instanceof PluginTwo);
```

To support this behavior, `Forge.get()` will return a single instance when only one matching
binding is available, and an array of instances when multiple bindings are available.

To be certain that you only resolve a single instance, you can call `Forge.getOne()` instead.
This function will throw an exception if more than one matching binding would be resolved.

If, instead, you want to resolve _all_ bindings for a given component, you can call `Forge.getAll()`.
This will ignore the conditions specified on the bindings, and resolve all of them. This
function will always return an array of instances, even if only a single instance was resolved.

## Conditional bindings and resolution hints

Since you can register multiple bindings for a single component, you might not always want
to resolve all of them for a given scenario. To allow this, Forge supports _conditional bindings_,
which are bindings with a predicate attached. These predicates examine _resolution hints_
that you pass to `Forge.get()`. For example:

```js
import Forge from 'forge-di';

class RedFoo {
  constructor() {}
}

class BlueFoo {
  constructor() {}
}

// Register multiple bindings to the same component, with predicates
let forge = new Forge();

// Here's the short form, which just does an equality (==) check against the hint:
forge
  .bind('foo')
  .to.type(RedFoo)
  .when('red');

// And here's the long form, which allows you to pass in a predicate function:
forge
  .bind('foo')
  .to.type(BlueFoo)
  .when(hint => hint === 'blue');

// Forge passes the resolution hint to the bindings' predicates to determine which to resolve
let foo1 = forge.get('foo', 'red');
let foo2 = forge.get('foo', 'blue');
assert(foo1 instanceof RedFoo);
assert(foo2 instanceof BlueFoo);
```

Hints don't need to be scalars; they can be anything you want, as long as the predicates
associated with your conditional bindings understand how to evaluate them.

If multiple bindings match, `Forge.get()` will return an array of results.
(See [Multiple Bindings for a Single Component](#multiple-bindings-for-a-single-component) above.)

## Dependency hints

If you don't want to rely on the convention of naming your constructor arguments the same as your
components, you can add _dependency hints_ to your types instead via the `inject()` function.
You can use this as a decorator, like this:

```js
@inject({ a: 'foo', b: 'bar' })
class Something {
  constructor(a, b) { ... }
}
```

...or as a higher-order function, like this:

```js
inject({ a: 'foo', b: 'bar' })(
  class Something {
    constructor(a, b) { ... }
  }
)
```

Here's an example of what Forge does when you use `inject()`.

```js
@inject({ dependency1: 'foo', dependency2: 'bar' })
class TypeWithHints {
  constructor(dependency1, dependency2) {
    this.dependency1 = dependency1;
    this.dependency2 = dependency2;
  }
}
```

When Forge creates an instance of `TypeWithHints`, instead of trying to resolve components named
`dependency1` and `dependency2`, instead it will read the hints, and resolve components named `foo`
and `bar` instead.

If you have [conditional bindings](#conditional-bindings-and-resolution-hints) registered, you can
use dependency hints to specify that you'd like to resolve _all_ of the available components,
regardless of whether conditions have been set.

```js
import Forge, { inject, Mode } from 'forge-di';

class RedPlugin {
  constructor() {}
}

class BluePlugin {
  constructor() {}
}

@inject({ plugins: { name: 'plugin', mode: Mode.All } })
class Facade {
  constructor(plugins) {
    this.plugins = plugins;
  }
}

// Register multiple conditional bindings for the "plugin" component
let forge = new Forge();
forge
  .bind('plugin')
  .to.type(RedPlugin)
  .when('red');
forge
  .bind('plugin')
  .to.type(BluePlugin)
  .when('blue');
forge.bind('facade').to.type(Facade);

// Forge disregards the conditions and passes an array of instances to the Facade constructor
let facade = forge.get('facade');
assert(typeof facade.plugins === 'array');
assert(facade.plugins.length === 2);
assert(facade.plugins[0] instanceof RedPlugin);
assert(facade.plugins[1] instanceof BluePlugin);
```

Finally, if you have conditional bindings registered, and you'd only like to resolve a single one,
you can specify an additional hint you'd like to use to resolve the dependency in the hint itself.
(Yo dawg, I heard you like hints...)

```js
import Forge, { inject } from 'forge-di';

class RedPlugin {
  constructor() {}
}

class BluePlugin {
  constructor() {}
}

@inject({ plugin: { hint: 'blue' } })
class Facade {
  constructor(plugin) {
    this.plugin = plugin;
  }
}

// Register multiple conditional bindings for the "plugin" component
let forge = new Forge();
forge
  .bind('plugin')
  .to.type(RedPlugin)
  .when('red');
forge
  .bind('plugin')
  .to.type(BluePlugin)
  .when('blue');
forge.bind('facade').to.type(Facade);

// Forge uses the additional hint to determine which conditional binding to resolve
let facade = forge.get('facade');
assert(facade.plugin instanceof BluePlugin);
```

## Lifecycles

By default, once a binding has been resolved, the result will be cached and re-used for
subsequent requests. This is called a _singleton_ lifecycle, after the pattern of the same
name.

You can define a lifecycle for a binding using the following syntax:

```js
import Forge from 'forge-di';

class Foo {
  constructor(bar) {
    this.bar = bar;
  }
}

class Bar {
  constructor() {}
}

let forge = new Forge();

// Since singleton is the default lifecycle, you can also omit .as.singleton()
forge.bind('foo').to.type(Foo);
forge
  .bind('bar')
  .to.type(Bar)
  .as.singleton();

// The instance of Bar is created on the first request, and then is re-used when creating Foo
let bar = forge.get('bar');
let foo = forge.get('foo');
assert(foo.bar === bar);
```

Forge also supports a _transient_ lifecycle, which means that a new result will be resolved
on each request for a given component. Here's the same example as above, using the transient
lifecycle instead:

```js
import Forge from 'forge-di';

class Foo {
  constructor(bar1) {
    this.bar = bar1;
  }
}

class Bar {
  constructor() {}
}

let forge = new Forge();

forge.bind('foo').to.type(Foo);
forge
  .bind('bar')
  .to.type(Bar)
  .as.transient();

// There were two instances of Bar created
let bar = forge.get('bar');
let foo = forge.get('foo');
assert(foo.bar !== bar);
```

## Explicit arguments

Rather than allowing Forge to figure everything out for you, sometimes you may want
to take manual control over part of the dependency resolution process. To allow this,
Forge lets you supply _explicit arguments_ to your bindings, overriding dependencies
by name.

Here's an example:

```js
import Forge from 'forge-di';

// A class with a single dependency
class Foo {
  constructor(bar) {
    this.bar = bar;
  }
}

// Manually create an instance of the dependency
let manuallyCreatedBar = new Bar();

// Tell the binding when "bar" is requested, just return the instance we just manually created.
let forge = new Forge();
forge
  .bind('foo')
  .to.type(Foo)
  .with({ bar: manuallyCreatedBar });

// Forge will pass the explicit argument to the constructor of Foo
let foo = forge.get('foo');
assert(foo instanceof Foo);
assert(foo.bar === manuallyCreatedBar);
```

You can also use this to specify arguments to bound functions. This is helpful to create
factory functions if you need them:

```js
import Forge from 'forge-di';

// A factory function with a single argument
let create = bar => new Foo(bar);

// Manually create an instance of the dependency
let manuallyCreatedBar = new Bar();

// Explicitly set the value for the parameter named "bar"
let forge = new Forge();
forge
  .bind('foo')
  .to.function(createFoo)
  .with({ bar: manuallyCreatedBar });

// Forge will pass the explicit argument to the function.
let foo = forge.get();
assert(foo instanceof Foo);
assert(foo.bar === manuallyCreatedBar);
```

Note: if (for some reason) you specify a [dependency hint](#dependency-hints) on one of
the arguments to a constructor or function, the explicit argument name must match the
_hinted name_, not the _actual name_ of the argument.

## Dependencies on the Forge itself

Sometimes, you might want your components to do on-demand resolution of dependencies,
rather than having them injected immediately when the component is created. To do this,
you can create a factory type, or you can just ask Forge to pass a reference of itself
to the created component.

Here's an example of a dependency on the Forge itself:

```js
import Forge from 'forge-di';

class DependsOnForge {
  constructor(forge) {
    this.forge = forge;
  }
}

let forge = new Forge();
forge.bind('dependent').to.type(DependsOnForge);

let obj = forge.get('dependent');
assert(obj instanceof DependsOnForge);
assert(obj.forge === forge);
```

_Use this sparingly!_ You should always favor constructor injection to service location.

## Unbinding and Rebinding

Forge supports altering bindings after they have been defined via two methods:

1. `unbind()`, which removes any existing binding and does not replace it.
2. `rebind()`, which removes any existing bindings and begins a new binding definition.

Here's an example of unbinding:

```js
import Forge from 'forge-di';

class Foo {
  constructor() {}
}

let forge = new Forge();
forge.bind('a').to.type(Foo);

// Returns the number of bindings that were removed.
let count = forge.unbind('a');
assert(count === 1);

// This will throw a ResolutionError.
forge.get('a');
```

And here's an example of rebinding:

```js
import Forge from 'forge-di';

class Foo {
  constructor() {}
}

class Bar {
  constructor() {}
}

let forge = new Forge();

forge.bind('a').to.type(Foo);
let a = forge.get(Foo);
assert(a instanceof Foo);

forge.rebind('a').to.type(Bar);
a = forge.get('a');
assert(a instanceof Bar);
```

_Be careful with unbinding and rebinding!_ Treating your container as mutable can make it very
easy to get into a confusing situation where the bindings between your components are unclear.
This functionality is primarily provided to make setting up integration tests easier &mdash;
avoid using it at runtime.

## License

Copyright &copy; 2014-2017 Nate Kohari.
Released under the Apache 2.0 license. See the file LICENSE for details.

Image of forge &mdash; [Foyer de la forge Mustad](https://flic.kr/p/g957kq) by Frédéric BISSON (CC-BY)
