import Money from './money';
import Product from './product';

type ShoppingCartEntry = {
  product: Product;
  quantity: number;
};

export default class ShoppingCart {
  products: ShoppingCartEntry[] = [];

  private getIndex(product: Product): number {
    return this.products.findIndex((entry) => {
      return entry.product.id == product.id;
    });
  }

  addProduct(product: Product, quantity: number = 1): void {
    const index = this.getIndex(product);
    if (index > -1) {
      this.products[index].quantity += quantity;
    } else {
      this.products.push({
        product: product,
        quantity: quantity,
      });
    }
  }

  removeProduct(product: Product, quantity: number = 1): void {
    const index = this.getIndex(product);
    if (index == -1) return;

    if (this.products[index].quantity <= quantity) {
      this.products.splice(index, 1);
    } else {
      this.products[index].quantity -= quantity;
    }
  }

  getQuantity(product: Product): number {
    for (const entry of this.products) {
      if (entry.product.id == product.id) return entry.quantity;
    }
    return 0;
  }

  getTotalCost(): Money {
    let sum = new Money(0);
    this.products.forEach((entry) => {
      sum.add(Money.mult(entry.product.price, entry.quantity));
    });
    return sum;
  }

  nOfItems(): number {
    return this.products.length;
  }
}
