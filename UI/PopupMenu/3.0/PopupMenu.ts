
// alias: PopupMenu
// use: Item.ts

export class PopupMenu extends Manager {

	static el: HTMLElement = null

	static open(x: number, y: number, title: string, items: Array<any>, callback: any, ctx: any) {

		if (PopupMenu.el) {
			PopupMenu.el.parentNode.removeChild(PopupMenu.el)
			PopupMenu.el = null			
		}

		var el = PopupMenu.el = <HTMLElement>document.createElement('div')
		el.className = 'ctrl-popupmenu'
		el.innerHTML = require('PopupMenu.html')({ title: title })
		el.style.left = '' + x + 'px'
		el.style.top = '' + y + 'px'
		document.querySelector('body').appendChild(el)

		el = <HTMLElement>(el.querySelector('.inner'))
		var m = new Manager

		for (var i = 0, l = items.length; i < l; i++) {
			var item = items[i]
			var control = new Item({ title: item.title, name: item.name })
			m.addPlugin(control)
			control.append(el)
		}

		console.log(m)

		m.onItemClick = function(name) {			
			console.log('onItemClick')
			PopupMenu.el.parentNode.removeChild(PopupMenu.el)
			PopupMenu.el = null

			callback(name, ctx)
		}

	}

}