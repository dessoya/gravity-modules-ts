
// alias: Manager

// use: IOnPluged.ts

export class Manager {

	private _parentManager: Manager
    private _plugins: Array<Manager> = [ ]
    private _filtiredEvents: Object

    // public onPluged: IOnPluged

	addPlugin(plugin: Manager) {

		plugin._parentManager = this
		this._plugins.push(plugin)

		if (plugin['onPluged']) {
			(<any>plugin['onPluged'])()
		}
	}

	setEventFilter(event: string, re: string) {
		console.log('setEventFilter',event,re,this)
		this.getRootPlugin()._setEventFilter(event, re, this)
	}

	_setEventFilter(event: string, re: string, m: Manager) {

		if (this['eo_' + event]) {
			this.addEventFilter(event, re, m)
		}

		for (var i = 0, c = this._plugins, l = c.length; i < l; i++) {
			var plugin = c[i]
			plugin._setEventFilter(event, re, m)
		}
	}

	addEventFilter(event: string, re: string, m: Manager) {
		if (!this._filtiredEvents) {
			this._filtiredEvents = {}
		}
		if (!this._filtiredEvents[event]) {
			this._filtiredEvents[event] = { parts: [ ], order: [ null ] }
		}

		this._filtiredEvents[event].parts.push('(' + re + ')')
		this._filtiredEvents[event].order.push(m)

		this._filtiredEvents[event].re = new RegExp('^(?:' + this._filtiredEvents[event].parts.join('|') + ')$')
	}

	getRootPlugin(): Manager {
		if(this._parentManager) {
			return this._parentManager.getRootPlugin()
		}
		return this
	} 

	_fireEvent(method: string, args: Array<any>, onlyChilds?: boolean) {

	    // console.log(this, arguments)

		onlyChilds = onlyChilds ? true : false
		if (!onlyChilds) {
			if (method in this) {
				this[method].apply(this, args)
			}
			if (this._filtiredEvents && this._filtiredEvents[method]) {
				var a: any
				if (a = this._filtiredEvents[method].re.exec(args[0])) {
					var i = 1
					while (!a[i]) {
						i++
					}
					var m = <any>this._filtiredEvents[method].order[i]
					m['fe_' + method].apply(m, args)
				}
			}
	    }

		for(var i = 0, c = this._plugins, l = c.length; i < l; i++) {
			var plugin = c[i]
			plugin._fireEvent(method, args)
		}

	}

	fireEvent(method: string, ...args: Array<any>);

	fireEvent(method: string) {
		var args = Array.prototype.slice.call(arguments)
		args.shift()

		console.log('fireEvent', method, args)

		var parent = this.getRootPlugin()
		parent._fireEvent(method, args)
	}

	removeAllPlugins() {

		for(var i = 0, c = this._plugins, l = c.length; i < l; i++) {
			var plugin = c[i]
			delete plugin._parentManager
		}

		this._plugins = [ ]
	}

}