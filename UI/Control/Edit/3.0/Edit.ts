
export class Edit extends UI_Control.Control {

	public type: string
	public width: number
	public password: boolean|string

	static params: Array<string> = 'type,width,password'.split(',')

/*
	initDefaluts() {
		this.type = 'text'
		this.width = 100
	}
*/
	constructor(params) {		
		super(params)
	}

	getHTMLType(): string {
		var type = this.type
		if(this.password === true || this.password === 'true') {
			type = 'password'
		}
		return type
	}

	render(): string {
		return require('Edit.html')({ id: this.elemId, width: this.width, type: this.getHTMLType() })
	}

}

Edit.prototype.type = 'text'
Edit.prototype.width = 100
