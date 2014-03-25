Resolver = require './Resolver'

class FunctionResolver extends Resolver

  constructor: (forge, @func) ->
    super(forge)

  resolve: ->
    @func()

module.exports = FunctionResolver
