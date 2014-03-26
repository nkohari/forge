# Forge

![](https://farm6.staticflickr.com/5541/9936685246_21e70691f0.jpg)

Forge is a dependency injection framework for Node.js. It was built primarily as an experiment,
and probably isn't production-ready just yet.

## Foreward, and forewarning

First things first: I'm fairly certain that the existence of this framework will be somewhat
controversial. The general sentiment is that in a loosely-typed, dynamic language like JavaScript,
framework-aided dependency injection is unnecessary.

Having now written two sizable projects in Node, I've come to believe that an object-oriented
approach backed by a dependency injection system is the most effective way to develop complex
solutions.

This is something I built to scratch my own itch, and have released it in the hopes that others
will find it useful as well.

## Getting started

You can install Forge from npm:

```
$ npm install forge-di
```

## So how's it work?

The API of Forge is inspired by some of my previous work on [Ninject](http://ninject.org),
a dependency injection framework for .NET. I wouldn't go so far as to call Forge "Ninject for Node,"
but it's not an entirely unreasonable moniker.

Forge, like many other DI frameworks, allow you to define loosely-coupled components in a declarative
way, and then wires them together for you as necessary. Here's a quick example of typical usage:

```coffeescript
Forge = require 'forge-di'

# A class with a single dependency
class Foo
  constructor: (@bar) ->

# A class with no dependencies
class Bar
  constructor: ->

# Declare your bindings
forge = new Forge()
forge.bind('foo').to.type(Foo)
forge.bind('bar').to.type(Bar)

# Resolve an instance, and Forge resolves the dependency graph for you
obj = forge.get('foo')
assert(obj instanceof Foo)
assert(obj.bar instanceof Bar)
```

Forge works by examining the names of the constructor parameters on your types. In the example above,
the constructor of the class `Foo` had a parameter called `bar`. Forge sees this as a dependency,
resolves the component named `bar` and passes the resolved instance to the constructor of `Foo`.

If you don't like this convention, you can add *component hints*, the syntax of which is reminiscent
of `use strict`:

```coffeescript
class TypeWithHints
  constructor: (@dependency1, @dependency2) ->
    "dependency1->foo"
    "dependency2->bar"
```

When Forge creates an instance of `TypeWithHints`, instead of trying to resolve components named
`dependency1` and `dependency2`, instead it will read the hints, and resolve components named `foo`
and `bar` instead.

## Lifecycles and garbage collection

More to come.

## License

Copyright &copy; 2014 Nate Kohari.
Released under the Apache 2.0 license. See the file LICENSE for details.

Image of forge &mdash; [Foyer de la forge Mustad](https://flic.kr/p/g957kq) by Frédéric BISSON (CC-BY)
