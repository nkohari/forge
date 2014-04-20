expect          = require('chai').expect
_               = require 'underscore'
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'

{Foo, DependsOnFoo, CircularA, CircularB} = require './lib/types'

describe 'Resolution', ->

#---------------------------------------------------------------------------------------------------

  describe 'Circular dependency checking', ->

    describe 'given two bindings, a->CircularA and b->CircularB', ->

      forge = new Forge()
      forge.bind('a').to.type(CircularA)
      forge.bind('b').to.type(CircularB)

      expectedMessage = (name) ->
        "Could not resolve component named #{name}: Circular dependencies detected"

      it 'should throw a ResolutionError when "a" is requested', ->
        resolve = -> forge.get('a')
        expect(resolve).to.throw(ResolutionError, expectedMessage('a'))

      it 'should throw a ResolutionError when "b" is requested', ->
        resolve = -> forge.get('b')
        expect(resolve).to.throw(ResolutionError, expectedMessage('b'))

#---------------------------------------------------------------------------------------------------

  describe 'Contextual argument overrides', ->

    describe 'given one binding, a->DependsOnFoo, with a singleton lifecycle', ->

      forge = new Forge()
      forge.bind('a').to.type(DependsOnFoo)

      it 'should inject the overridden argument that is passed to the first call to get()', ->
        foos = [new Foo(), new Foo()]
        results = _.map foos, (foo) -> forge.get('a', null, {foo})
        _.each results, (result, index) ->
          expect(result).to.be.an.instanceOf(DependsOnFoo)
          expect(result.foo).to.equal(foos[0]) # Always the first one

    describe 'given one binding, a->DependsOnFoo, with a transient lifecycle', ->

      forge = new Forge()
      forge.bind('a').to.type(DependsOnFoo).as.transient()

      it 'should inject the overridden argument when one is supplied to get()', ->
        foos    = [new Foo(), new Foo()]
        results = _.map foos, (foo) -> forge.get('a', null, {foo})
        _.each results, (result, index) ->
          expect(result).to.be.an.instanceOf(DependsOnFoo)
          expect(result.foo).to.equal(foos[index])
    
#---------------------------------------------------------------------------------------------------
