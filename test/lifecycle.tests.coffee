expect          = require('chai').expect
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'

{Foo} = require './lib/types'

describe 'Lifecycles', ->

#---------------------------------------------------------------------------------------------------

  describe 'Singleton', ->

    describe 'given one binding: a->Foo, with a singleton lifecycle', ->

      forge = new Forge()
      forge.bind('a').to.type(Foo).as.singleton()

      it 'should create an instance of Foo when "a" is requested', ->
        result = forge.get('a')
        expect(result).to.be.an.instanceOf(Foo)

      it 'should return the same instance of Foo for subsequent requests', ->
        result1 = forge.get('a')
        result2 = forge.get('a')
        expect(result1).to.equal(result2)

#---------------------------------------------------------------------------------------------------

  describe 'Transient', ->

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

#---------------------------------------------------------------------------------------------------
