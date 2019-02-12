import { inject, Mode } from '../../src';

export class Foo {
  constructor() {}
}

export class Bar {
  constructor() {}
}

export class DependsOnFoo {
  foo: any;

  constructor(foo) {
    this.foo = foo;
  }
}

@inject({ depA: 'a', depB: 'b' })
export class TypeWithBindingHints {
  depA: any;
  depB: any;

  constructor(depA, depB) {
    this.depA = depA;
    this.depB = depB;
  }
}

@inject({ deps: { name: 'dep', mode: Mode.All } })
export class TypeWithAllBindingHint {
  deps: any;

  constructor(deps) {
    this.deps = deps;
  }
}

@inject({ dep: { name: 'dep', hint: 'foo' } })
export class TypeWithConditionalBindingHint {
  dep: any;

  constructor(dep) {
    this.dep = dep;
  }
}

export class DependsOnForge {
  forge: any;

  constructor(forge) {
    this.forge = forge;
  }
}

export class CircularA {
  b: any;

  constructor(b) {
    this.b = b;
  }
}

export class CircularB {
  a: any;

  constructor(a) {
    this.a = a;
  }
}

export class Parent {
  foo: any;

  constructor(foo) {
    this.foo = foo;
  }
}

export class ChildWithAutoConstructor extends Parent {}

export class ChildWithExplicitConstructor extends Parent {
  bar: any;

  constructor(foo, bar) {
    super(foo);
    this.bar = bar;
  }
}

export class ChildOfChildWithAutoConstructor extends ChildWithAutoConstructor {}

export class ChildOfChildWithExplicitConstructor extends ChildWithExplicitConstructor {}
