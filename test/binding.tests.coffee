expect          = require('chai').expect
Container       = require '../src/Container'
ResolutionError = require '../src/errors/ResolutionError'
Foo             = require './lib/Foo'
Bar             = require './lib/Bar'

describe 'Binding', ->

  describe 'given a Container', ->

    describe 'with a type binding foo->Foo', ->

      container = new Container()
      container.bind('foo').to(Foo).asSingleton()

      it 'should create an instance of Foo when foo is requested', ->
        result = container.get('foo')
        expect(result).to.be.an.instanceOf(Foo)

    describe 'with type bindings foo->Foo and bar->Bar', ->

      container = new Container()
      container.bind('foo').to(Foo).asSingleton()
      container.bind('bar').to(Bar).asSingleton()

      it 'should inject an instance of Foo into an instance of Bar', ->
        result = container.get('bar')
        expect(result).to.be.an.instanceOf(Bar)
        expect(result.foo).to.be.an.instanceOf(Foo)

    describe 'with a type binding bar->Bar, and no binding for foo', ->

      container = new Container()
      container.bind('bar').to(Bar).asSingleton()

      it 'should throw a ResolutionError if bar is requested', ->
        resolve = -> container.get('bar')
        expect(resolve).to.throw(ResolutionError)
