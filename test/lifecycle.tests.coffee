expect          = require('chai').expect
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'

{Foo, DependsOnFoo} = require './lib/types'

describe 'Lifecycle', ->

#---------------------------------------------------------------------------------------------------

  describe 'Singleton lifecycle', ->

    describe 'given one binding: a->Foo(singleton)', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo).as.singleton()

      it 'should create an instance of Foo when "a" is requested', ->
        result = forge.get('a')
        expect(result).to.be.an.instanceOf(Foo)

      it 'should return the same instance of Foo for subsequent requests', ->
        result1 = forge.get('a')
        result2 = forge.get('a')
        expect(result1).to.equal(result2)

    describe 'given two bindings: dependent->DependsOnFoo(transient) and foo->Foo(singleton)', ->

      forge = new Forge()
      forge.bind('dependent').to.type(DependsOnFoo).as.transient()
      forge.bind('foo').to.type(Foo).as.singleton()

      it 'should inject the same instance of Foo into DependsOnFoo as is returned when "foo" is requested', ->
        foo = forge.get('foo')
        dependent = forge.get('dependent')
        expect(foo).to.equal(dependent.foo)

      it 'should inject the same instance of Foo into each instance of DependsOnFoo', ->
        dependent1 = forge.get('dependent')
        dependent2 = forge.get('dependent')
        expect(dependent1.foo).to.equal(dependent2.foo)

#---------------------------------------------------------------------------------------------------

  describe 'Transient lifecycle', ->

    describe 'given one binding: a->Foo, with a transient lifecycle', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo).as.transient()

      it 'should create an instance of Foo when "a" is requested', ->
        result = forge.get('a')
        expect(result).to.be.an.instanceOf(Foo)

      it 'should return a different instance of Foo for each request', ->
        result1 = forge.get('a')
        result2 = forge.get('a')
        expect(result1).to.not.equal(result2)

    describe 'given two bindings: dependent->DependsOnFoo(transient) and foo->Foo(transient)', ->

      forge = new Forge()
      forge.bind('dependent').to.type(DependsOnFoo).as.transient()
      forge.bind('foo').to.type(Foo).as.transient()

      it 'should inject different instances of Foo into DependsOnFoo as that returned when "foo" is requested', ->
        foo = forge.get('foo')
        dependent = forge.get('dependent')
        expect(foo).not.to.equal(dependent.foo)

      it 'should inject different instances of Foo into each instance of DependsOnFoo', ->
        dependent1 = forge.get('dependent')
        dependent2 = forge.get('dependent')
        expect(dependent1.foo).not.to.equal(dependent2.foo)

#---------------------------------------------------------------------------------------------------
