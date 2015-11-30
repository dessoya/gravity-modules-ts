
// alias: HashLink

export class Link extends Control {

	public template: any
	public cls: string
	public title: string
	public hash: string

	static params: Array<string> = 'template,cls,title,hash'.split(',')
	static current: Link = null

	render(): string {
		return this.template(this)
	}

	onPluged() {
		this.setEventFilter('onHashChange', this.hash)
	}

	fe_onHashChange(hash) {

		if (Link.current && Link.current.el) {
			Link.current.el.classList.remove('active')
		}

		if (this.el) {
			this.el.classList.add('active')
		}

		Link.current = this
	}

}

Link.prototype.template = function(): string { return '<a id="' + this.elemId + '" href="#' + this.hash + '" class="' + this.cls + '" id="">' + this.title + '</a>' }
Link.prototype.cls = 'hash-link'
