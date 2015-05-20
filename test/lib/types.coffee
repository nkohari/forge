class Foo
  constructor: () ->

class Bar
  constructor: () ->

class DependsOnFoo
  constructor: (@foo) ->

class TypeWithBindingHints
  constructor: (@dep1, @dep2) ->
    "dep1->a"
    "dep2->b"

class TypeWithAllBindingHint
  constructor: (@deps) ->
    "deps -> all dep"

class TypeWithConditionalBindingHint
  constructor: (@dep) ->
    "dep -> dep: foo"

class TypeWithBindingHintsStatic
  constructor: (@dep1, @dep2) ->
  @__hints__:
    dep1:
      name: 'a'
    dep2:
      name: 'b'


class TypeWithAllBindingHintStatic
  constructor: (@deps) ->
  @__hints__:
    deps:
      name: 'dep'
      all: true


class TypeWithConditionalBindingHintStatic
  constructor: (@dep) ->
  @__hints__:
    dep:
      name: 'dep'
      hint: 'foo'


class DependsOnForge
  constructor: (@forge) ->

class CircularA
  constructor: (@b) ->

class CircularB
  constructor: (@a) ->

class Parent
  constructor: (@foo) ->

class ChildWithAutoConstructor extends Parent

class ChildWithExplicitConstructor extends Parent
  constructor: (foo, @bar) ->
    super(foo)

class ChildOfChildWithAutoConstructor extends ChildWithAutoConstructor

class ChildOfChildWithExplicitConstructor extends ChildWithExplicitConstructor

module.exports = {
  Foo
  Bar
  DependsOnFoo
  TypeWithBindingHints
  TypeWithAllBindingHint
  TypeWithConditionalBindingHint
  TypeWithBindingHintsStatic
  TypeWithAllBindingHintStatic
  TypeWithConditionalBindingHintStatic
  DependsOnForge
  CircularA
  CircularB
  Parent
  ChildWithAutoConstructor
  ChildWithExplicitConstructor
  ChildOfChildWithAutoConstructor
  ChildOfChildWithExplicitConstructor
}
