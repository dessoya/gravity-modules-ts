
// use: Types.ts
// use: AJAX.ts
// use: ResponseHeadersParser.ts

export class JSONParser extends PluginManager.Manager {

	private _responseHeadersParser: ResponseHeadersParser
	constructor() {
		super()
		this._responseHeadersParser = new ResponseHeadersParser
	}
	
	onAJAX200(ajax: AJAX, o: Result) {

		this._responseHeadersParser.fireEvent('onAJAX200', ajax, o)

		if (o.headers['Content-Type'] && o.headers['Content-Type'].indexOf('application/json') !== -1) {
			var p: Object = null
			try {
				p = JSON.parse(<string>o.answer)
			}
			catch (e) {
				p = null
				o.error = true
			}
			o.answer = p
		}
	}
}