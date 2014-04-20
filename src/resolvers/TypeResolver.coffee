assert   = require 'assert'
_        = require 'underscore'
Resolver = require './Resolver'

class TypeResolver extends Resolver

  constructor: (forge, binding, @type) ->
    super(forge, binding)
    assert @type?, 'The argument "type" must have a value'
    constructor   = @findConstructorToInspect(@type)
    @dependencies = @forge.inspector.getDependencies(constructor)

  resolve: (context, args) ->
    args = @resolveDependencies(context, @dependencies, args)
    ctor = @type.bind.apply(@type, [null].concat(args))
    return new ctor()

  findConstructorToInspect: (type) ->
    constructor = type
    while @forge.inspector.isAutoConstructor(constructor)
      constructor = constructor.__super__.constructor
    return constructor

  toString: ->
    "type{#{@type.name}}"

module.exports = TypeResolver
