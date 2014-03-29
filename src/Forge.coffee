_               = require 'underscore'
Binding         = require './Binding'
ResolutionError = require './errors/ResolutionError'

class Forge

  constructor: ->
    @bindings = {}

  get: (name, hint) ->
    matches = @getMatchingBindings(name, hint)
    if matches.length == 0
      throw new ResolutionError(name, 'No matching bindings were available')
    unless matches.length == 1
      throw new ResolutionError(name, 'Multiple matching bindings were available')
    return matches[0].resolve()

  getAll: (name, hint) ->
    matches = @getMatchingBindings(name, hint)
    if matches.length == 0
      throw new ResolutionError(name, 'No matching bindings were available')
    return _.map matches, (b) -> b.resolve()

  bind: (name) ->
    binding = new Binding(this, name)
    (@bindings[name] ?= []).push(binding)
    return binding

  getMatchingBindings: (name, hint) ->
    return [] unless @bindings[name]?
    return _.filter @bindings[name], (b) -> b.matches(hint)

module.exports = Forge
