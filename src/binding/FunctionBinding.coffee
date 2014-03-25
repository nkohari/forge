Binding = require './Binding'

class FunctionBinding extends Binding

  constructor: (container, name, @func) ->
    super(container, name)

  resolve: ->
    @func()

module.exports = FunctionBinding
