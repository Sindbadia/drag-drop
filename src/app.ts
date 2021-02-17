function autobind(target: any, methodName: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value
	const adjDescriptor = {
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this)
			return boundFn
		},
	}
	return adjDescriptor
}

class ProjectInput {
	templateEl: HTMLTemplateElement
	hostEl: HTMLDivElement
	formEl: HTMLFormElement
	titleInputEl: HTMLInputElement
	descInputEl: HTMLInputElement
	peopleInputEl: HTMLInputElement

	constructor() {
		this.templateEl = document.getElementById('project-input')! as HTMLTemplateElement
		this.hostEl = document.getElementById('app')! as HTMLDivElement

		const importedNode = document.importNode(this.templateEl.content, true)
		this.formEl = importedNode.firstElementChild as HTMLFormElement
		this.formEl.id = 'user-input'

		this.titleInputEl = this.formEl.querySelector('#title')! as HTMLInputElement
		this.descInputEl = this.formEl.querySelector('#descripion')! as HTMLInputElement
		this.peopleInputEl = this.formEl.querySelector('#people')! as HTMLInputElement

		this.configure()
		this.attach()
	}

	@autobind
	private submitHandler(event: Event) {
		event.preventDefault()
		console.log(this.titleInputEl.value)
	}

	private configure() {
		this.formEl.addEventListener('submit', this.submitHandler)
	}

	private attach() {
		this.hostEl.appendChild(this.formEl)
	}
}

const prjInput = new ProjectInput()
