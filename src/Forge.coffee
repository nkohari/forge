_               = require 'underscore'
Binding         = require './Binding'
ResolutionError = require './errors/ResolutionError'

class Forge

  constructor: ->
    @bindings = {}

  bind: (name) ->
    binding = new Binding(this, name)
    (@bindings[name] ?= []).push(binding)
    return binding

  get: (name, hint) ->
    matches = @getMatchingBindings(name, hint)
    if matches.length == 0
      throw new ResolutionError(name, 'No matching bindings were available')
    results = _.map matches, (binding) -> binding.resolve()
    return if results.length == 1 then results[0] else results

  getOne: (name, hint) ->
    matches = @getMatchingBindings(name, hint)
    if matches.length == 0
      throw new ResolutionError(name, 'No matching bindings were available')
    unless matches.length == 1
      throw new ResolutionError(name, 'Multiple matching bindings were available')
    return matches[0].resolve()

  getMatchingBindings: (name, hint) ->
    return [] unless @bindings[name]?
    return _.filter @bindings[name], (b) -> b.matches(hint)

  inspect: ->
    bindings = _.flatten _.values(@bindings)
    return _.invoke(bindings, 'toString').join('\n')

module.exports = Forge
