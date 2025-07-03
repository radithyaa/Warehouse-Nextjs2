-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  unit VARCHAR(20),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create warehouse_products pivot table
CREATE TABLE IF NOT EXISTS warehouse_products (
  warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  stok INTEGER DEFAULT 0,
  harga_beli INTEGER,
  harga_jual INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (warehouse_id, product_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  warehouse_id INTEGER REFERENCES warehouses(id),
  type VARCHAR(10) CHECK (type IN ('IN', 'OUT', 'TRANSFER')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  note TEXT,
  source_warehouse_id INTEGER,
  target_warehouse_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
