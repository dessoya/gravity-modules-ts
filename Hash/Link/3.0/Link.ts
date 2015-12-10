
// alias: HashLink

export class Link extends Control {

	public template: any
	public cls: string
	public title: string
	public hash: string
	public group: string

	static params: Array<string> = 'template,cls,title,hash,group'.split(',')
	static current: Map<string, Link> = new Map<string, Link>()

	static deactivateGroup(group: string) {
		var current: Link = Link.current.get(group)
		if (current && current.el) {
			current.el.classList.remove('active')
		}
	}

	render(): string {
		return this.template(this)
	}

	fa_onHashChange() {
		return this.hash
	}

	fe_onHashChange(hash) {

		// console.log('fe_onHashChange', this.hash)

		var current: Link = Link.current.get(this.group)
		if (current && current.el) {
			current.el.classList.remove('active')
		}

		if (this.el) {
			this.el.classList.add('active')
		}

		Link.current.set(this.group, this)
	}

}

Link.prototype.template = function(): string { return '<a id="' + this.elemId + '" href="#' + this.hash + '" class="' + this.cls + '" id="">' + this.title + '</a>' }
Link.prototype.cls = 'hash-link'
Link.prototype.group = 'none'
