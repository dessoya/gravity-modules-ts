
// alias: Navigator

interface MyWindow extends Window {
	onhashchange(): void
}
declare var window: MyWindow

/*

	fire: -> onHashChange
	catch: <- onSectionMatch

 */

export class Navigator extends Manager {

	private _currentSection: HashSection = null

	getDefaultSection(): HashSection {
		return null
	}

	start() {

		let self = this

		window.onhashchange = function() {

			var hash = window.location.hash
			if (hash.length > 0 && hash[0] === '#') hash = hash.substr(1)

			if (self._currentSection) {
				self._currentSection.deactivate()
				self._currentSection = null
			}

			self.fireEvent('onHashChange', hash)

			if (!self._currentSection) {
				self._currentSection = self.getDefaultSection()
			}

			if (self._currentSection) {
				self._currentSection.activate()
			}
		}

		window.onhashchange()
	}

	onSectionMatch(section: HashSection) {
		this._currentSection = section
	}

}