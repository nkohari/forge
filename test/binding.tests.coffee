expect    = require('chai').expect
Container = require '../src/Container'
Foo       = require './lib/Foo'
Bar       = require './lib/Bar'

describe 'Given a Container', ->

  container = new Container()

  describe 'with a single type binding from foo to Foo', ->

    container.bind('foo', Foo)

    it 'should an instance of Foo when foo is requested', ->

      result = container.get('foo')
      expect(result).to.be.an.instanceOf(Foo)

  describe 'with two bindings', ->

    container.bind('foo', Foo)
    container.bind('bar', Bar)

    it 'should inject an instance of Foo into an instance of Bar', ->

      result = container.get('bar')
      expect(result).to.be.an.instanceOf(Bar)
      expect(result.foo).to.be.an.instanceOf(Foo)
