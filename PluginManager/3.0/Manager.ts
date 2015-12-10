
// alias: Manager

export class Manager {

	static regexpArgument = /\*/

	static makeRegexpFromArgument(a: string): RegExp {

		a = a.replace(/\*/g, '.*')

		return new RegExp('^' + a + '$')
	}

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
			this._allPlugins = [ this ]
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

		if (!root._allPlugins) {
			root._allPlugins = [ root ]
		}

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
			var fevent = fevents[event] = {'[regexp]': [ ] }
			let ma = 'fa_' + event
			for (let i = 0, c = root._allPlugins, l = c.length; i < l; i++) {
				var plugin = c[i]
				if (plugin[m]) {

					/*
					// debug info
					if (!plugin[ma]) {
						console.log(m, ma, plugin)
					}
					*/

					var mf = plugin[ma]()

					// check for regexp
					if (Manager.regexpArgument.exec(mf)) {
						fevent['[regexp]'].push(Manager.makeRegexpFromArgument(mf), plugin)
					}
					else {
						if (!fevent[mf]) {
							fevent[mf] = []
						}
						fevent[mf].push(plugin)
					}
				}
			}
		}

		if (fevents[event]) {
			if (fevents[event][f]) {
				for (let i = 0, c = fevents[event][f], l = c.length; i < l; i++) {
					let plugin = c[i]
					plugin[m].apply(plugin, args)
				}
			}
			for (let i = 0, c = fevents[event]['[regexp]'], l = c.length; i < l; i += 2) {
				let re = c[i], plugin = c[i + 1]
				if (re.exec(f)) {
					plugin[m].apply(plugin, args)
				}
			}
		}

	}

}