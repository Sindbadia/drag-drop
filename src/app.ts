// Validation
interface Validatable {
	value: string | number
	required?: boolean
	minLength?: number
	maxLength?: number
	min?: number
	max?: number
}

function validate(validatableInput: Validatable): boolean {
	let isValid = true
	if (validatableInput.required) {
		isValid = !!validatableInput.value.toString().trim() && isValid
	}

	if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
		isValid = validatableInput.value.length >= validatableInput.minLength && isValid
	}

	if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
		isValid = validatableInput.value.length <= validatableInput.maxLength && isValid
	}

	if (validatableInput.min != null && typeof validatableInput.value === 'number') {
		isValid = validatableInput.value >= validatableInput.min && isValid
	}

	if (validatableInput.max != null && typeof validatableInput.value === 'number') {
		isValid = validatableInput.value <= validatableInput.max && isValid
	}

	return isValid
}

// autobind decorator
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

// ProjectList Class
class ProjectList {
	templateEl: HTMLTemplateElement
	hostEl: HTMLDivElement
	element: HTMLElement

	constructor(private type: 'active' | 'finished') {
		this.templateEl = document.getElementById('project-list')! as HTMLTemplateElement
		this.hostEl = document.getElementById('app')! as HTMLDivElement

		const importedNode = document.importNode(this.templateEl.content, true)
		this.element = importedNode.firstElementChild as HTMLElement
		this.element.id = `${this.type}-projects`

		this.attach()
		this.renderContent()
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`
		this.element.querySelector('ul')!.id = listId
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
	}

	private attach() {
		this.hostEl.appendChild(this.element)
	}
}

// ProjectInput Class
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
		this.descInputEl = this.formEl.querySelector('#description')! as HTMLInputElement
		this.peopleInputEl = this.formEl.querySelector('#people')! as HTMLInputElement

		this.configure()
		this.attach()
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputEl.value
		const enteredDesc = this.descInputEl.value
		const enteredPeople = this.peopleInputEl.value

		const titleValidatable: Validatable = {
			value: enteredTitle,
			required: true,
		}
		const descValidatable: Validatable = {
			value: enteredDesc,
			required: true,
			minLength: 5,
		}
		const peopleValidatable: Validatable = {
			value: Number(enteredPeople),
			required: true,
			min: 1,
			max: 5,
		}

		if (
			!validate(titleValidatable) ||
			!validate(descValidatable) ||
			!validate(peopleValidatable)
		) {
			alert('Invalid input please try again!')
			return
		} else {
			return [enteredTitle, enteredDesc, Number(enteredPeople)]
		}
	}

	private clearInputs() {
		this.titleInputEl.value = ''
		this.descInputEl.value = ''
		this.peopleInputEl.value = ''
		this.titleInputEl.focus()
	}

	@autobind
	private submitHandler(event: Event) {
		event.preventDefault()
		const userInput = this.gatherUserInput()

		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput
			this.clearInputs()
		}
	}

	private configure() {
		this.formEl.addEventListener('submit', this.submitHandler)
	}

	private attach() {
		this.hostEl.appendChild(this.formEl)
	}
}

const prjInput = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')
