import pool from '../dbConfig';

export default class User {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin';

  constructor(
    id: number,
    email: string,
    password: string,
    role: 'user' | 'admin'
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const client = await pool.connect();

    const query = 'SELECT * FROM users WHERE email=$1';
    const res = await client.query(query, [email]);
    if (res.rowCount == 1) {
      const user = res.rows[0];
      return new User(user.id, user.email, user.password, user.role);
    } else {
      return null;
    }
  }

  static async addUser(user: Omit<User, 'id'>): Promise<User> {
    const client = await pool.connect();

    const query =
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id';
    const result = await client.query(query, [
      user.email,
      user.password,
      user.role,
    ]);
    return new User(result.rows[0].id, user.email, user.password, user.role);
  }
}
