Resolver = require './Resolver'

class InstanceResolver extends Resolver

  constructor: (container, @instance) ->
    super(container)

  resolve: ->
    @instance

module.exports = InstanceResolver
