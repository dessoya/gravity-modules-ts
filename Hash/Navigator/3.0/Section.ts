
export class Section extends Manager {

	private hashRE: string

	onPluged() {
		// console.log('onPluged', this)		
		this.setEventFilter('onHashChange', this.hashRE)
	}

	fe_onHashChange(hash) {
		// console.log('fe_onHashChange', hash)
		this.fireEvent('onSectionMatch', this)
	}

	deactivate() {
	}

	activate() {
	}

}
 