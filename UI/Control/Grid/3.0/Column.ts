
export class Column extends Control {

	public width: number
	public height: number
	public title: string
	public cls: string
	public x: number

	static params: Array<string> = 'title,cls,x,width,height'.split(',')

	constructor(params: Object) {
		super(params)

	}

	render(): string {
		return require('Column.html')({ id: this.elemId, cls: this.cls, x: this.x, width: this.width, height: this.height, title: this.title })
	}

}