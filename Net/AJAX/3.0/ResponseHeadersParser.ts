
// use: Types.ts
// use: AJAX.ts

export class ResponseHeadersParser extends PluginManager.Manager {

	onAJAX200(ajax: AJAX, o: Result) {

		if (o.headers) {
			return
		}

		var h: string[] = ajax.req.getAllResponseHeaders().split(/\r\n/)
		var headers = o.headers = {}, line: string, pos: number
		for (var i = 0, c = h, l = c.length; i < l; i++) {
			line = h[i]
			if (line.length < 1) continue
			if ((pos = line.indexOf(':')) !== -1) {
				var name = line.substr(0, pos)
				headers[name] = line.substr(pos + 2)
			}
		}

	}

} 