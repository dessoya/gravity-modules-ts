
export class Edit extends UI_Control.Control {

	public type: string
	public width: number
	public password: boolean|string

	static params: Array<string> = 'type,width,password'.split(',')

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

	get value() {
		// console.log('Edit value', this)

		if (this.el) {
			// console.log('Edit value 1', (<HTMLInputElement>this.el).value)
			return (<HTMLInputElement>this.el).value			
		}
		return null
	}

	onKeyup(element: HTMLElement, event: any) {
		this.fireEvent('on_edit_' + this.name + '_keyup', this.value)
	}

}

Edit.prototype.type = 'text'
Edit.prototype.width = 100
