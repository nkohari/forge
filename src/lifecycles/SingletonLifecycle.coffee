assert    = require 'assert'
Lifecycle = require './Lifecycle'

class SingletonLifecycle extends Lifecycle

  resolve: (resolver, args) ->
    assert resolver?, 'The argument "resolver" must have a value'
    @instance = resolver.resolve(args) unless @instance?
    return @instance

module.exports = SingletonLifecycle
