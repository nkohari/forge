assert          = require 'assert'
_               = require 'underscore'
Binding         = require './Binding'
Context         = require './Context'
Inspector       = require './Inspector'
ResolutionError = require './errors/ResolutionError'

class Forge

  constructor: (@inspector = new Inspector()) ->
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
    assert name?, 'The argument "name" must have a value'
    @unbind(name)
    return @bind(name)

  get: (name, hint, args) ->
    @resolve(new Context(hint), name, args)

  getOne: (name, hint, args) ->
    assert name?, 'The argument "name" must have a value'
    context  = new Context(hint)
    bindings = @getMatchingBindings(name, hint)
    if bindings.length == 0
      throw new ResolutionError(name, context, 'No matching bindings were available')
    unless bindings.length == 1
      throw new ResolutionError(name, context, 'Multiple matching bindings were available')
    return @resolveBindings(context, bindings, args, true)

  getAll: (name, args) ->
    assert name?, 'The argument "name" must have a value'
    context  = new Context()
    bindings = @bindings[name]
    unless bindings?.length > 0
      throw new ResolutionError(name, context, 'No matching bindings were available')
    return @resolveBindings(context, bindings, args, false)

  getMatchingBindings: (name, hint) ->
    assert name?, 'The argument "name" must have a value'
    return [] unless @bindings[name]?
    return _.filter @bindings[name], (b) -> b.matches(hint)

  resolve: (context, name, args) ->
    assert context?, 'The argument "context" must have a value'
    assert name?,    'The argument "name" must have a value'
    bindings = @getMatchingBindings(name, context.hint)
    if bindings.length == 0
      throw new ResolutionError(name, context, 'No matching bindings were available')
    return @resolveBindings(context, bindings, args, true)

  resolveBindings: (context, bindings, args, unwrap) ->
    results = _.map bindings, (binding) -> binding.resolve(context, args)
    if unwrap and results.length == 1
      return results[0]
    else
      return results

  inspect: ->
    bindings = _.flatten _.values(@bindings)
    return _.invoke(bindings, 'toString').join('\n')

module.exports = Forge
