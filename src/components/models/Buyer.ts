import type { IEvents } from '../base/Events';
import type { IBuyer } from '../../types';

export class Buyer {
  private payment: IBuyer['payment'] | null = null;
  private email = '';
  private phone = '';
  private address = '';

  constructor(private readonly events?: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    let changed = false;

    if (data.payment !== undefined) {
      changed = changed || this.payment !== data.payment;
      this.payment = data.payment;
    }
    if (data.email !== undefined) {
      changed = changed || this.email !== data.email;
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      changed = changed || this.phone !== data.phone;
      this.phone = data.phone;
    }
    if (data.address !== undefined) {
      changed = changed || this.address !== data.address;
      this.address = data.address;
    }

    if (changed) {
      this.events?.emit('buyer:changed', {
        data: this.getData(),
        errors: this.validate(),
      });
    }
  }

  getData(): Partial<IBuyer> {
    const data: Partial<IBuyer> = {
      email: this.email,
      phone: this.phone,
      address: this.address,
    };

    if (this.payment !== null) {
      data.payment = this.payment;
    }

    return data;
  }

  clear(): void {
    if (!this.payment && !this.email && !this.phone && !this.address) {
      return;
    }

    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';

    this.events?.emit('buyer:changed', {
      data: this.getData(),
      errors: this.validate(),
    });
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) {
      errors.payment = 'Payment is required';
    }
    if (!this.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Phone is required';
    }
    if (!this.address.trim()) {
      errors.address = 'Address is required';
    }

    return errors;
  }
}
