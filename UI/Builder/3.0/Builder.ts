
/*
var Controls: Object = {
	edit: CEdit,
	button: UI_Control_Button.Button,
	grid: CGrid
}
*/

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
		if (p.params) {
			for (let i = 0, c = p.params, l = c.length; i < l; i++) {
				_params[c[i]] = true
			}
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

function readControlParamsFromParent(params: Object, owner: PluginManager.Manager): Object {

	if (owner['controlParams'] && owner['controlParams'][params['name']]) {
		var cp = owner['controlParams'][params['name']]

		for (var key in params) {
			cp[key] = params[key]
		}

		params = cp
	}

	return params
}

// alias: Builder

export class Builder {

	static idGenerator: number = 1

	static build(owner: PluginManager.Manager, element: HTMLElement, controls: Object): void {

		var queue: Array<any> = [ ]

	    var c = element.querySelectorAll("*")	    
	    for(var i = 0, l = c.length; i < l; i++) {
	    	var item = <HTMLElement>c[i]
			if( item.hasAttribute("control") ) {

				var className = readAndRemoveAttribute(item, "control")

				if (className in controls) {

					var append = false
					if (item.hasAttribute("data-append")) {
						if (item.getAttribute("data-append") === "true") {
							append = true
						}
					}

					let c = controls[className]
					let cp = readControlParams(item, c)
					cp = readControlParamsFromParent(cp, owner)
					var control = new c(cp)
					owner[control.name] = control
					owner.addPlugin(control)

					if (append) {

						let itemId: string = "tmp-item-" + Builder.idGenerator
						Builder.idGenerator ++ 
						item.setAttribute('id', itemId)
						// add to queue
						queue.push(itemId, control)

						/*
						var itemParent = item.parentNode
						itemParent.removeChild(item)

						// 1. get item.parent

						// 2. delete item from parent

						control.append(itemParent)
						*/
					}
					else {
						control.place(item)
					}
				}
			}
	    }

	    /*
		if (queue.length > 0) {
			console.log(queue)
		}
		*/

		for (var i = 0, l = queue.length; i < l; i += 2) {
			let itemId = queue[i], control = queue[i + 1]
			let item = document.getElementById(itemId)

			// console.log(item, control)

			var itemParent = item.parentNode
			itemParent.removeChild(item)

			// 1. get item.parent

			// 2. delete item from parent

			control.append(itemParent)
		}
	}

} 