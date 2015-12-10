
// alias: CGrid

export class Grid extends Control {

	public width: number

	static params: Array<string> = 'width,columns'.split(',')

	constructor(params) {
		// console.log(JSON.stringify(params))
		super(params)
	}

	render(): string {
		return require('Grid.html')({ id: this.elemId, width: this.width })
	}

	ap_topFrame(element: HTMLElement) {
	}

	ap_bottomFrame(element: HTMLElement) {
	}

	ap_bodyFrame(element: HTMLElement) {
	}

}

Grid.prototype.width = 400
