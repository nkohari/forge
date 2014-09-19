util = require 'util'

class ResolutionError

  constructor: (name, hint, context, message) ->
    @name    = 'ResolutionError'
    @message = @getMessage(name, hint, context, message)
    Error.captureStackTrace(this, arguments.callee)

  toString: -> @message

  getMessage: (name, hint, context, message) ->
    lines = []
    lines.push "Could not resolve component named #{name}: #{message}"
    if hint?
      lines.push '  With resolution hint:'
      lines.push "    #{util.inspect(hint)}"
    lines.push '  In resolution context:'
    lines.push context.toString()
    lines.push '  ---'
    lines.join('\n')

module.exports = ResolutionError
