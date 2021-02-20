import Component from '../components/base-component'
import * as Validation from '../util/validation'
import { autobind as Autobind } from '../decorators/autobind'
import { projectState } from '../store/project-state'

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputEl: HTMLInputElement
	descInputEl: HTMLInputElement
	peopleInputEl: HTMLInputElement

	constructor() {
		super('project-input', 'app', 'user-input')

		this.titleInputEl = this.element.querySelector('#title')! as HTMLInputElement
		this.descInputEl = this.element.querySelector('#description')! as HTMLInputElement
		this.peopleInputEl = this.element.querySelector('#people')! as HTMLInputElement

		this.configure()
	}

	public configure() {
		this.element.addEventListener('submit', this.submitHandler)
	}

	public renderContent() {}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputEl.value
		const enteredDesc = this.descInputEl.value
		const enteredPeople = this.peopleInputEl.value

		const titleValidatable: Validation.Validatable = {
			value: enteredTitle,
			required: true,
		}
		const descValidatable: Validation.Validatable = {
			value: enteredDesc,
			required: true,
			minLength: 5,
		}
		const peopleValidatable: Validation.Validatable = {
			value: Number(enteredPeople),
			required: true,
			min: 1,
			max: 5,
		}

		if (
			!Validation.validate(titleValidatable) ||
			!Validation.validate(descValidatable) ||
			!Validation.validate(peopleValidatable)
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

	@Autobind
	private submitHandler(event: Event) {
		event.preventDefault()
		const userInput = this.gatherUserInput()

		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput
			projectState.addProject(title, desc, people)
			this.clearInputs()
		}
	}
}
