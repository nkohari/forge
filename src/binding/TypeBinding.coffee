_       = require 'underscore'
Binding = require './Binding'

class TypeBinding extends Binding

  constructor: (container, name, @target) ->
    super(container, name)
    @instance   = undefined
    @parameters = @getParameterNames(@target)

  resolve: ->
    unless @instance?
      args = _.map @parameters, (param) => @container.get(param)
      ctor = @target.bind.apply(@target, [null].concat(args))
      @instance = new ctor()
    return @instance

  getParameterNames: (type) ->
    regex   = /function .*\(([^)]+)/g
    matches = regex.exec type.toString()
    if !matches? or matches[1].length == 0
      return []
    else
      args = matches[1].split /[,\s]+/
      return args

module.exports = TypeBinding
