import { Draggable } from '../models/drag-drop'
import Component from '../components/base-component'
import { Project } from '../models/project'
import { autobind } from '../decorators/autobind'

// ProjectItem Class
export class ProjectItem
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
