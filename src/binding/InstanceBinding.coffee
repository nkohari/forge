Binding = require './Binding'

class InstanceBinding extends Binding

  constructor: (container, name, @instance) ->
    super(container, name)

  resolve: ->
    @instance

module.exports = InstanceBinding
