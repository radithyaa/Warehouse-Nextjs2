-- Insert sample products
INSERT INTO products (name, code, unit, category) VALUES
('Laptop Dell Inspiron', 'LAPTOP-001', 'pcs', 'Elektronik'),
('Mouse Wireless', 'MOUSE-001', 'pcs', 'Elektronik'),
('Keyboard Mechanical', 'KEYBOARD-001', 'pcs', 'Elektronik'),
('Monitor 24 inch', 'MONITOR-001', 'pcs', 'Elektronik'),
('Printer Canon', 'PRINTER-001', 'pcs', 'Elektronik'),
('Kertas A4', 'PAPER-A4', 'rim', 'Alat Tulis'),
('Pulpen Pilot', 'PEN-001', 'pcs', 'Alat Tulis'),
('Buku Tulis', 'BOOK-001', 'pcs', 'Alat Tulis'),
('Meja Kantor', 'DESK-001', 'pcs', 'Furniture'),
('Kursi Kantor', 'CHAIR-001', 'pcs', 'Furniture')
ON CONFLICT (code) DO NOTHING;

-- Insert sample warehouses
INSERT INTO warehouses (name, location) VALUES
('Gudang Pusat Jakarta', 'Jl. Sudirman No. 123, Jakarta Pusat'),
('Gudang Surabaya', 'Jl. Basuki Rahmat No. 456, Surabaya'),
('Gudang Bandung', 'Jl. Asia Afrika No. 789, Bandung'),
('Gudang Medan', 'Jl. Gatot Subroto No. 321, Medan')
ON CONFLICT DO NOTHING;

-- Insert sample stock data
INSERT INTO warehouse_products (warehouse_id, product_id, stok, harga_beli, harga_jual) VALUES
-- Gudang Jakarta (id: 1)
(1, 1, 50, 8000000, 10000000),  -- Laptop Dell
(1, 2, 100, 150000, 200000),    -- Mouse Wireless
(1, 3, 75, 500000, 650000),     -- Keyboard Mechanical
(1, 4, 30, 2000000, 2500000),   -- Monitor 24 inch
(1, 5, 20, 3000000, 3500000),   -- Printer Canon
(1, 6, 200, 50000, 65000),      -- Kertas A4
(1, 7, 500, 5000, 7000),        -- Pulpen Pilot
(1, 8, 300, 8000, 12000),       -- Buku Tulis

-- Gudang Surabaya (id: 2)
(2, 1, 30, 8000000, 10000000),  -- Laptop Dell
(2, 2, 80, 150000, 200000),     -- Mouse Wireless
(2, 3, 60, 500000, 650000),     -- Keyboard Mechanical
(2, 6, 150, 50000, 65000),      -- Kertas A4
(2, 7, 400, 5000, 7000),        -- Pulpen Pilot
(2, 9, 25, 1500000, 1800000),   -- Meja Kantor
(2, 10, 40, 800000, 1000000),   -- Kursi Kantor

-- Gudang Bandung (id: 3)
(3, 2, 120, 150000, 200000),    -- Mouse Wireless
(3, 4, 25, 2000000, 2500000),   -- Monitor 24 inch
(3, 5, 15, 3000000, 3500000),   -- Printer Canon
(3, 6, 100, 50000, 65000),      -- Kertas A4
(3, 8, 250, 8000, 12000),       -- Buku Tulis
(3, 9, 20, 1500000, 1800000),   -- Meja Kantor
(3, 10, 35, 800000, 1000000),   -- Kursi Kantor

-- Gudang Medan (id: 4)
(4, 1, 20, 8000000, 10000000),  -- Laptop Dell
(4, 3, 40, 500000, 650000),     -- Keyboard Mechanical
(4, 4, 15, 2000000, 2500000),   -- Monitor 24 inch
(4, 6, 80, 50000, 65000),       -- Kertas A4
(4, 7, 200, 5000, 7000),        -- Pulpen Pilot
(4, 8, 150, 8000, 12000)        -- Buku Tulis
ON CONFLICT (warehouse_id, product_id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (product_id, warehouse_id, type, quantity, note, source_warehouse_id, target_warehouse_id) VALUES
(1, 1, 'IN', 10, 'Pembelian laptop baru', NULL, NULL),
(2, 1, 'IN', 50, 'Restok mouse wireless', NULL, NULL),
(1, 1, 'OUT', 5, 'Penjualan ke customer', NULL, NULL),
(2, 1, 'TRANSFER', 20, 'Transfer ke gudang Surabaya', 1, 2),
(3, 2, 'IN', 30, 'Pembelian keyboard mechanical', NULL, NULL),
(6, 3, 'OUT', 25, 'Penggunaan internal', NULL, NULL);
