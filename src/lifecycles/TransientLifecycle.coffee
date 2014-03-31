assert    = require 'assert'
Lifecycle = require './Lifecycle'

class TransientLifecycle extends Lifecycle

  getInstance: (resolver) ->
    assert resolver?, 'The argument "resolver" must have a value'
    return resolver.resolve()

module.exports = TransientLifecycle
