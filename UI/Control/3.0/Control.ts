
var marks = {
	'mark-after-place': {
		process: function(item: HTMLElement, value: any, control: Control) {
			control.execute(value, item);
		}
	}
}

export abstract class Control extends PluginManager.Manager {
	 
	private static _idGenerator: number = 1
	public elemId: string
	private _parentElement: HTMLElement
	public el: HTMLElement

	constructor() {
		super()

		this.elemId = 'ctrl-' + Control._idGenerator ++
	}

	private _afterPlace(): void {
		this.el = document.getElementById(this.elemId)

		var c = <NodeList>this.el.querySelectorAll("*")
		var c1: NodeList = <NodeList>( <any> [ this.el ] )
		this._processMarks(c1)
		this._processMarks(c)
		this.afterPlace()
	}

	place(selector: any): void {
		var el: HTMLElement
		if ('string' === typeof selector) {
			el = <HTMLElement>document.querySelector(selector)
		}
		else {
			el = selector
		}

		this._parentElement = el
		this._parentElement.innerHTML = this.render()

		this._afterPlace()
	}

	private _processMarks(items: NodeList): void {

		for(var i = 0, l = items.length; i < l; i++) {
			var item = <HTMLElement>items[i];
			var atts = item.attributes;
			for (var j = 0, k = atts.length; j < k; j++) {
				var attr = atts[j]
				if(attr) {
					var aname = attr.name
					if(aname.length > 5 && aname.substr(0, 5) === 'mark-' && aname in marks) {
						var mark = marks[aname]
						item.removeAttribute(aname);
						mark.process(item, attr.value, this);
					}
				}
			}
		}

	}

	execute(code: string, element: HTMLElement, arg1?: any): any {
		var index = 0, args = [], text = ''
		var iter = function(name: string, c: any) {
			var item = c[name]
			if ('function' === typeof item) {
				item = item.bind(this)
			}
			args.push(item);
			text += 'var ' + name + '=_a[' + index++ + '];';
		}.bind(this)
		for(var name in this) {
			iter(name, this)
			/*
			var item = this[name]
			if ('function' === typeof item) {
				item = item.bind(this)
			}
			args.push(item);
			text += 'var ' + name + '=_a[' + index++ + '];';		
			*/
		}
		var p = Object.getPrototypeOf(this)
		for (let name of Object.getOwnPropertyNames(p)) {
			iter(name, p)
			/*
			var item = p[name]
			if ('function' === typeof item) {
				item = item.bind(this)
			}
			args.push(item);
			text += 'var ' + name + '=_a[' + index++ + '];';
			*/
		}
		var func = '(function(_a,_c,element,arg1){' + text + 'return eval(_c);})';
		return eval(func)(args, code, element, arg1);
	}

	afterPlace(): void { }
	abstract render(): string;

}

