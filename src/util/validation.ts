// Validation
export interface Validatable {
	value: string | number
	required?: boolean
	minLength?: number
	maxLength?: number
	min?: number
	max?: number
}

export function validate(validatableInput: Validatable): boolean {
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
