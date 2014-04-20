expect          = require('chai').expect
types           = require './lib/types'
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'

{Foo, Bar, Parent} = types
{ChildWithAutoConstructor, ChildWithExplicitConstructor} = types
{ChildOfChildWithAutoConstructor, ChildOfChildWithExplicitConstructor} = types

describe 'Inheritance', ->

#---------------------------------------------------------------------------------------------------

  describe 'One level', ->

    describe 'given two bindings: foo->type{Foo} and dependent->type{ChildWithAutoConstructor}', ->

      forge = new Forge()
      forge.bind('foo').to.type(Foo)
      forge.bind('dependent').to.type(ChildWithAutoConstructor)

      it 'should inject an instance of Foo into an instance of ChildWithAutoConstructor', ->
        result = forge.get('dependent')
        expect(result).to.be.an.instanceOf(ChildWithAutoConstructor)
        expect(result.foo).to.be.an.instanceOf(Foo)

    describe 'given three bindings: foo->type{Foo}, bar->type{Bar}, and dependent->type{ChildWithExplicitConstructor}', ->

      forge = new Forge()
      forge.bind('foo').to.type(Foo)
      forge.bind('bar').to.type(Bar)
      forge.bind('dependent').to.type(ChildWithExplicitConstructor)

      it 'should inject instances of Foo and Bar into an instance of ChildWithExplicitConstructor', ->
        result = forge.get('dependent')
        expect(result).to.be.an.instanceOf(ChildWithExplicitConstructor)
        expect(result.foo).to.be.an.instanceOf(Foo)
        expect(result.bar).to.be.an.instanceOf(Bar)

#---------------------------------------------------------------------------------------------------

  describe 'Two levels', ->

    describe 'given two bindings: foo->type{Foo} and dependent->type{ChildOfChildWithAutoConstructor}', ->

      forge = new Forge()
      forge.bind('foo').to.type(Foo)
      forge.bind('dependent').to.type(ChildOfChildWithAutoConstructor)

      it 'should inject an instance of Foo into an instance of ChildOfChildWithAutoConstructor', ->
        result = forge.get('dependent')
        expect(result).to.be.an.instanceOf(ChildOfChildWithAutoConstructor)
        expect(result.foo).to.be.an.instanceOf(Foo)

    describe 'given three bindings: foo->type{Foo}, bar->type{Bar}, and dependent->type{ChildOfChildWithExplicitConstructor}', ->

      forge = new Forge()
      forge.bind('foo').to.type(Foo)
      forge.bind('bar').to.type(Bar)
      forge.bind('dependent').to.type(ChildOfChildWithExplicitConstructor)

      it 'should inject instances of Foo and Bar into an instance of ChildOfChildWithExplicitConstructor', ->
        result = forge.get('dependent')
        expect(result).to.be.an.instanceOf(ChildOfChildWithExplicitConstructor)
        expect(result.foo).to.be.an.instanceOf(Foo)
        expect(result.bar).to.be.an.instanceOf(Bar)

#---------------------------------------------------------------------------------------------------
