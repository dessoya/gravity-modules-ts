
export class Manager {

	private _parentManager: Manager = null
    private _plugins: Array<Manager> = [ ]

	addPlugin(plugin: Manager) {
		this._plugins.push(plugin)
		plugin._parentManager = this
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
		if (!onlyChilds && method in this) {
		// if (method in this) {
	    	this[method].apply(this, args)
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