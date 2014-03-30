expect          = require('chai').expect
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'

{Foo, Bar, DependsOnFoo, TypeWithBindingHints} = require './lib/types'

describe 'Binding', ->

#---------------------------------------------------------------------------------------------------

  describe 'Basics', ->

    describe 'given one binding: a->type{Foo}', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo)

      it 'should create an instance of Foo when "a" is requested', ->
        a = forge.get('a')
        expect(a).to.be.an.instanceOf(Foo)

    describe 'given two bindings: a->type{Foo} and b->type{Bar}', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo)
      forge.bind('b').to.type(Bar)

      it 'should create an instance of Foo when "a" is requested and Bar when "b" is requested', ->
        a = forge.get('a')
        b = forge.get('b')
        expect(a).to.be.an.instanceOf(Foo)
        expect(b).to.be.an.instanceOf(Bar)

#---------------------------------------------------------------------------------------------------

  describe 'Dependency resolution', ->

    describe 'given two bindings: foo->type{Foo} and dependent->type{DependsOnFoo}', ->

      forge = new Forge()
      forge.bind('foo').to.type(Foo)
      forge.bind('dependent').to.type(DependsOnFoo)

      it 'should inject an instance of Foo into an instance of DependsOnFoo when "dependent" is requested', ->
        result = forge.get('dependent')
        expect(result).to.be.an.instanceOf(DependsOnFoo)
        expect(result.foo).to.be.an.instanceOf(Foo)

    describe 'given one binding: dependent->type{DependsOnFoo}, and no binding for foo', ->

      forge = new Forge()
      forge.bind('dependent').to.type(DependsOnFoo)

      it 'should throw a ResolutionError if "dependent" is requested', ->
        resolve = -> forge.get('dependent')
        expect(resolve).to.throw(ResolutionError)

#---------------------------------------------------------------------------------------------------

  describe 'Instance and function bindings', ->

    describe 'given one binding: a->instance{Foo}', ->

      instance = new Foo()
      forge = new Forge()
      forge.bind('a').to.instance(instance)

      it 'should return the bound instance when "a" is requested', ->
        result = forge.get('a')
        expect(result).to.equal(instance)

    describe 'given one binding: a->function', ->

      wasCalled = false
      func = ->
        wasCalled = true
        return new Foo()

      forge = new Forge()
      forge.bind('a').to.function(func)

      it 'should call the bound function when "a" is requested', ->
        a = forge.get('a')
        expect(a).to.be.instanceOf(Foo)
        expect(wasCalled).to.be.true

#---------------------------------------------------------------------------------------------------

  describe 'Binding hints', ->

    describe 'given a binding to a type that contains binding hints', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo)
      forge.bind('b').to.type(Bar)
      forge.bind('hints').to.type(TypeWithBindingHints)

      it 'should inject an instance of Foo and Bar into an instance of TypeWithBindingHints', ->
        result = forge.get('hints')
        expect(result).to.be.an.instanceOf(TypeWithBindingHints)
        expect(result.dep1).to.be.an.instanceOf(Foo)
        expect(result.dep2).to.be.an.instanceOf(Bar)

#---------------------------------------------------------------------------------------------------

  describe 'Multiple bindings for same service', ->

    describe 'given two bindings: a->type{Foo} and a->type{Foo}', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo)
      forge.bind('a').to.type(Foo)

      it 'should return an array of two instances of Foo when get() is called for "a"', ->
        results = forge.get('a')
        expect(results).to.be.an.array
        expect(results.length).to.equal(2)
        expect(results[0]).to.be.an.instanceOf(Foo)
        expect(results[1]).to.be.an.instanceOf(Foo)

      it 'should throw an exception if getOne() is called for "a"', ->
        resolve = -> forge.getOne('a')
        expect(resolve).to.throw(ResolutionError)

#---------------------------------------------------------------------------------------------------

  describe 'Conditional bindings and resolution hints', ->

    describe 'given two conditional bindings: a?->type{Foo} and a?->type{Bar}', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo).when (hint) -> hint == 1
      forge.bind('a').to.type(Bar).when (hint) -> hint == 2

      it 'should throw an exception if get() is called for "a" with no resolution hint', ->
        resolve = -> forge.get('a')
        expect(resolve).to.throw(ResolutionError)

      it 'should return an instance of Foo when get() is called for "a" with the correct hint', ->
        a = forge.get('a', 1)
        expect(a).to.be.an.instanceOf(Foo)

      it 'should return an instance of Bar when get() is called for "a" with the correct hint', ->
        a = forge.get('a', 2)
        expect(a).to.be.an.instanceOf(Bar)

#---------------------------------------------------------------------------------------------------
