
export class Manager {

	private _parentManager: Manager
    plugins: Array<Manager>

	constructor() {
		this.plugins = [ ]
	}

	addPlugin(plugin: Manager) {
		this.plugins.push(plugin)
		plugin._parentManager = this
	}

	getRootPlugin(): Manager {
		if(this._parentManager) {
			return this._parentManager
		}
		return this
	}

	_fireEvent(method: string, args: Array<any>) {

	    if(method in this) {
	    	this[method].apply(this, args)
	    }

		for(var i = 0, c = this.plugins, l = c.length; i < l; i++) {
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

		for(var i = 0, c = this.plugins, l = c.length; i < l; i++) {
			var plugin = c[i]
			delete plugin._parentManager
		}

		this.plugins = [ ]
	}

}