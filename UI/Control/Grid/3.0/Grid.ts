
// alias: CGrid
// use: Header.ts
// use: Row.ts

export class Grid extends Control {

	public width: number
	public columns: Array<any>
	public columnMinWidth: number
	public headerHeight: number

	public header: any

	public bodyElement: HTMLElement

	static params: Array<string> = 'width,columns,columnMinWidth,headerHeight'.split(',')

	private _childs: PluginManager.Manager = new PluginManager.Manager

	constructor(params) {
		super(params)

		// init columns
		for (var i = 0, c = this.columns, l = c.length; i < l; i++) {
			var column = c[i]

			if (!column.width || column.width < this.columnMinWidth) {
				column.width = this.columnMinWidth
			}

		}		

	}

	render(): string {
		return require('Grid.html')({ id: this.elemId, width: this.width })
	}

	ap_topFrame(element: HTMLElement) {
		var header = this.header = new Header({ columns: this.columns, height: this.headerHeight })
		this._childs.addPlugin(header)
		header.append(element)
	}

	ap_bottomFrame(element: HTMLElement) {
	}

	ap_bodyFrame(element: HTMLElement) {
		this.bodyElement = element
	}


	setRows(rows: Array<any>) {
		// remove current

		for (var i = 0, l = rows.length; i < l; i++) {
			this.addRow(rows[i])
		}

	}

	addRow(row: any) {
		var r = new Row({ cells: row, columns: this.columns, width: this.header.width, height: this.headerHeight })
		r.append(this.bodyElement)
	}

}

Grid.prototype.width = 400

Grid.prototype.headerHeight = 28

Grid.prototype.columnMinWidth = 35
