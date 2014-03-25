_               = require 'underscore'
FunctionBinding = require './binding/FunctionBinding'
InstanceBinding = require './binding/InstanceBinding'
TypeBinding     = require './binding/TypeBinding'

class Container

  constructor: ->
    @bindings = {}

  get: (name) ->
    binding = @bindings[name]
    unless binding?
      throw new Error("A component named #{name} was requested, but no binding was available")
    return binding.resolve()

  bind: (name, target) ->
    if target.constructor?       then binding = new TypeBinding(this, name, target)
    else if _.isFunction(target) then binding = new FunctionBinding(this, name, target)
    else if _.isObject(target)   then binding = new InstanceBinding(this, name, target)
    else
      throw new Error("Invalid binding target for component named #{name}")
    @bindings[name] = binding
    return binding

module.exports = Container
