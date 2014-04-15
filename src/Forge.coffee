assert          = require 'assert'
_               = require 'underscore'
Binding         = require './Binding'
Inspector       = require './Inspector'
ResolutionError = require './errors/ResolutionError'

class Forge

  constructor: (inspector) ->
    @bindings  = {}
    @inspector = inspector ? new Inspector()

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
    bindings = @getMatchingBindings(name, hint)
    if bindings.length == 0
      throw new ResolutionError(name, 'No matching bindings were available')
    return @resolve(bindings, true)

  getOne: (name, hint) ->
    assert name?, 'The argument "name" must have a value'
    bindings = @getMatchingBindings(name, hint)
    if bindings.length == 0
      throw new ResolutionError(name, 'No matching bindings were available')
    unless bindings.length == 1
      throw new ResolutionError(name, 'Multiple matching bindings were available')
    return @resolve(bindings, true)

  getAll: (name) ->
    assert name?, 'The argument "name" must have a value'
    bindings = @bindings[name]
    unless bindings?.length > 0
      throw new ResolutionError(name, 'No matching bindings were available')
    return @resolve(bindings, false)

  getMatchingBindings: (name, hint) ->
    assert name?, 'The argument "name" must have a value'
    return [] unless @bindings[name]?
    return _.filter @bindings[name], (b) -> b.matches(hint)

  resolve: (bindings, unwrap) ->
    results = _.map bindings, (binding) -> binding.resolve()
    if unwrap and results.length == 1
      return results[0]
    else
      return results

  inspect: ->
    bindings = _.flatten _.values(@bindings)
    return _.invoke(bindings, 'toString').join('\n')

module.exports = Forge
