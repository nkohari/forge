expect          = require('chai').expect
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'
Foo             = require './lib/Foo'
Bar             = require './lib/Bar'

describe 'Lifecycle', ->

  describe 'given a Forge', ->

    describe 'with a singleton binding for foo', ->

      forge = new Forge()
      forge.bind('foo').to.type(Foo).as.singleton()

      it 'should create an instance of Foo when foo is requested', ->
        result = forge.get('foo')
        expect(result).to.be.an.instanceOf(Foo)

      it 'should return the same instance of Foo for subsquent requests', ->
        result1 = forge.get('foo')
        result2 = forge.get('foo')
        expect(result1).to.equal(result2)

    describe 'with a transient binding for foo', ->

      forge = new Forge()
      forge.bind('foo').to.type(Foo).as.transient()

      it 'should create an instance of Foo when foo is requested', ->
        result = forge.get('foo')
        expect(result).to.be.an.instanceOf(Foo)

      it 'should return a different instance of Foo for each request', ->
        result1 = forge.get('foo')
        result2 = forge.get('foo')
        expect(result1).to.not.equal(result2)
