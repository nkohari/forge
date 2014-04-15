assert    = require 'assert'
Lifecycle = require './Lifecycle'

class TransientLifecycle extends Lifecycle

  resolve: (resolver, args) ->
    assert resolver?, 'The argument "resolver" must have a value'
    return resolver.resolve(args)

module.exports = TransientLifecycle
