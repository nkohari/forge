assert    = require 'assert'
Lifecycle = require './Lifecycle'

class SingletonLifecycle extends Lifecycle

  getInstance: (resolver) ->
    assert resolver?, 'The argument "resolver" must have a value'
    @instance = resolver.resolve() unless @instance?
    return @instance

module.exports = SingletonLifecycle
