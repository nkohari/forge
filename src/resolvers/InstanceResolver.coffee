assert   = require 'assert'
_        = require 'underscore'
Resolver = require './Resolver'

class InstanceResolver extends Resolver

  constructor: (forge, binding, @instance) ->
    super(forge, binding)
    assert @instance?, 'The argument "instance" must have a value'
    @dependencies = []

  resolve: (context, args) ->
    @instance

  toString: ->
    if not @instance?
      return '<unknown instance>'
    else if @instance.constructor?.name?
      return "an instance of #{@instance.constructor.name}"
    else
      return "an instance of #{typeof(@instance)}"

module.exports = InstanceResolver
