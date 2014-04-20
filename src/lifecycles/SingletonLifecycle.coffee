assert    = require 'assert'
Lifecycle = require './Lifecycle'

class SingletonLifecycle extends Lifecycle

  resolve: (resolver, context, args) ->
    assert resolver?, 'The argument "resolver" must have a value'
    assert context?,  'The argument "context" must have a value'
    @instance = resolver.resolve(context, args) unless @instance?
    return @instance

  toString: ->
    'singleton'

module.exports = SingletonLifecycle
