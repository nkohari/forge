assert             = require 'assert'
_                  = require 'underscore'
FunctionResolver   = require './resolvers/FunctionResolver'
InstanceResolver   = require './resolvers/InstanceResolver'
TypeResolver       = require './resolvers/TypeResolver'
SingletonLifecycle = require './lifecycles/SingletonLifecycle'
TransientLifecycle = require './lifecycles/TransientLifecycle'
ConfigurationError = require './errors/ConfigurationError'
ResolutionError    = require './errors/ResolutionError'

sweeten = (type, property) ->
  Object.defineProperty type.prototype, property,
    get: -> return this

chain = (func) ->
  return (args...) ->
    result = func.apply(this, args)
    return this

class Binding

  constructor: (@forge, @name) ->
    assert @forge?, 'The argument "forge" must have a value'
    assert @name?,  'The argument "name" must have a value'
    @lifecycle   = new SingletonLifecycle() # default
    @arguments   = {}
    @isResolving = false

  matches: (hint) ->
    if @predicate? then @predicate(hint) else true

  resolve: (args = {}) ->
    throw new ConfigurationError(@name, 'No lifecycle defined') unless @lifecycle?
    throw new ConfigurationError(@name, 'No resolver defined') unless @resolver?
    throw new ResolutionError(@name, 'Circular dependencies detected') if @isResolving
    @isResolving = true
    result = @lifecycle.resolve(@resolver, args)
    @isResolving = false
    return result

  sweeten(this, 'to')
  sweeten(this, 'as')

  type: chain (target) ->
    assert target?, 'The argument "target" must have a value'
    @resolver = new TypeResolver(@forge, this, target)

  function: chain (target) ->
    assert target?, 'The argument "target" must have a value'
    @resolver = new FunctionResolver(@forge, this, target)

  instance: chain (target) ->
    assert target?, 'The argument "target" must have a value'
    @resolver = new InstanceResolver(@forge, this, target)

  singleton: chain ->
    @lifecycle = new SingletonLifecycle()

  transient: chain ->
    @lifecycle = new TransientLifecycle()

  when: chain (condition) ->
    assert condition?, 'The argument "condition" must have a value'
    if _.isFunction(condition)
      @predicate = condition
    else
      @predicate = (hint) -> hint == condition

  with: chain (args) ->
    @arguments = args

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
