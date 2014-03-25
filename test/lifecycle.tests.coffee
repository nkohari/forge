expect          = require('chai').expect
Container       = require '../src/Container'
ResolutionError = require '../src/errors/ResolutionError'
Foo             = require './lib/Foo'
Bar             = require './lib/Bar'

describe 'Lifecycle', ->

  describe 'given a Container', ->

    describe 'with a singleton binding for foo', ->

      container = new Container()
      container.bind('foo').to(Foo).asSingleton()

      it 'should create an instance of Foo when foo is requested', ->
        result = container.get('foo')
        expect(result).to.be.an.instanceOf(Foo)

      it 'should return the same instance of Foo for subsquent requests', ->
        result1 = container.get('foo')
        result2 = container.get('foo')
        expect(result1).to.equal(result2)

    describe 'with a transient binding for foo', ->

      container = new Container()
      container.bind('foo').to(Foo).asTransient()

      it 'should create an instance of Foo when foo is requested', ->
        result = container.get('foo')
        expect(result).to.be.an.instanceOf(Foo)

      it 'should return a different instance of Foo for each request', ->
        result1 = container.get('foo')
        result2 = container.get('foo')
        expect(result1).to.not.equal(result2)
