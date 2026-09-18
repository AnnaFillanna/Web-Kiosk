import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

export class OrderForm extends Form {
	protected paymentButtons: HTMLButtonElement[];
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.paymentButtons = Array.from(
			container.querySelectorAll<HTMLButtonElement>('.button_alt')
		);

		this.addressInput =
			container.querySelector<HTMLInputElement>('input[name="address"]')!;
	}

	set address(value: string) {
		this.addressInput.value = value;
	}

	set payment(value: TPayment | null) {
		this.paymentButtons.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === value);
		});
	}
}