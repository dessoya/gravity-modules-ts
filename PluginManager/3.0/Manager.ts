
// alias: Manager

export class Manager {

	private _parentManager: Manager
	private _rootManager: Manager

    private _plugins: Array<Manager>
    private _allPlugins: Array<Manager>

    private _events: any
    private _fevents: any

	private _getRootPlugin(): Manager {

		if (!this._rootManager) {

			if (this._parentManager) {
				this._rootManager = this._parentManager._getRootPlugin()
			}
			else {
				this._rootManager = this
			}

		}

		return this._rootManager
	}
	
	private _getChilds(list: Array<Manager>) {

		list.push(this)
		if (!this._plugins) {
			return
		}

		for (var i = 0, c = this._plugins, l = c.length; i < l; i++) {
			var plugin = c[i]
			plugin._getChilds(list)
		}
	}

	private _cleanBeforeAdd() {
		delete this._rootManager
		delete this._allPlugins
	}

	private _addPlugins(list: Array<Manager>) {

		for (var i = 0, l = list.length; i < l; i++) {
			var plugin = list[i]
			plugin._cleanBeforeAdd()
		}

		if (!this._allPlugins) {
			this._allPlugins = [ ]
		}

		this._allPlugins = this._allPlugins.concat(list)
	}

	addPlugin(plugin: Manager) {

		plugin._parentManager = this
		if (!this._plugins) {
			this._plugins = [ ]
		}
		this._plugins.push(plugin)
		
		var list: Array<Manager> = []
		plugin._getChilds(list)

		var root = this._getRootPlugin()
		root._addPlugins(list)

		// clean cached events
		delete root._events
		delete root._fevents
	}

	fireEvent(event: string, ...args: Array<any>);
	fireEvent(event: string) {

		var args = Array.prototype.slice.call(arguments)
		args.shift()

		console.log('fireEvent', event, args)

		let root = this._getRootPlugin()
		if (!root._events) {
			root._events = {}
		}

		let events = root._events
		if (!events[event]) {
			let e = events[event] = [ ]
			for (let i = 0, c = root._allPlugins, l = c.length; i < l; i++) {
				var plugin = c[i]
				if (plugin[event]) {
					e.push(plugin)
				}
			}
		}

		for (let i = 0, c = events[event], l = c.length; i < l; i++) {
			let plugin = c[i]
			plugin[event].apply(plugin, args)
		}

		// filtered events

		if (!root._fevents) {
			root._fevents = {}
		}

		let fevents = root._fevents
		let f = args[0], m = 'fe_' + event
		if (!fevents[event]) {
			fevents[event] = {}
			let ma = 'fa_' + event
			for (let i = 0, c = root._allPlugins, l = c.length; i < l; i++) {
				var plugin = c[i]
				if (plugin[m]) {
					var mf = plugin[ma]()
					if (!fevents[event][mf]) {
						fevents[event][mf] = [ ]
					}
					fevents[event][mf].push(plugin)
				}
			}
		}

		if (fevents[event][f]) {
			for (let i = 0, c = fevents[event][f], l = c.length; i < l; i++) {
				let plugin = c[i]
				plugin[m].apply(plugin, args)
			}
		}

	}


	/*
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
	*/


	/*
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
	*/

}