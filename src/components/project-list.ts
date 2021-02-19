import { DragTarget } from '../models/drag-drop.js'
import Component from '../components/base-component.js'
import { Project, ProjectStatus } from '../models/project.js'
import { projectState } from '../store/project-state.js'
import { ProjectItem } from './project-item.js'
import { autobind } from '../decorators/autobind.js'

// ProjectList Class
export class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget {
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
