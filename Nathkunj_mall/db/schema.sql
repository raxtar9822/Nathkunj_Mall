CREATE DATABASE IF NOT EXISTS nathkunj_agri_mall;
USE nathkunj_agri_mall;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  category_id INT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_line VARCHAR(255) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT,
  status ENUM('New','Packed','Out for Delivery','Delivered','Cancelled') DEFAULT 'New',
  payment_method ENUM('COD','UPI','Card') NOT NULL,
  payment_ref VARCHAR(190),
  total DECIMAL(10,2) NOT NULL,
  assigned_partner_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_orders_addr FOREIGN KEY (address_id) REFERENCES delivery_addresses(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rev_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_rev_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) UNIQUE NOT NULL,
  description VARCHAR(255),
  discount_percent INT,
  max_uses INT DEFAULT 0,
  valid_from DATE,
  valid_to DATE,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE sales_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_date DATE NOT NULL,
  total_orders INT NOT NULL,
  total_sales DECIMAL(12,2) NOT NULL
);

CREATE TABLE delivery_partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20),
  status ENUM('Active','Inactive') DEFAULT 'Active'
);

INSERT INTO categories(name) VALUES ('Leafy'),('Root'),('Seasonal');