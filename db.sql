DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS ROLE;
DROP TYPE IF EXISTS ORDER_STATUS;

CREATE TYPE ROLE AS ENUM ('user', 'admin');
CREATE TYPE ORDER_STATUS AS ENUM ('pending', 'sent', 'finished');

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(60) NOT NULL,
  password VARCHAR NOT NULL,
  role ROLE NOT NULL
);


INSERT INTO users (email, password, role) VALUES ('admin@admin', '$2b$10$X7He8rkiq4nDZXlb5W2QW.tR45tEobUSJH8FLNgNLcSUjFUBxE5te', 'admin');
INSERT INTO users (email, password, role) VALUES ('user@user', '$2b$10$X7He8rkiq4nDZXlb5W2QW.tR45tEobUSJH8FLNgNLcSUjFUBxE5te', 'user');
INSERT INTO users (email, password, role) VALUES ('user2@user2', '$2b$10$X7He8rkiq4nDZXlb5W2QW.tR45tEobUSJH8FLNgNLcSUjFUBxE5te', 'user');


CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(60) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description VARCHAR(2000) NOT NULL,
  img_url VARCHAR(500) NOT NULL
);


INSERT INTO products (name, price, description, img_url) VALUES ('Product 1', '11.11', 'Description of product 1', 'assets/product_no_image.png');
INSERT INTO products (name, price, description, img_url) VALUES ('Product 2', '12.99', 'Description of product 2', 'assets/product_no_image.png');
INSERT INTO products (name, price, description, img_url) VALUES ('Product 3', '11.01', 'Description of product 3', 'assets/product_no_image.png');
INSERT INTO products (name, price, description, img_url) VALUES ('Product 4', '14.11', 'Description of product 4', 'assets/product_no_image.png');
INSERT INTO products (name, price, description, img_url) VALUES ('Number 7', '7.77', 'Did you know it is the only prime number preceding a cube? Now only $7.77!', 'assets/product_no_image.png');
INSERT INTO products (name, price, description, img_url) VALUES ('Number 8', '14.11', 'Desc of number 8', 'assets/product_no_image.png');
INSERT INTO products (name, price, description, img_url) VALUES ('Number 9', '14.11', 'Desc of number 9', 'assets/product_no_image.png');
INSERT INTO products (name, price, description, img_url) VALUES ('Number 10', '14.11', 'Desc of number 10', 'assets/product_no_image.png');
INSERT INTO products (name, price, description, img_url) VALUES ('Number 11', '14.11', 'Desc of number 11', 'assets/product_no_image.png');


CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(60) NOT NULL
);


INSERT INTO categories (name) VALUES ('Divisible by 1');
INSERT INTO categories (name) VALUES ('Divisible by 2');
INSERT INTO categories (name) VALUES ('Divisible by 3');
INSERT INTO categories (name) VALUES ('Divisible by 4');
INSERT INTO categories (name) VALUES ('Divisible by 5');
INSERT INTO categories (name) VALUES ('Divisible by 6');
INSERT INTO categories (name) VALUES ('Divisible by 7');


CREATE TABLE products_categories (
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  PRIMARY KEY (product_id, category_id)
);


INSERT INTO products_categories (product_id, category_id) VALUES (1, 1);
INSERT INTO products_categories (product_id, category_id) VALUES (1, 2);
INSERT INTO products_categories (product_id, category_id) VALUES (1, 4);
INSERT INTO products_categories (product_id, category_id) VALUES (2, 3);
INSERT INTO products_categories (product_id, category_id) VALUES (3, 2);
INSERT INTO products_categories (product_id, category_id) VALUES (5, 2);
INSERT INTO products_categories (product_id, category_id) VALUES (6, 2);
INSERT INTO products_categories (product_id, category_id) VALUES (7, 2);
INSERT INTO products_categories (product_id, category_id) VALUES (8, 2);
INSERT INTO products_categories (product_id, category_id) VALUES (9, 2);


CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  products INT[][] NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status ORDER_STATUS NOT NULL DEFAULT 'pending'
);


INSERT INTO orders (user_id, products, price, status) VALUES ('2', '{{1, 1}, {2, 1}}', '102.3', 'finished');
INSERT INTO orders (user_id, products, price, status) VALUES ('2', '{{3, 1}, {1, 1}}', '102.3', 'sent');