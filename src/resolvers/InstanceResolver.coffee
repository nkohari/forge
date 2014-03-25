Resolver = require './Resolver'

class InstanceResolver extends Resolver

  constructor: (forge, @instance) ->
    super(forge)

  resolve: ->
    @instance

module.exports = InstanceResolver
