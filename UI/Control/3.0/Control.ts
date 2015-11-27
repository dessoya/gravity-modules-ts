
// alias: Control

/*
function makeEventFunction(event, event2?) {
	if (event2) {
		return function(item, value, control) {
			item.addEventListener(event, function(e) {
				control.execute(value, this, e);
			});
			item.addEventListener(event2, function(e) {
				control.execute(value, this, e);
			});
		}
	}

	return function(item, value, control) {
		item.addEventListener(event, function(e) {
			control.execute(value, this, e);
		});
	}
}
*/

function makeEventFunction(event: string) {
	return function(item: HTMLElement, value: any, control: Control) {
		item.addEventListener(event, function(e: any) {
			control.execute(value, this, e)
		})
	}
}

var marks = {
	'after-place': {
		process: function(item: HTMLElement, value: any, control: Control) {
			control.execute(value, item)
		}
	}
	, afterPlace: [ 'alias', 'after-place' ]

	, keyup: 'event'
	, click: 'event'
}

for (var name in marks) {
	var value = marks[name]
	if ('string' === typeof value || value instanceof Array) {
		var params
		if (value instanceof Array) {
			params = value
			value = value[0]			
		}

		switch (value) {
		case 'event':
			marks[name] = { process: makeEventFunction(name) }
			break
		case 'alias':
			marks[name] = marks[params[1]]
			if (!('aliases' in marks[name])) {
				marks[name].aliases = {}
			}
			marks[name].aliases[name] = true
			marks[name].aliases[params[1]] = true
			break
		}
	}
}

export abstract class Control extends PluginManager.Manager {
	 
	private static _idGenerator: number = 1

	private _parentElement: HTMLElement

	public elemId: string
	public el: HTMLElement
	public name: string

	constructor(params?: Object) {
		super()

		params = 'object' === typeof params ? params : { }

		if (params['name']) {
			this.name = params['name']
			delete params['name']
		}

		var p = Object.getPrototypeOf(this).constructor
		if (p.params) {
			var names: Array<string> = p.params

			for (var i = 0, l = names.length; i < l; i++) {
				var name = names[i]
				if (name in params) {
					this[name] = params[name]
				}
			}
		}

		this.elemId = 'ctrl-' + Control._idGenerator ++
	} 

	private _afterPlace(): void {
		this.el = document.getElementById(this.elemId)
		if (!this.el) {
			return
		}

		var c = <NodeList>this.el.querySelectorAll("*")
		this._processMarks(<NodeList>(<any>[this.el]))
		this._processMarks(c)
		this.afterPlace()
	}

	place(selector: string|HTMLElement): void {
		var el: HTMLElement
		if ('string' === typeof selector) {
			el = <HTMLElement>document.querySelector(<string>selector)
		}
		else {
			el = <HTMLElement>selector
		}

		this._parentElement = el
		this._parentElement.innerHTML = this.render()

		this._afterPlace()
	}

	append(element: HTMLElement) {
		this._parentElement = element
		this._parentElement.innerHTML = this._parentElement.innerHTML + this.render()

		this._afterPlace()
	}

	private _processMarks(items: NodeList): void {

		for(var i = 0, l = items.length; i < l; i++) {
			var item = <HTMLElement>items[i]
			var dataset = item.dataset
			// console.log(dataset)
			for (var name in dataset) {
				// console.log(name)
				if (name in marks) {				
					var mark = marks[name], value = dataset[name]
					var remattr = {}
					remattr[name] = true
					if (mark.aliases) {
						remattr = mark.aliases
					}
					console.log(remattr)
					for(var key in remattr) {
						var aname = 'data-' + key
						if (item.hasAttribute(aname)) {
							item.removeAttribute(aname)
						}
					}
					mark.process(item, value, this)
				}
			}

			/*
			var atts = item.attributes;
			for (var j = 0, k = atts.length; j < k; j++) {
				var attr = atts[j]
				if(attr) {
					// var aname = attr.name
					var aname = atts[j].nodeName
					if(aname.length > 5 && aname.substr(0, 5) === 'mark-' && aname in marks) {
						var mark = marks[aname]
						item.removeAttribute(aname);
						mark.process(item, atts[j].nodeValue, this)
					}
				}
			}
			*/
		}

	}

	execute(code: string, element: HTMLElement, arg1?: any): any {
		var index = 0, args = [], text = '', self = this
		var iter = function(name: string, c: any) {
			var item = c[name]
			if ('function' === typeof item) {
				item = item.bind(self)
			}
			args.push(item);
			text += 'var ' + name + '=_a[' + index++ + '];';
		}
		for(var name in this) {
			iter(name, this)
		}
		var p = Object.getPrototypeOf(this)
		for (let name of Object.getOwnPropertyNames(p)) {
			iter(name, p)
		}
		var func = '(function(_a,_c,element,arg1){' + text + 'return eval(_c);})'
		var result = null
		try {
			result = eval(func)(args, code, element, arg1)
		}
		catch (e) {
			console.log(e, func)
		}

		return result
	}

	afterPlace(): void { }
	abstract render(): string;

}

