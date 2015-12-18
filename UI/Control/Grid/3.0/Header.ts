 
export class Header extends Control {

	public columns: Array<any>
	public height: number
	public width: number

	public controlParams: Object

	static params: Array<string> = 'columns,height'.split(',')	

	constructor(params: Object) {
		super(params)

		var cp = this.controlParams = { }, cx = 0
		for (var i = 0, c = this.columns, l = c.length; i < l; i++) {
			var column = c[i]

			var name = 'column-' + i
			var p = cp[name] = column

			column.x = cx

			var cls = [ 'inner' ]
			if (i === 0) {
				cls.push( 'first' )
			}
			if (i !== l - 1) {
				cls.push('right-border')
			}

			column.height = this.height

			column.cls = cls.join(' ')

			cx += column.width
		}

		this.width = cx
	}

	render(): string {
		return require('Header.html')({ id: this.elemId, width: this.width, height: this.height - 1, columns: this.columns })
	}

	afterPlace() {
		// var p = require('Package.js')
		// console.log('Package.js', p)
		Builder.build(this, this.el, require('Package.js'))
	}
}