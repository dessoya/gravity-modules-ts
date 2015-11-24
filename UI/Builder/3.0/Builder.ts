
var Controls: Object = {
	edit: UI_Control_Edit.Edit,
	button: UI_Control_Button.Button
}

function readAndRemoveAttribute(element: HTMLElement, attrName: string): string {
	var value: string = null
	if (element.hasAttribute(attrName)) {
		value = element.getAttribute(attrName)
		element.removeAttribute(attrName)
	}
	return value
}

function readControlParams(element: HTMLElement, c: any): Object {
	var params: Object = { }

	var p = c
	if (!p._params) {
		var _params = {}
		for (let i = 0, c = p.params, l = c.length; i < l; i++) {
			_params[c[i]] = true
		}
		p._params = _params
	}

	var names = p._params
	var dataset = element.dataset

	if (element.hasAttribute('name')) {
		params['name'] = element.getAttribute('name')
		element.removeAttribute('name')
	}

	for (var name in dataset) {
		if (name in names) {
			params[name] = dataset[name]
			element.removeAttribute('data-' + name)
		}
	}

	return params
}

export class Builder {

	static build(owner: PluginManager.Manager, element: HTMLElement): void {
	    var c = element.querySelectorAll("*")	    
	    for(var i = 0, l = c.length; i < l; i++) {
	    	var item = <HTMLElement>c[i]
			if( item.hasAttribute("control") ) {

				var className = readAndRemoveAttribute(item, "control")

				if (className in Controls) {
					let c = Controls[className]
					var control = new c(readControlParams(item, c))
					owner[control.name] = control
					owner.addPlugin(control)
					control.place(item)
				}
			}
	    }
	}

} 