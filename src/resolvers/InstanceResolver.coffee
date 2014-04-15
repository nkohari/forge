assert   = require 'assert'
_        = require 'underscore'
Resolver = require './Resolver'

class InstanceResolver extends Resolver

  constructor: (forge, binding, @instance) ->
    super(forge, binding)
    assert @instance?, 'The argument "instance" must have a value'

  resolve: ->
    @instance

  toString: ->
    if not @instance?
      str = '?'
    else if @instance.constructor?.name?
      str = "#{@instance.constructor.name}"
    else
      str = typeof(@instance)
    return "instance{#{str}}"

module.exports = InstanceResolver
