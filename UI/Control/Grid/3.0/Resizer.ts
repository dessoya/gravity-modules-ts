
export class Resizer extends Control {

	constructor(params: Object) {
		super(params)

	}

	render(): string {
		return require('Resizer.html')({ id: this.elemId })
	}

}