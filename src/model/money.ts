export default class Money {
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  static ofDecimal(amount: number): Money {
    return new Money(Number.parseInt((amount * 100).toFixed(0)));
  }

  toDecimal(): number {
    return Number.parseFloat((this.amount / 100).toFixed(2));
  }
}
