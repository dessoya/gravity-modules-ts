
// alias: CGrid
// use: Header.ts
// use: Row.ts

export class Grid extends Control {

	public width: number
	public columns: Array<any>
	public columnMinWidth: number
	public headerHeight: number
	public contextMenu: Object

	public header: any

	public rows: Array<any> = [ ]

	public bodyElement: HTMLElement

	static params: Array<string> = 'width,columns,columnMinWidth,headerHeight,contextMenu'.split(',')

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

		var rowIndex = this.rows.length
		row._rowIndex = rowIndex

		var r = new Row({ cells: row, columns: this.columns, width: this.header.width, height: this.headerHeight, rowIndex: rowIndex })
		r.append(this.bodyElement)

		this.rows.push(r)
	}

	delRow(index: number) {
		console.log('delRow', index)
		console.log(this.rows)
		var row = this.rows[index]
		row.remove()
	}

	onContextMenu(element: HTMLElement, event: any) {

		console.log('onContextMenu')

		var self = this

		if (!event.target.parentNode || !event.target.parentNode.classList.contains('cell')) {
			return
		}

		var rowIndex = parseInt(event.target.parentNode.parentNode.getAttribute('data-row'))
		console.log('rowIndex', rowIndex)
		var row = this.rows[rowIndex].cells

		var items
		if(this.contextMenu['itemsMaker']) {
			// items = this.contextMenu['itemsMaker'](row, column_name)
		}
		else {
			items = this.contextMenu['items']
		}
		
		if (items) {
			var column_name = 'column_name'

			PopupMenu.open(
				event.pageX - 7,
				event.pageY - 7,
				this.contextMenu['titleFormater'](row, column_name),
				items,
				function(itemName, row) {
					self.contextMenu['callback'](itemName, row, self)
				},				
				row
			)
		}



		if (event.preventDefault) {
			event.preventDefault()
		}

		return false		
	}

}

Grid.prototype.width = 400

Grid.prototype.headerHeight = 28

Grid.prototype.columns = []
Grid.prototype.columnMinWidth = 35

Grid.prototype.contextMenu = {}
