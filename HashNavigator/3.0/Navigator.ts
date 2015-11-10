
// use: Section.ts

export class Navigator extends PluginManager.Manager {

	constructor() {
		super()
	}


	activate(section: Section) {

	}

	getSectionByHash(hash: string): Section {

	}

	getDefaultSection(): Section {

	}

	start() {		

		let self = this
		window.onhashchange = function() {

			var hash = window.location.hash
			if(hash.length > 0 && hash[0] === '#') hash = hash.substr(1)

			self.fireEvent('onHashChange', hash)

			var section = self.getSectionByHash(hash) || self.getDefaultSection()

			if (section) {
				this.activate(section)
			}
			else {
				window.location.hash = ''
			}
		}

		window.onhashchange()

	}

}