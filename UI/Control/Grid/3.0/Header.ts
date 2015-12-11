 
export class Header extends Control {

	public columns: Array<any>

	static params: Array<string> = 'columns'.split(',')
	
	constructor(params: Object) {
		super(params)

	}

	render(): string {
		return require('Header.html')({ id: this.elemId, columns: this.columns })
	}
}