class ResolutionError extends Error

  constructor: (name, message) ->
    @message = "Could not resolve binding for component named #{name}: #{message}"
    Error.captureStackTrace(this, arguments.callee)

module.exports = ResolutionError
