expect          = require('chai').expect
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'

{Foo, Bar, DependsOnFoo, TypeWithBindingHints, TypeWithAllBindingHint, TypeWithConditionalBindingHint, DependsOnForge} = require './lib/types'

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

      forge = new Forge()
      instance = new Foo()
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

    describe 'given a binding to a type that contains an "all" binding hint', ->

      forge = new Forge()
      forge.bind('dep').to.type(Foo).when('foo')
      forge.bind('dep').to.type(Bar).when('bar')
      forge.bind('hints').to.type(TypeWithAllBindingHint)

      it 'should inject an array containing instances of Foo and Bar into an instance of TypeWithAllBindingHint', ->
        result = forge.get('hints')
        expect(result).to.be.an.instanceOf(TypeWithAllBindingHint)
        expect(result.deps).to.be.an.instanceOf(Array)
        expect(result.deps[0]).to.be.an.instanceOf(Foo)
        expect(result.deps[1]).to.be.an.instanceOf(Bar)

    describe 'given a binding to a type that contains a conditional binding hint', ->

      forge = new Forge()
      forge.bind('dep').to.type(Foo).when('foo')
      forge.bind('dep').to.type(Bar).when('bar')
      forge.bind('hints').to.type(TypeWithConditionalBindingHint)

      it 'should inject an instance of Foo into an instance of TypeWithConditionalBindingHint', ->
        result = forge.get('hints')
        expect(result).to.be.an.instanceOf(TypeWithConditionalBindingHint)
        expect(result.dep).to.be.an.instanceOf(Foo)

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

    describe 'given two conditional bindings: a?->type{Foo} and a?->type{Bar}, using equality conditions', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo).when(1)
      forge.bind('a').to.type(Bar).when(2)

      it 'should throw an exception if get() is called for "a" with no resolution hint', ->
        resolve = -> forge.get('a')
        expect(resolve).to.throw(ResolutionError)

      it 'should return an instance of Foo when get() is called for "a" with the correct hint', ->
        a = forge.get('a', 1)
        expect(a).to.be.an.instanceOf(Foo)

      it 'should return an instance of Bar when get() is called for "a" with the correct hint', ->
        a = forge.get('a', 2)
        expect(a).to.be.an.instanceOf(Bar)

      it 'should return an array of an instance of Foo and Bar when getAll() is called for "a"', ->
        results = forge.getAll('a')
        expect(results.length).to.equal(2)
        expect(results[0]).to.be.an.instanceOf(Foo)
        expect(results[1]).to.be.an.instanceOf(Bar)

    describe 'given two conditional bindings: a?->type{Foo} and a?->type{Bar}, using explicit predicates', ->

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

      it 'should return an array of an instance of Foo and Bar when getAll() is called for "a"', ->
        results = forge.getAll('a')
        expect(results.length).to.equal(2)
        expect(results[0]).to.be.an.instanceOf(Foo)
        expect(results[1]).to.be.an.instanceOf(Bar)

#---------------------------------------------------------------------------------------------------

  describe 'Unbinding', ->

    describe 'given one binding: a->type{Foo}', ->

      forge = undefined
      beforeEach ->
        forge = new Forge()
        forge.bind('a').to.type(Foo)

      it 'should return 1 when unbind() is called for "a"', ->
        result = forge.unbind('a')
        expect(result).to.equal(1)

      it 'should return 0 when unbind() is called for "b"', ->
        result = forge.unbind('b')
        expect(result).to.equal(0)

      it 'should throw an exception if get() is called for "a" after unbinding', ->
        forge.unbind('a')
        resolve = -> forge.get('a')
        expect(resolve).to.throw(ResolutionError)

    describe 'given two bindings: a->type{Foo}, a->type{Bar}', ->

      forge = undefined
      beforeEach ->
        forge = new Forge()
        forge.bind('a').to.type(Foo)
        forge.bind('a').to.type(Bar)

      it 'should return 2 when unbind() is called for "a"', ->
        result = forge.unbind('a')
        expect(result).to.equal(2)

      it 'should return 0 when unbind() is called for "b"', ->
        result = forge.unbind('b')
        expect(result).to.equal(0)

      it 'should throw an exception if get() is called for "a" after unbinding', ->
        forge.unbind('a')
        resolve = -> forge.get('a')
        expect(resolve).to.throw(ResolutionError)

    describe 'given two bindings: a->type{Foo}, b->type{Bar}', ->

      forge = undefined
      beforeEach ->
        forge = new Forge()
        forge.bind('a').to.type(Foo)
        forge.bind('b').to.type(Bar)

      it 'should return 1 when unbind() is called for "a"', ->
        result = forge.unbind('a')
        expect(result).to.equal(1)

      it 'should return 1 when unbind() is called for "b"', ->
        result = forge.unbind('b')
        expect(result).to.equal(1)

      it 'should throw an exception if get() is called for "a" after unbinding "a"', ->
        forge.unbind('a')
        resolve = -> forge.get('a')
        expect(resolve).to.throw(ResolutionError)

      it 'should return an instance of Bar if get() is called for "b" after unbinding "a"', ->
        forge.unbind('a')
        b = forge.get('b')
        expect(b).to.be.an.instanceOf(Bar)

#---------------------------------------------------------------------------------------------------

  describe 'Rebinding', ->

    describe 'given one binding: a->type{Foo}', ->

      forge = undefined
      beforeEach ->
        forge = new Forge()
        forge.bind('a').to.type(Foo)

      describe 'and a rebinding: a->type{Bar}', ->
        it 'should return an instance of Bar when get() is called for "a"', ->
          forge.rebind('a').to.type(Bar)
          a = forge.get('a')
          expect(a).to.be.an.instanceOf(Bar)

      describe 'and a rebinding: b->type{Bar}', ->
        it 'should return an instance of Bar when get() is called for "b"', ->
          forge.rebind('b').to.type(Bar)
          b = forge.get('b')
          expect(b).to.be.an.instanceOf(Bar)

    describe 'given two bindings: a->type{Foo} and a->type{Bar}', ->

      forge = undefined
      beforeEach ->
        forge = new Forge()
        forge.bind('a').to.type(Foo)
        forge.bind('a').to.type(Bar)

      describe 'and a rebinding: a->type{Bar}', ->

        it 'should return an instance of Bar when get() is called for "a"', ->
          forge.rebind('a').to.type(Bar)
          a = forge.get('a')
          expect(a).to.be.an.instanceOf(Bar)

      describe 'and a rebinding: b->type{Bar}', ->

        it 'should return an instance of Bar when get() is called for "b"', ->
          forge.rebind('b').to.type(Bar)
          b = forge.get('b')
          expect(b).to.be.an.instanceOf(Bar)

    describe 'given two bindings: a->type{Foo} and b->type{Bar}', ->

      forge = undefined
      beforeEach ->
        forge = new Forge()
        forge.bind('a').to.type(Foo)
        forge.bind('b').to.type(Bar)

      describe 'and a rebinding: a->type{Bar}', ->

        it 'should return an instance of Bar when get() is called for "a"', ->
          forge.rebind('a').to.type(Bar)
          a = forge.get('a')
          expect(a).to.be.an.instanceOf(Bar)

        it 'should return an instance of Bar when get() is called for "b"', ->
          forge.rebind('a').to.type(Bar)
          b = forge.get('b')
          expect(b).to.be.an.instanceOf(Bar)

      describe 'and a rebinding: b->type{Bar}', ->

        it 'should return an instance of Foo when get() is called for "a"', ->
          forge.rebind('b').to.type(Bar)
          a = forge.get('a')
          expect(a).to.be.an.instanceOf(Foo)
        
        it 'should return an instance of Bar when get() is called for "b"', ->
          forge.rebind('b').to.type(Bar)
          b = forge.get('b')
          expect(b).to.be.an.instanceOf(Bar)

#---------------------------------------------------------------------------------------------------

  describe 'Argument overrides', ->

    describe 'given one binding, a->type{DependsOnFoo}, with an argument override', ->

      expectedDependency = new Foo()

      forge = new Forge()
      forge.bind('a').to.type(DependsOnFoo).with(foo: expectedDependency)

      it 'should inject the overridden argument into the constructor', ->
        a = forge.get('a')
        expect(a).to.be.an.instanceOf(DependsOnFoo)
        expect(a.foo).to.equal(expectedDependency)

    describe 'given one binding, a->function, with an argument override', ->

      expectedDependency = new Foo()
      argumentReceived = undefined
      resolve = (foo) ->
        argumentReceived = foo
        new DependsOnFoo(foo)

      forge = new Forge()
      forge.bind('a').to.function(resolve).with(foo: expectedDependency)

      it 'should pass the overridden argument to the function', ->
        a = forge.get('a')
        expect(argumentReceived).to.equal(expectedDependency)
        expect(a).to.be.an.instanceOf(DependsOnFoo)
        expect(a.foo).to.equal(expectedDependency)

    describe 'given one binding, a->function, with a dependency hint and an argument override', ->

      expectedDependency = new Foo()
      argumentReceived = undefined
      resolve = (arg) ->
        "arg->foo"
        argumentReceived = arg
        new DependsOnFoo(arg)

      forge = new Forge()
      forge.bind('a').to.function(resolve).with(foo: expectedDependency)

      it 'should pass the overridden argument to the function', ->
        a = forge.get('a')
        expect(argumentReceived).to.equal(expectedDependency)
        expect(a).to.be.an.instanceOf(DependsOnFoo)
        expect(a.foo).to.equal(expectedDependency)

#---------------------------------------------------------------------------------------------------

  describe 'Dependencies on the Forge', ->

    describe 'given a binding, a->type{DependsOnForge}', ->

      forge = new Forge()
      forge.bind('a').to.type(DependsOnForge)
        
      it 'should inject the Forge when get() is called for "a"', ->
        a = forge.get('a')
        expect(a).to.be.an.instanceOf(DependsOnForge)
        expect(a.forge).to.equal(forge)

#---------------------------------------------------------------------------------------------------
