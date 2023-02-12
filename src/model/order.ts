import pool from "../dbConfig";

type OrderedProductEntry = [product_id: number, quantity: number];

export default class Order {
  id: number;
  user_id: number;
  order_date: Date,
  items: ORDE[],
  price DECIMAL(10, 2) NOT NULL

  constructor(
    id: number,
    user_id: number,
    order_date: Date,
    items: number,
    description: string,
    img_url: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.img_url = img_url;
  }

  static async 

  static async findById(id: number): Promise<Product | null> {
    const client = await pool.connect();

    const query = 'SELECT * FROM products WHERE id=$1';
    const res = await client.query(query, [id]);
    if (res.rowCount == 1) {
      const prod = res.rows[0];
      return new Product(
        prod.id,
        prod.name,
        prod.price * 100,
        prod.description,
        prod.img_url
      );
    } else {
      return null;
    }
  }

  static async addProduct(prod: Omit<Product, 'id'>): Promise<void> {
    const client = await pool.connect();

    const query =
      'INSERT INTO products (name, price, description, img_url) VALUES ($1, $2, $3, $4)';

    const price = (prod.price / 100.0).toFixed(2);
    await client.query(query, [
      prod.name,
      price,
      prod.description,
      prod.img_url,
    ]);
  }

  static async removeProductById(id: number): Promise<void> {
    const client = await pool.connect();

    const query1 = 'DELETE FROM products WHERE id=$1';
    const query2 = 'DELETE FROM products_categories WHERE product_id=$1';
    await client.query(query1, [id]);
    await client.query(query2, [id]);
  }
}
