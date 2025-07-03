-- Insert sample products
INSERT INTO products (name, code, unit, category) VALUES
('Laptop Dell XPS 13', 'DELL-XPS13', 'pcs', 'Elektronik'),
('Mouse Wireless Logitech', 'LOG-MW01', 'pcs', 'Elektronik'),
('Kertas A4 80gsm', 'PAPER-A4-80', 'rim', 'Alat Tulis'),
('Pulpen Pilot', 'PILOT-BP01', 'pcs', 'Alat Tulis'),
('Meja Kantor Kayu', 'DESK-WOOD01', 'pcs', 'Furniture');

-- Insert sample warehouses
INSERT INTO warehouses (name, location) VALUES
('Gudang Pusat Jakarta', 'Jl. Sudirman No. 123, Jakarta Pusat'),
('Gudang Cabang Surabaya', 'Jl. Pemuda No. 456, Surabaya'),
('Gudang Cabang Bandung', 'Jl. Asia Afrika No. 789, Bandung');

-- Insert sample stock data
INSERT INTO warehouse_products (warehouse_id, product_id, stok, harga_beli, harga_jual) VALUES
(1, 1, 50, 12000000, 15000000),
(1, 2, 100, 250000, 350000),
(1, 3, 200, 45000, 55000),
(2, 1, 25, 12000000, 15000000),
(2, 2, 75, 250000, 350000),
(3, 3, 150, 45000, 55000),
(3, 4, 500, 3000, 5000),
(3, 5, 10, 1500000, 2000000);
