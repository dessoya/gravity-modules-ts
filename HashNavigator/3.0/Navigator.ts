

interface MyWindow extends Window {
	onhashchange(): void;
}
declare var window: MyWindow;

// use: Section.ts

export class Navigator extends PluginManager.Manager {

	private _searchSectionRE: any
	private _searchSectionRESource: string
	private _sectionsOrder: Array<Section>

	constructor() {
		super()
		this._searchSectionRE = null
		this._searchSectionRESource = ''
		this._sectionsOrder = [ null ]
	}

	addSection(section: Section) {
		var re = section.hashRE
		if (this._searchSectionRESource.length > 0) {
			this._searchSectionRESource += '|'
		}
		this._searchSectionRESource += '(' + re + ')'
		this._searchSectionRE = new RegExp('^(?:' + this._searchSectionRESource + ')$')
		this._sectionsOrder.push(section)
	}

	activateSection(section: Section) {
		console.log('activate')
		console.log(section)
	}

	getSectionByHash(hash: string): Section {

		if (!this._searchSectionRE) {
			return null
		}

		var a: any		
		if (a = this._searchSectionRE.exec(hash)) {
			var i = 1
			while (true) {
				if (a[i]) {
					return this._sectionsOrder[i]
				}
			}
		}

		return null
	}

	getDefaultSection(): Section {
		return null
	}

	start() {		

		let self = this

		window.onhashchange = function() {

			var hash = window.location.hash
			if(hash.length > 0 && hash[0] === '#') hash = hash.substr(1)

			self.fireEvent('onHashChange', hash)

			var section = self.getSectionByHash(hash) || self.getDefaultSection()

			if (section) {
				self.activateSection(section)
			}
			else {
				window.location.hash = ''
			}
		}

		window.onhashchange()

	}

}
