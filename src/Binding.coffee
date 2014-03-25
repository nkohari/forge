_                  = require 'underscore'
FunctionResolver   = require './resolvers/FunctionResolver'
InstanceResolver   = require './resolvers/InstanceResolver'
TypeResolver       = require './resolvers/TypeResolver'
SingletonLifecycle = require './lifecycles/SingletonLifecycle'
TransientLifecycle = require './lifecycles/TransientLifecycle'
BindingError       = require './errors/BindingError'
ResolutionError    = require './errors/ResolutionError'

sweeten = (type, property) ->
  Object.defineProperty type.prototype, property,
    get: -> return this

class Binding

  constructor: (@forge, @name) ->
    @lifecycle = new SingletonLifecycle() # default

  resolve: ->
    throw new ResolutionError(@name, 'No lifecycle defined') unless @lifecycle?
    throw new ResolutionError(@name, 'No resolver defined')  unless @resolver?
    return @lifecycle.getInstance(@resolver)

  sweeten(this, 'to')
  sweeten(this, 'as')

  type: (target) ->
    @resolver = new TypeResolver(@forge, target)
    return this

  function: (target) ->
    @resolver = new FunctionResolver(@forge, target)
    return this

  instance: (target) ->
    @resolver = new InstanceResolver(@forge, target)
    return this

  singleton: ->
    @lifecycle = new SingletonLifecycle()
    return this

  transient: ->
    @lifecycle = new TransientLifecycle()
    return this

module.exports = Binding
