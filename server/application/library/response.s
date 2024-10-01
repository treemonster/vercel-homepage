<?js
class Lib_response{
	static json({data, error=null}) {
		setResponseHeaders({
			'content-type': 'application/json; charset=utf8',
		})
		echo(JSON.stringify({
			data,
			error: error? error.message || 'unknown error': null,
		}))
	}
}
