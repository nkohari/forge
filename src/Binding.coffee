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
    @lifecycle = new SingletonLifecycle() # default
    @arguments = {}

  matches: (hint) ->
    if @predicate? then @predicate(hint) else true

  resolve: (context, hint, args = {}) ->
    assert context, 'The argument "context" must have a value'
    unless @lifecycle?
      throw new ConfigurationError(@name, 'No lifecycle defined')
    unless @resolver?
      throw new ConfigurationError(@name, 'No resolver defined')
    if context.has(this)
      throw new ResolutionError(@name, hint, context, 'Circular dependencies detected')
    context.push(this)
    result = @lifecycle.resolve(@resolver, context, args)
    context.pop()
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
    tokens = []
    tokens.push '(conditional)' if @predicate?
    tokens.push @name
    tokens.push '->'
    tokens.push if @resolver? then @resolver.toString() else '<undefined resolver>'
    tokens.push "(#{@lifecycle.toString()})"
    if @resolver.dependencies?.length > 0
      deps = _.map @resolver.dependencies, (dep) ->
        if dep.hint? then "#{dep.name}:#{dep.hint}" else dep.name
      tokens.push "depends on: [#{deps.join(', ')}]"
    tokens.join(' ')

module.exports = Binding
