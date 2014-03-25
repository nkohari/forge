Resolver = require './Resolver'

class FunctionResolver extends Resolver

  constructor: (container, @func) ->
    super(container)

  resolve: ->
    @func()

module.exports = FunctionResolver
