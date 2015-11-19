
export class Manager {

	private _parentManager: Manager
    _plugins: Array<Manager>

	constructor() {
		this._plugins = [ ]
	}

	addPlugin(plugin: Manager) {
		this._plugins.push(plugin)
		plugin._parentManager = this
	}

	getRootPlugin(): Manager {
		if(this._parentManager) {
			return this._parentManager
		}
		return this
	} 

	_fireEvent(method: string, args: Array<any>, onlyChilds?: boolean) {

		onlyChilds = onlyChilds ? true : false
		if (!onlyChilds && method in this) {
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