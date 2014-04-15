assert   = require 'assert'
_        = require 'underscore'
Resolver = require './Resolver'

class TypeResolver extends Resolver

  constructor: (forge, binding, @type) ->
    super(forge, binding)
    assert @type?, 'The argument "type" must have a value'
    @dependencies = @forge.inspector.getNamedDependencies(@type)

  resolve: ->
    args = _.map @dependencies, (name) => @binding.arguments[name] ? @forge.get(name)
    ctor = @type.bind.apply(@type, [null].concat(args))
    return new ctor()

  toString: ->
    "type{#{@type.name}}"

module.exports = TypeResolver
