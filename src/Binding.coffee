_                  = require 'underscore'
FunctionResolver   = require './resolvers/FunctionResolver'
InstanceResolver   = require './resolvers/InstanceResolver'
TypeResolver       = require './resolvers/TypeResolver'
SingletonLifecycle = require './lifecycles/SingletonLifecycle'
TransientLifecycle = require './lifecycles/TransientLifecycle'
ConfigurationError = require './errors/ConfigurationError'

sweeten = (type, property) ->
  Object.defineProperty type.prototype, property,
    get: -> return this

chain = (func) ->
  return (args...) ->
    result = func.apply(this, args)
    return this

class Binding

  constructor: (@forge, @name) ->
    @lifecycle = new SingletonLifecycle() # default

  matches: (hint) ->
    if @predicate? then @predicate(hint) else true

  resolve: ->
    throw new ConfigurationError(@name, 'No lifecycle defined') unless @lifecycle?
    throw new ConfigurationError(@name, 'No resolver defined')  unless @resolver?
    return @lifecycle.getInstance(@resolver)

  sweeten(this, 'to')
  sweeten(this, 'as')

  type:     chain (target) -> @resolver = new TypeResolver(@forge, target)
  function: chain (target) -> @resolver = new FunctionResolver(@forge, target)
  instance: chain (target) -> @resolver = new InstanceResolver(@forge, target)

  singleton: chain -> @lifecycle = new SingletonLifecycle()
  transient: chain -> @lifecycle = new TransientLifecycle()

  when: chain (predicate) -> @predicate = predicate

  toString: ->
    tokens = [@name]
    tokens.push '?' if @predicate?
    tokens.push '->'
    if @resolver?
      tokens.push @resolver.toString()
    else
      tokens.push '?'
    return tokens.join('')

module.exports = Binding
