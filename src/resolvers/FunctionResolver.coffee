assert   = require 'assert'
_        = require 'underscore'
Resolver = require './Resolver'

class FunctionResolver extends Resolver

  constructor: (forge, binding, @func) ->
    super(forge, binding)
    assert @func?, 'The argument "func" must have a value'
    @dependencies = @forge.inspector.getDependencies(@func)

  resolve: (args) ->
    args = @resolveDependencies(@dependencies, args)
    @func.apply(null, args)

  toString: ->
    'function'

module.exports = FunctionResolver
