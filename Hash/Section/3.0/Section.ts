
// alias: Section

export class Section extends Manager {

	public hashRE: string

	onPluged() {
		this.setEventFilter('onHashChange', this.hashRE)
	}

	fe_onHashChange(hash) {
		this.fireEvent('onSectionMatch', this)
	}

	deactivate() {
	}

	activate() {
	}

}
 