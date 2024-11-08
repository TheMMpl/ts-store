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

    const query1 = 'DELETE FROM products_categories WHERE product_id=$1';
    const query2 = 'DELETE FROM products WHERE id=$1';
    await client.query(query1, [id]);
    await client.query(query2, [id]);
    client.release();
  }

  static async getProductsFromCategory(
    categoryId: number,
    limit?: number
  ): Promise<Product[]> {
    const client = await pool.connect();

    let res;
    if (limit == null) {
      const query = `
        SELECT * 
        FROM products
        INNER JOIN products_categories ON products_categories.product_id = products.id
        WHERE products_categories.category_id = $1
        ORDER BY id DESC`;
      res = (await client.query(query, [categoryId])).rows;
    } else {
      const query = `
        SELECT * 
        FROM products
        INNER JOIN products_categories ON products_categories.product_id = products.id
        WHERE products_categories.category_id = $1
        ORDER BY id DESC LIMIT $2`;
      res = (await client.query(query, [categoryId, limit])).rows;
    }

    client.release();
    return res;
  }

  static async getLatestProducts(limit?: number): Promise<Product[]> {
    const client = await pool.connect();

    let res;
    if (limit == null) {
      const query = `
        SELECT * 
        FROM products
        ORDER BY id DESC`;
      res = (await client.query(query)).rows;
    } else {
      const query = `
        SELECT * 
        FROM products
        ORDER BY id DESC LIMIT $1`;
      res = (await client.query(query, [limit])).rows;
    }

    client.release();
    return res;
  }

  static async updateProduct(product: Product): Promise<void> {
    const client = await pool.connect();
    const query =
      'UPDATE products SET name=$1, description=$2, price=$3, img_url=$4 WHERE id=$5';

    await client.query(query, [
      product.name,
      product.description,
      product.price,
      product.img_url,
      product.id,
    ]);

    client.release();
  }

  static async findProductsByQuery(query: string): Promise<Product[]> {
    const client = await pool.connect();
    const sqlQuery = `SELECT * FROM products WHERE name LIKE $1`;

    const res = await client.query(sqlQuery, ['%' + query + '%']);
    client.release();

    return res.rows;
  }
}
