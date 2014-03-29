expect          = require('chai').expect
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'
Foo             = require './lib/Foo'
Bar             = require './lib/Bar'
TypeWithHints   = require './lib/TypeWithHints'

describe 'Binding', ->

  describe 'given a type binding foo->Foo', ->

    forge = new Forge()
    forge.bind('foo').to.type(Foo)

    it 'should create an instance of Foo when foo is requested', ->
      result = forge.get('foo')
      expect(result).to.be.an.instanceOf(Foo)

  describe 'given type bindings foo->Foo and bar->Bar', ->

    forge = new Forge()
    forge.bind('foo').to.type(Foo)
    forge.bind('bar').to.type(Bar)

    it 'should inject an instance of Foo into an instance of Bar', ->
      result = forge.get('bar')
      expect(result).to.be.an.instanceOf(Bar)
      expect(result.foo).to.be.an.instanceOf(Foo)

  describe 'given a type binding bar->Bar, and no binding for foo', ->

    forge = new Forge()
    forge.bind('bar').to.type(Bar)

    it 'should throw a ResolutionError if bar is requested', ->
      resolve = -> forge.get('bar')
      expect(resolve).to.throw(ResolutionError)

  describe 'given an instance binding for foo', ->

    instance = new Foo()
    forge = new Forge()
    forge.bind('foo').to.instance(instance)

    it 'should return the bound instance when foo is requested', ->
      result = forge.get('foo')
      expect(result).to.equal(instance)

  describe 'given an function binding for foo', ->

    wasCalled = false
    func = ->
      wasCalled = true
      return new Foo()

    forge = new Forge()
    forge.bind('foo').to.function(func)

    it 'should call the bound function when foo is requested', ->
      result = forge.get('foo')
      expect(result).to.be.instanceOf(Foo)
      expect(wasCalled).to.be.true

  describe 'given a binding to a type that contains hints', ->

    forge = new Forge()
    forge.bind('foo').to.type(Foo)
    forge.bind('bar').to.type(Bar)
    forge.bind('hinted').to.type(TypeWithHints)

    it 'should inject an instance of Foo and Bar into an instance of TypeWithHints', ->
      result = forge.get('hinted')
      expect(result).to.be.an.instanceOf(TypeWithHints)
      expect(result.dep1).to.be.an.instanceOf(Foo)
      expect(result.dep2).to.be.an.instanceOf(Bar)
