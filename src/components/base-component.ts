// Component Base class
namespace App {
	export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
}
