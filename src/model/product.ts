import pool from '../dbConfig';
import Money from './money';

export default class Product {
  id: number;
  name: string;
  price: Money;
  description: string;
  img_url: string;

  constructor(
    id: number,
    name: string,
    price: Money,
    description: string,
    img_url: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.img_url = img_url;
  }

  static async findProductById(id: number): Promise<Product | null> {
    const client = await pool.connect();

    const query = 'SELECT * FROM products WHERE id=$1';
    const res = await client.query(query, [id]);
    client.release();
    if (res.rowCount == 1) {
      const prod = res.rows[0];
      return new Product(
        prod.id,
        prod.name,
        Money.ofDecimal(prod.price),
        prod.description,
        prod.img_url
      );
    } else {
      return null;
    }
  }

  static async addProduct(
    prod: Omit<Product, 'id'> & { categories?: number[] }
  ): Promise<Product> {
    const client = await pool.connect();

    const query =
      'INSERT INTO products (name, price, description, img_url) VALUES ($1, $2, $3, $4) RETURNING id';

    const prodId = (
      await client.query(query, [
        prod.name,
        prod.price.toDecimal(),
        prod.description,
        prod.img_url,
      ])
    ).rows[0].id;

    if (prod.categories != null) {
      const queryProductCategory =
        'INSERT INTO products_categories (product_id, category_id) VALUES ($1, $2)';
      for (const categoryId of prod.categories) {
        await client.query(queryProductCategory, [prodId, categoryId]);
      }
    }

    client.release();
    return new Product(
      prodId,
      prod.name,
      prod.price,
      prod.description,
      prod.img_url
    );
  }

  static async removeProduct(id: number): Promise<void> {
    const client = await pool.connect();

    const query1 = 'DELETE FROM products WHERE id=$1';
    const query2 = 'DELETE FROM products_categories WHERE product_id=$1';
    await client.query(query1, [id]);
    await client.query(query2, [id]);
    client.release();
  }
}
