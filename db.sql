DROP TABLE IF EXISTS products_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS ROLE;

CREATE TYPE ROLE AS ENUM ('user', 'admin');

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(60) NOT NULL,
  password VARCHAR NOT NULL,
  role ROLE NOT NULL
);


INSERT INTO users (email, password, role) VALUES ('admin@admin', '$2b$10$X7He8rkiq4nDZXlb5W2QW.tR45tEobUSJH8FLNgNLcSUjFUBxE5te', 'admin');
INSERT INTO users (email, password, role) VALUES ('user@user', '$2b$10$X7He8rkiq4nDZXlb5W2QW.tR45tEobUSJH8FLNgNLcSUjFUBxE5te', 'user');


CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(60) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description VARCHAR(2000) NOT NULL,
  img_url VARCHAR(500) NOT NULL
);


CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(60) NOT NULL
);


CREATE TABLE products_categories (
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  PRIMARY KEY (product_id, category_id)
);
