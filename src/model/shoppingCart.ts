import Money from './money';
import Product from './product';

type ShoppingCartEntry = {
  product: Product;
  quantity: number;
};

export default class ShoppingCart {
  products: ShoppingCartEntry[] = [];

  private static getIndex(
    shoppingCart: ShoppingCart,
    product: Product
  ): number {
    return shoppingCart.products.findIndex((entry) => {
      return entry.product.id == product.id;
    });
  }

  static addProduct(
    shoppingCart: ShoppingCart,
    product: Product,
    quantity: number = 1
  ): void {
    const index = ShoppingCart.getIndex(shoppingCart, product);
    if (index > -1) {
      shoppingCart.products[index].quantity += quantity;
    } else {
      shoppingCart.products.push({
        product: product,
        quantity: quantity,
      });
    }
  }

  static removeProduct(
    shoppingCart: ShoppingCart,
    product: Product,
    quantity: number = 1
  ): void {
    const index = this.getIndex(shoppingCart, product);
    if (index == -1) return;

    if (shoppingCart.products[index].quantity <= quantity) {
      shoppingCart.products.splice(index, 1);
    } else {
      shoppingCart.products[index].quantity -= quantity;
    }
  }

  static getQuantity(shoppingCart: ShoppingCart, product: Product): number {
    for (const entry of shoppingCart.products) {
      if (entry.product.id == product.id) return entry.quantity;
    }
    return 0;
  }

  static getTotalCost(shoppingCart: ShoppingCart): Money {
    let sum = new Money(0);
    shoppingCart.products.forEach((entry) => {
      sum.add(Money.mult(entry.product.price, entry.quantity));
    });
    return sum;
  }

  static nOfItems(shoppingCart: ShoppingCart): number {
    return shoppingCart.products.length;
  }
}
