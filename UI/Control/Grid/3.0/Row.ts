 
export class Row extends Control {

	public height: number
	public width: number
	public cells: any
	public columns: Array<any>

	public controlParams: Object
	
	static params: Array<string> = 'cells,columns,height,width'.split(',')	

	constructor(params: Object) {
		super(params)

		// console.log('cells', this.cells)

		var cp = this.controlParams = {}, cx = 0
		for (var i = 0, c = this.columns, l = c.length; i < l; i++) {
			var column = c[i]

			var name = 'cell-' + i
			// console.log(column.dataName, this.cells)
			var p = cp[name] = { dataValue: this.cells[column.dataName], width: column.width }

			p['x'] = cx

			var cls = ['inner']
			if (i === 0) {
				cls.push('first')
			}
			if (i !== l - 1) {
				cls.push('right-border')
			}

			p['height'] = this.height

			p['cls'] = cls.join(' ')

			console.log(p)

			cx += column['width']
		}

		// console.log(cp)

		this.width = cx
	}

	render(): string {
		return require('Row.html')({ id: this.elemId, columns: this.columns, width: this.width, height: this.height })
	}

	afterPlace() {
		// var p = require('Package.js')
		// console.log('Package.js', p)
		Builder.build(this, this.el, require('Package.js'))
	}
}