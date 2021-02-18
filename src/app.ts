// Drag & Drop Interfaces
interface Draggable {
	dragStartHandler(event: DragEvent): void
	dragEndHandler(event: DragEvent): void
}

interface DragTarget {
	dragOverHandler(event: DragEvent): void
	dropHandler(event: DragEvent): void
	dragLeaveHandler(event: DragEvent): void
}

// Project Type
enum ProjectStatus {
	ACTIVE,
	FINISHED,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public desc: string,
		public people: number,
		public status: ProjectStatus,
	) {}
}

// Project State Management
type Listener<T> = (items: T[]) => void

class State<T> {
	protected listeners: Listener<T>[] = []

	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn)
	}
}

class ProjectState extends State<Project> {
	private projects: Project[] = []
	private static instance: ProjectState

	private constructor() {
		super()
	}

	static getInstance() {
		if (this.instance) {
			return this.instance
		}
		this.instance = new ProjectState()
		return this.instance
	}

	public addProject(title: string, desc: string, numOfPeople: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			desc,
			numOfPeople,
			ProjectStatus.ACTIVE,
		)

		this.projects.push(newProject)
		this.updateListeners()
	}

	public moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find(prj => (prj.id = projectId))
		if (project && project.status !== newStatus) {
			project.status = newStatus
			this.updateListeners()
		}
	}

	private updateListeners() {
		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice())
		}
	}
}

const projectState = ProjectState.getInstance()

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
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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

// Component Base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateEl: HTMLTemplateElement
	hostEl: T
	element: U

	constructor(
		templateId: string,
		hostElId: string,
		// _insertAtStart: boolean,
		newElId?: string,
	) {
		this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement
		this.hostEl = document.getElementById(hostElId)! as T

		const importedNode = document.importNode(this.templateEl.content, true)
		this.element = importedNode.firstElementChild as U
		if (newElId) {
			this.element.id = newElId
		}

		this.attach()
	}

	private attach() {
		this.hostEl.appendChild(this.element)
	}

	abstract configure(): void
	abstract renderContent(): void
}

// ProjectItem Class
class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
	implements Draggable {
	private project: Project

	public get persons(): string {
		if (this.project.people === 1) {
			return '1 person'
		} else {
			return `${this.project.people} persons`
		}
	}

	constructor(hostId: string, project: Project) {
		super('single-project', hostId, project.id)
		this.project = project

		this.configure()
		this.renderContent()
	}

	@autobind
	public dragStartHandler(event: DragEvent) {
		event.dataTransfer!.setData('text/plain', this.project.id)
		event.dataTransfer!.effectAllowed = 'move'
	}

	public dragEndHandler(_: DragEvent) {
		console.log('DragEnd')
	}

	public configure() {
		this.element.addEventListener('dragstart', this.dragStartHandler)
		this.element.addEventListener('dragend', this.dragEndHandler)
	}

	public renderContent() {
		this.element.querySelector('h2')!.textContent = this.project.title
		this.element.querySelector('h3')!.textContent = this.persons + ' assigned'
		this.element.querySelector('p')!.textContent = this.project.desc
	}
}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
	assignedProjects: Project[] = []

	constructor(private type: 'active' | 'finished') {
		super('project-list', 'app', `${type}-projects`)

		this.configure()
		this.renderContent()
	}

	@autobind
	dragOverHandler(event: DragEvent) {
		if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
			event.preventDefault()
			const listEl = this.element.querySelector('ul')!
			listEl.classList.add('droppable')
		}
	}

	@autobind
	dropHandler(event: DragEvent) {
		const prjId = event.dataTransfer!.getData('text/plain')
		projectState.moveProject(
			prjId,
			this.type === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED,
		)
	}

	@autobind
	dragLeaveHandler(_: DragEvent) {
		const listEl = this.element.querySelector('ul')!
		listEl.classList.remove('droppable')
	}

	public configure() {
		this.element.addEventListener('dragover', this.dragOverHandler)
		this.element.addEventListener('dragleave', this.dragLeaveHandler)
		this.element.addEventListener('drop', this.dropHandler)

		projectState.addListener((projects: Project[]) => {
			const relevantProjects = projects.filter(prj => {
				if (this.type === 'active') {
					return prj.status === ProjectStatus.ACTIVE
				}
				return prj.status === ProjectStatus.FINISHED
			})
			this.assignedProjects = relevantProjects
			this.renderProjects()
		})
	}

	public renderContent() {
		const listId = `${this.type}-projects-list`
		this.element.querySelector('ul')!.id = listId
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
	}

	private renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`,
		)! as HTMLUListElement
		listEl.innerHTML = ''
		for (const prjItem of this.assignedProjects) {
			new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
		}
	}
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
			projectState.addProject(title, desc, people)
			this.clearInputs()
		}
	}
}

const prjInput = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')
