assert          = require 'assert'
_               = require 'underscore'
Binding         = require './Binding'
ResolutionError = require './errors/ResolutionError'

class Forge

  constructor: ->
    @bindings = {}

  bind: (name) ->
    assert name?, 'The argument "name" must have a value'
    binding = new Binding(this, name)
    (@bindings[name] ?= []).push(binding)
    return binding

  unbind: (name) ->
    assert name?, 'The argument "name" must have a value'
    count = if @bindings[name]? then @bindings[name].length else 0
    @bindings[name] = []
    return count

  rebind: (name) ->
    assert name?, 'The argumetn "name" must have a value'
    @unbind(name)
    return @bind(name)

  get: (name, hint) ->
    assert name?, 'The argument "name" must have a value'
    matches = @getMatchingBindings(name, hint)
    if matches.length == 0
      throw new ResolutionError(name, 'No matching bindings were available')
    results = _.map matches, (binding) -> binding.resolve()
    return if results.length == 1 then results[0] else results

  getOne: (name, hint) ->
    assert name?, 'The argument "name" must have a value'
    matches = @getMatchingBindings(name, hint)
    if matches.length == 0
      throw new ResolutionError(name, 'No matching bindings were available')
    unless matches.length == 1
      throw new ResolutionError(name, 'Multiple matching bindings were available')
    return matches[0].resolve()

  getMatchingBindings: (name, hint) ->
    assert name?, 'The argument "name" must have a value'
    return [] unless @bindings[name]?
    return _.filter @bindings[name], (b) -> b.matches(hint)

  inspect: ->
    bindings = _.flatten _.values(@bindings)
    return _.invoke(bindings, 'toString').join('\n')

module.exports = Forge
