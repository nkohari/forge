assert   = require 'assert'
Resolver = require './Resolver'

class FunctionResolver extends Resolver

  constructor: (forge, @func) ->
    super(forge)
    assert @func?, 'The argument "func" must have a value'

  resolve: ->
    @func()

  toString: ->
    'function'

module.exports = FunctionResolver
