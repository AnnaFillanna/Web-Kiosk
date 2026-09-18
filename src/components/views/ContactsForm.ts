import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.emailInput =
			container.querySelector<HTMLInputElement>('input[name="email"]')!;

		this.phoneInput =
			container.querySelector<HTMLInputElement>('input[name="phone"]')!;
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}
}