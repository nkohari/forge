FunctionResolver   = require './resolvers/FunctionResolver'
InstanceResolver   = require './resolvers/InstanceResolver'
TypeResolver       = require './resolvers/TypeResolver'
SingletonLifecycle = require './lifecycles/SingletonLifecycle'
TransientLifecycle = require './lifecycles/TransientLifecycle'
BindingError       = require './errors/BindingError'
ResolutionError    = require './errors/ResolutionError'

class Binding

  constructor: (@container, @name) ->

  resolve: ->
    throw new ResolutionError(@name, 'No lifecycle defined') unless @lifecycle?
    throw new ResolutionError(@name, 'No resolver defined')  unless @resolver?
    return @lifecycle.getInstance(@resolver)

  to: (target) ->
    if target.constructor?       then @resolver = new TypeResolver(@container, target)
    else if _.isFunction(target) then @resolver = new FunctionResolver(@container, target)
    else if _.isObject(target)   then @resolver = new InstanceResolver(@container, target)
    else
      throw new BindingError(@name, "Invalid binding target: #{target}")
    return this

  asSingleton: ->
    @lifecycle = new SingletonLifecycle()
    return this

  asTransient: ->
    @lifecycle = new TransientLifecycle()
    return this

module.exports = Binding
