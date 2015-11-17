
// use: Types.ts
// use: AJAX.ts

export class JSONParser extends PluginManager.Manager {

	constructor() {
		super()
		this.addPlugin(new AJAX.Plugins.ResponseHeadersParser)
	}
	
	onAJAX200(ajax: AJAX, o: Result) {

		this._fireEvent('onAJAX200', [ ajax, o ], true)

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