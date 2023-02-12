import pool from '../dbConfig';
import Money from './money';

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
  }
}
