
export class Cell extends Control {

	public width: number
	public height: number
	public title: string
	public cls: string
	public x: number
	public dataValue: any

	static params: Array<string> = 'title,cls,x,width,height,dataValue'.split(',')

	constructor(params: Object) {
		super(params)

	}

	render(): string {
		// console.log(require('Cell.html'))
		return require('Cell.html')({ id: this.elemId, dataValue: this.dataValue, cls: this.cls, x: this.x, width: this.width, height: this.height, title: this.title })
	}

} 