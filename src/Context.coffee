_ = require 'underscore'

class Context

  constructor: ->
    @bindings = []

  has: (binding) ->
    _.contains(@bindings, binding)

  push: (binding) ->
    @bindings.push(binding)

  pop: ->
    @bindings.pop()

  toString: (indent = 4) ->
    spaces = Array(indent + 1).join(' ')
    lines  = _.map @bindings, (binding, index) ->
      "#{spaces}#{index+1}: #{binding.toString()}"
    lines.reverse().join('\n')

module.exports = Context
