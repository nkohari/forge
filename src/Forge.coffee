Binding         = require './Binding'
ResolutionError = require './errors/ResolutionError'

class Forge

  constructor: ->
    @bindings = {}

  get: (name) ->
    binding = @bindings[name]
    throw new ResolutionError(name, 'No binding was available') unless binding?
    return binding.resolve()

  bind: (name) ->
    return @bindings[name] = new Binding(this, name)

module.exports = Forge
