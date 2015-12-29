
export class Item extends Control {

	public title: string
	public name: string

	static params: Array<string> = 'title,name'.split(',')

	constructor(params) {
		super(params)
	}

	render(): string {
		return require('Item.html')({ id: this.elemId, title: this.title })
	}

	onClick() {
		this.fireEvent('onItemClick', this.name)
	}

}