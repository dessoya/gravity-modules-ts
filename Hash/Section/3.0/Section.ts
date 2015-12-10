
// alias: HashSection

export class Section extends Manager {

	public hashRE: string

	fe_onHashChange(hash) {
		this.fireEvent('onSectionMatch', this)
	}

	fa_onHashChange() {
		return this.hashRE
	}

	deactivate() {
	}

	activate() {
	}

}
 