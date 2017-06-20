export class Foo {
  constructor() {}
}

export class Bar {
  constructor() {}
}

export class DependsOnFoo {
  constructor(foo) {
    this.foo = foo;
  }
}

export class TypeWithBindingHints {
  constructor(depA, depB) {
    "depA->a";
    "depB->b";
    this.depA = depA;
    this.depB = depB;
  }
}

export class TypeWithAllBindingHint {
  constructor(deps) {
    "deps -> all dep";
    this.deps = deps;
  }
}

export class TypeWithConditionalBindingHint {
  constructor(dep) {
    "dep -> dep: foo";
    this.dep = dep;
  }
}

export class DependsOnForge {
  constructor(forge) {
    this.forge = forge;
  }
}

export class CircularA {
  constructor(b) {
    this.b = b;
  }
}

export class CircularB {
  constructor(a) {
    this.a = a;
  }
}

export class Parent {
  constructor(foo) {
    this.foo = foo;
  }
}

export class ChildWithAutoConstructor extends Parent {}

export class ChildWithExplicitConstructor extends Parent {
  constructor(foo, bar) {
    super(foo);
    this.bar = bar;
  }
}

export class ChildOfChildWithAutoConstructor extends ChildWithAutoConstructor {}

export class ChildOfChildWithExplicitConstructor extends ChildWithExplicitConstructor {}
