type ShoppingCartEntry = {
  id: number;
  quantity: number;
};

export default class ShoppingCart {
  products: ShoppingCartEntry[] = [];

  private getIndexById(productId: number): number {
    return this.products.findIndex((product) => {
      return product.id == productId;
    });
  }

  addProduct(productId: number, quantity: number): void {
    const index = this.getIndexById(productId);
    if (index > -1) {
      this.products[index].quantity += quantity;
    } else {
      this.products.push({
        id: productId,
        quantity: quantity,
      });
    }
  }

  removeProduct(productId: number, quantity: number): void {
    const index = this.getIndexById(productId);
    if (index == -1) return;

    if (this.products[index].quantity <= quantity) {
      this.products.splice(index, 1);
    } else {
      this.products[index].quantity -= quantity;
    }
  }

  getQuantity(id: number): number {
    for (const product of this.products) {
      if (product.id == id) return product.quantity;
    }
    return 0;
  }
}
