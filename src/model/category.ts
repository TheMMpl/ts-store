import pool from '../dbConfig';

export default class Category {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static async getCategories(): Promise<Category[]> {
    const client = await pool.connect();

    const query = 'SELECT * FROM categories';
    const res = await client.query(query);
    client.release();
    return res.rows.map((category) => {
      return new Category(category.id, category.name);
    });
  }

  static async findCategoryById(id: number): Promise<Category | null> {
    const client = await pool.connect();

    const query = 'SELECT * FROM categories WHERE id=$1';
    const res = await client.query(query, [id]);
    client.release();
    if (res.rowCount == 1) {
      const category = res.rows[0];
      return new Category(category.id, category.name);
    } else {
      return null;
    }
  }

  static async removeCategory(id: number): Promise<void> {
    const client = await pool.connect();

    const query1 = 'DELETE FROM categories WHERE id=$1';
    const query2 = 'DELETE FROM products_categories WHERE category_id=$1';
    await client.query(query1, [id]);
    await client.query(query2, [id]);
    client.release();
  }

  static async addCategory(name: string): Promise<void> {
    const client = await pool.connect();
    const query = 'INSERT INTO categories (name) VALUES ($1)';
    await client.query(query, [name]);
    client.release();
  }
}
