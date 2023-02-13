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

  static toDecimal(val: number): number {
    return Number.parseFloat((val / 100).toFixed(2));
  }

  static add(lhs: Money, rhs: Money): Money {
    return new Money(lhs.amount + rhs.amount);
  }

  add(oth: Money): void {
    this.amount += oth.amount;
  }

  static mult(lhs: Money, mult: number): Money {
    if (!Number.isInteger(mult) || mult < 0)
      throw new Error('Wrong multiplier!');

    return new Money(lhs.amount * mult);
  }

  mult(mult: number): void {
    if (!Number.isInteger(mult) || mult < 0)
      throw new Error('Wrong multiplier!');

    this.amount *= mult;
  }
}
