assert    = require 'assert'
Lifecycle = require './Lifecycle'

class TransientLifecycle extends Lifecycle

  resolve: (resolver, context, args) ->
    assert resolver?, 'The argument "resolver" must have a value'
    assert context?,  'The argument "context" must have a value'
    return resolver.resolve(context, args)

  toString: ->
    'transient'

module.exports = TransientLifecycle
