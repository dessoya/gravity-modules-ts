
export abstract class Section extends PluginManager.Manager {
	public hashRE: string

	abstract _activate(): void;

	activate(): void {
		this.fireEvent('onSectionChange', this)
		if (this._activate) {
			this._activate()
		}
	}
} 