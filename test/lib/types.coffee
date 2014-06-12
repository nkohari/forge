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
  DependsOnForge
  CircularA
  CircularB
  Parent
  ChildWithAutoConstructor
  ChildWithExplicitConstructor
  ChildOfChildWithAutoConstructor
  ChildOfChildWithExplicitConstructor
}