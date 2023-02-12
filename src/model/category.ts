import pool from '../dbConfig';

export default class Category {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static async getCategories() {
    const client = await pool.connect();

    const query = 'SELECT * FROM categories';
    const res = await client.query(query);
    return res.rows.map((category) => {
      return new Category(category.id, category.name);
    });
  }

  static async removeCategory(id: number) {
    const client = await pool.connect();

    const query1 = 'DELETE FROM categories WHERE id=$1';
    const query2 = 'DELETE FROM products_categories WHERE category_id=$1';
    await client.query(query1, [id]);
    await client.query(query2, [id]);
  }

  static async addCategory(name: string) {
    const client = await pool.connect();
    const query = 'INSERT INTO categories (name) VALUES ($1)';
    await client.query(query, [name]);
  }
}
