_        = require 'underscore'
Resolver = require './Resolver'

class InstanceResolver extends Resolver

  constructor: (forge, @instance) ->
    super(forge)

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
