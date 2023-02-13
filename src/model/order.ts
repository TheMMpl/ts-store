import pool from '../dbConfig';

import Money from './money';
import ShoppingCart from './shoppingCart';

type OrderedProductEntry = [product_id: number, quantity: number];
type OrderStatus = 'pending' | 'sent' | 'finished';

export default class Order {
  id: number;
  userId: number;
  orderDate: Date;
  products: OrderedProductEntry[];
  price: Money;
  status: OrderStatus;

  constructor(
    id: number,
    userId: number,
    orderDate: Date,
    products: OrderedProductEntry[],
    price: Money,
    status: OrderStatus
  ) {
    this.id = id;
    this.userId = userId;
    this.orderDate = orderDate;
    this.products = products;
    this.price = price;
    this.status = status;
  }

  static async getOrders(): Promise<Order[]> {
    const client = await pool.connect();

    const query = 'SELECT * FROM orders';
    const res = await client.query(query);
    client.release();
    return res.rows.map((order) => {
      return new Order(
        order.id,
        order.user_id,
        order.order_date,
        order.products,
        Money.ofDecimal(order.price),
        order.status
      );
    });
  }

  static async removeOrder(id: number): Promise<void> {
    const client = await pool.connect();

    const query = 'DELETE FROM orders WHERE id=$1';
    await client.query(query, [id]);
    client.release();
  }

  static async placeOrder(
    shoppingCart: ShoppingCart,
    userId: number
  ): Promise<Order> {
    const client = await pool.connect();

    const query =
      'INSERT INTO orders (user_id, products, price) VALUES ($1, $2, $3) RETURNING (id, order_date, status)';

    const totalPrice = ShoppingCart.getTotalCost(shoppingCart);
    const products: OrderedProductEntry[] = shoppingCart.products.map(
      (entry) => {
        return [entry.product.id, entry.quantity];
      }
    );
    const result = (await client.query(query, [userId, products, totalPrice]))
      .rows[0];

    client.release();
    return new Order(
      result.id,
      userId,
      result.order_date,
      products,
      totalPrice,
      result.status
    );
  }
}
