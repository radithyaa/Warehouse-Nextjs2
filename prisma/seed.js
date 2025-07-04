const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting database seeding...');

  // Truncate all tables (optional, if you want to clear the database first)
  console.log('🗑️ Truncating existing data...');
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "transactions",
      "warehouse_products",
      "products",
      "warehouses"
    RESTART IDENTITY CASCADE;
  `);
  console.log('✅ Data truncated.');

  // --- Seed Products ---
  console.log('🌱 Seeding products...');
  await prisma.product.createMany({
    data: [
      // Elektronik
      { name: 'Laptop Dell Inspiron 15', code: 'LAPTOP-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Laptop HP Pavilion 14', code: 'LAPTOP-002', unit: 'pcs', category: 'Elektronik' },
      { name: 'Laptop Asus ROG Strix', code: 'LAPTOP-003', unit: 'pcs', category: 'Elektronik' },
      { name: 'Mouse Wireless Logitech M280', code: 'MOUSE-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Mouse Gaming Razer DeathAdder', code: 'MOUSE-002', unit: 'pcs', category: 'Elektronik' },
      { name: 'Keyboard Mechanical Ducky One 2', code: 'KEYBOARD-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Keyboard Wireless Logitech K380', code: 'KEYBOARD-002', unit: 'pcs', category: 'Elektronik' },
      { name: 'Monitor LG Ultrafine 27', code: 'MONITOR-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Monitor Samsung Odyssey G7', code: 'MONITOR-002', unit: 'pcs', category: 'Elektronik' },
      { name: 'Printer Canon Pixma G3010', code: 'PRINTER-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Printer Epson EcoTank L3110', code: 'PRINTER-002', unit: 'pcs', category: 'Elektronik' },
      { name: 'Webcam Logitech C920', code: 'WEBCAM-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Headset Gaming HyperX Cloud II', code: 'HEADSET-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Speaker Bluetooth JBL Flip 5', code: 'SPEAKER-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Hard Drive External Seagate 1TB', code: 'HDD-001', unit: 'pcs', category: 'Elektronik' },

      // Alat Tulis
      { name: 'Kertas HVS A4 80gsm', code: 'PAPER-A4-01', unit: 'rim', category: 'Alat Tulis' },
      { name: 'Kertas Concord F4', code: 'PAPER-F4-01', unit: 'rim', category: 'Alat Tulis' },
      { name: 'Pulpen Pilot G-2 0.5', code: 'PEN-001', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Pulpen Faster C600', code: 'PEN-002', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Spidol Snowman Permanent', code: 'MARKER-001', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Buku Tulis Sinar Dunia 58 lembar', code: 'BOOK-001', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Buku Catatan Spiral A5', code: 'BOOK-002', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Stabilo Boss Original Kuning', code: 'HIGHLT-001', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Pensil Faber-Castell 2B', code: 'PENCIL-001', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Penghapus Joyko', code: 'ERASER-001', unit: 'pcs', category: 'Alat Tulis' },

      // Furniture
      { name: 'Meja Kantor Minimalis', code: 'DESK-001', unit: 'pcs', category: 'Furniture' },
      { name: 'Meja Komputer L-Shape', code: 'DESK-002', unit: 'pcs', category: 'Furniture' },
      { name: 'Kursi Kantor Ergonomis', code: 'CHAIR-001', unit: 'pcs', category: 'Furniture' },
      { name: 'Kursi Gaming Rexus', code: 'CHAIR-002', unit: 'pcs', category: 'Furniture' },
      { name: 'Lemari Arsip Besi', code: 'CABINET-001', unit: 'pcs', category: 'Furniture' },
      { name: 'Rak Buku Kayu 4 Susun', code: 'SHELF-001', unit: 'pcs', category: 'Furniture' },

      // Peralatan Rumah Tangga
      { name: 'Set Panci Stainless Steel', code: 'COOKWARE-001', unit: 'set', category: 'Peralatan Rumah Tangga' },
      { name: 'Blender Philips HR2115', code: 'BLENDER-001', unit: 'pcs', category: 'Peralatan Rumah Tangga' },
      { name: 'Set Pisau Dapur Lengkap', code: 'KNIFE-SET-001', unit: 'set', category: 'Peralatan Rumah Tangga' },
      { name: 'Rice Cooker Miyako', code: 'RICECOOK-001', unit: 'pcs', category: 'Peralatan Rumah Tangga' },
      { name: 'Setrika Philips', code: 'IRON-001', unit: 'pcs', category: 'Peralatan Rumah Tangga' }
    ]
  });
  console.log('✅ Products seeded.');

  // --- Seed Warehouses ---
  console.log('🌱 Seeding warehouses...');
  await prisma.warehouse.createMany({
    data: [
      { name: 'Gudang Pusat Jakarta', location: 'Jl. Sudirman No. 123, Jakarta Pusat' },
      { name: 'Gudang Surabaya Timur', location: 'Jl. Raya Laguna No. 456, Surabaya' },
      { name: 'Gudang Bandung Utara', location: 'Jl. Setiabudi No. 789, Bandung' },
      { name: 'Gudang Medan Amplas', location: 'Jl. Sisingamangaraja No. 321, Medan' },
      { name: 'Gudang Denpasar Barat', location: 'Jl. Imam Bonjol No. 10, Denpasar' },
      { name: 'Gudang Semarang Kota', location: 'Jl. Pemuda No. 88, Semarang' },
      { name: 'Gudang Makassar Selatan', location: 'Jl. Daeng Tata No. 55, Makassar' },
      { name: 'Gudang Yogyakarta Ring Road', location: 'Jl. Lingkar Utara No. 100, Yogyakarta' }
    ]
  });
  console.log('✅ Warehouses seeded.');

  const products = await prisma.product.findMany();
  const warehouses = await prisma.warehouse.findMany();

  const getProductId = (code) => products.find(p => p.code === code)?.id;
  const getWarehouseId = (name) => warehouses.find(w => w.name === name)?.id;

  // --- Seed Warehouse Products ---
  console.log('🌱 Seeding warehouse products...');
  await prisma.warehouseProduct.createMany({
    data: [
      // Gudang Pusat Jakarta
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('LAPTOP-001'), stok: 50, hargaBeli: 8000000, hargaJual: 10000000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('MOUSE-001'), stok: 100, hargaBeli: 150000, hargaJual: 200000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('KEYBOARD-001'), stok: 75, hargaBeli: 500000, hargaJual: 650000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('MONITOR-001'), stok: 30, hargaBeli: 2000000, hargaJual: 2500000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('PRINTER-001'), stok: 20, hargaBeli: 3000000, hargaJual: 3500000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('PAPER-A4-01'), stok: 200, hargaBeli: 45000, hargaJual: 60000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('PEN-001'), stok: 300, hargaBeli: 5000, hargaJual: 8000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('DESK-001'), stok: 10, hargaBeli: 1500000, hargaJual: 1800000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('CHAIR-001'), stok: 15, hargaBeli: 700000, hargaJual: 900000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('WEBCAM-001'), stok: 40, hargaBeli: 400000, hargaJual: 550000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('HDD-001'), stok: 25, hargaBeli: 750000, hargaJual: 950000 },

      // Gudang Surabaya Timur
      { warehouseId: getWarehouseId('Gudang Surabaya Timur'), productId: getProductId('LAPTOP-002'), stok: 30, hargaBeli: 7500000, hargaJual: 9500000 },
      { warehouseId: getWarehouseId('Gudang Surabaya Timur'), productId: getProductId('PAPER-F4-01'), stok: 150, hargaBeli: 55000, hargaJual: 70000 },
      { warehouseId: getWarehouseId('Gudang Surabaya Timur'), productId: getProductId('BOOK-001'), stok: 100, hargaBeli: 8000, hargaJual: 12000 },
      { warehouseId: getWarehouseId('Gudang Surabaya Timur'), productId: getProductId('MOUSE-002'), stok: 60, hargaBeli: 300000, hargaJual: 400000 },
      { warehouseId: getWarehouseId('Gudang Surabaya Timur'), productId: getProductId('SPEAKER-001'), stok: 35, hargaBeli: 600000, hargaJual: 800000 },
      { warehouseId: getWarehouseId('Gudang Surabaya Timur'), productId: getProductId('BLENDER-001'), stok: 20, hargaBeli: 450000, hargaJual: 600000 },

      // Gudang Bandung Utara
      { warehouseId: getWarehouseId('Gudang Bandung Utara'), productId: getProductId('MOUSE-001'), stok: 80, hargaBeli: 150000, hargaJual: 200000 },
      { warehouseId: getWarehouseId('Gudang Bandung Utara'), productId: getProductId('DESK-001'), stok: 15, hargaBeli: 1500000, hargaJual: 1800000 },
      { warehouseId: getWarehouseId('Gudang Bandung Utara'), productId: getProductId('KEYBOARD-002'), stok: 50, hargaBeli: 350000, hargaJual: 450000 },
      { warehouseId: getWarehouseId('Gudang Bandung Utara'), productId: getProductId('HIGHLT-001'), stok: 120, hargaBeli: 10000, hargaJual: 15000 },
      { warehouseId: getWarehouseId('Gudang Bandung Utara'), productId: getProductId('CHAIR-002'), stok: 10, hargaBeli: 2000000, hargaJual: 2500000 },
      { warehouseId: getWarehouseId('Gudang Bandung Utara'), productId: getProductId('RICECOOK-001'), stok: 25, hargaBeli: 300000, hargaJual: 400000 },

      // Gudang Medan Amplas
      { warehouseId: getWarehouseId('Gudang Medan Amplas'), productId: getProductId('BOOK-001'), stok: 90, hargaBeli: 8000, hargaJual: 12000 },
      { warehouseId: getWarehouseId('Gudang Medan Amplas'), productId: getProductId('PRINTER-002'), stok: 15, hargaBeli: 2500000, hargaJual: 3000000 },
      { warehouseId: getWarehouseId('Gudang Medan Amplas'), productId: getProductId('PENCIL-001'), stok: 200, hargaBeli: 2000, hargaJual: 3500 },
      { warehouseId: getWarehouseId('Gudang Medan Amplas'), productId: getProductId('LAPTOP-003'), stok: 18, hargaBeli: 12000000, hargaJual: 15000000 },
      { warehouseId: getWarehouseId('Gudang Medan Amplas'), productId: getProductId('KNIFE-SET-001'), stok: 12, hargaBeli: 250000, hargaJual: 350000 },

      // Gudang Denpasar Barat
      { warehouseId: getWarehouseId('Gudang Denpasar Barat'), productId: getProductId('MONITOR-002'), stok: 25, hargaBeli: 3500000, hargaJual: 4500000 },
      { warehouseId: getWarehouseId('Gudang Denpasar Barat'), productId: getProductId('HEADSET-001'), stok: 30, hargaBeli: 800000, hargaJual: 1100000 },
      { warehouseId: getWarehouseId('Gudang Denpasar Barat'), productId: getProductId('COOKWARE-001'), stok: 10, hargaBeli: 700000, hargaJual: 900000 },
      { warehouseId: getWarehouseId('Gudang Denpasar Barat'), productId: getProductId('ERASER-001'), stok: 150, hargaBeli: 1000, hargaJual: 2000 },

      // Gudang Semarang Kota
      { warehouseId: getWarehouseId('Gudang Semarang Kota'), productId: getProductId('LAPTOP-001'), stok: 25, hargaBeli: 8000000, hargaJual: 10000000 },
      { warehouseId: getWarehouseId('Gudang Semarang Kota'), productId: getProductId('PAPER-A4-01'), stok: 100, hargaBeli: 45000, hargaJual: 60000 },
      { warehouseId: getWarehouseId('Gudang Semarang Kota'), productId: getProductId('PEN-002'), stok: 180, hargaBeli: 4000, hargaJual: 6000 },
      { warehouseId: getWarehouseId('Gudang Semarang Kota'), productId: getProductId('SHELF-001'), stok: 8, hargaBeli: 900000, hargaJual: 1200000 },

      // Gudang Makassar Selatan
      { warehouseId: getWarehouseId('Gudang Makassar Selatan'), productId: getProductId('CHAIR-001'), stok: 20, hargaBeli: 700000, hargaJual: 900000 },
      { warehouseId: getWarehouseId('Gudang Makassar Selatan'), productId: getProductId('MONITOR-001'), stok: 15, hargaBeli: 2000000, hargaJual: 2500000 },
      { warehouseId: getWarehouseId('Gudang Makassar Selatan'), productId: getProductId('MARKER-001'), stok: 90, hargaBeli: 7000, hargaJual: 10000 },

      // Gudang Yogyakarta Ring Road
      { warehouseId: getWarehouseId('Gudang Yogyakarta Ring Road'), productId: getProductId('KEYBOARD-001'), stok: 40, hargaBeli: 500000, hargaJual: 650000 },
      { warehouseId: getWarehouseId('Gudang Yogyakarta Ring Road'), productId: getProductId('BOOK-002'), stok: 110, hargaBeli: 10000, hargaJual: 15000 },
      { warehouseId: getWarehouseId('Gudang Yogyakarta Ring Road'), productId: getProductId('CABINET-001'), stok: 7, hargaBeli: 1800000, hargaJual: 2200000 },
      { warehouseId: getWarehouseId('Gudang Yogyakarta Ring Road'), productId: getProductId('IRON-001'), stok: 20, hargaBeli: 200000, hargaJual: 280000 }
    ].filter(entry => entry.productId && entry.warehouseId) // Filter out entries where productId or warehouseId might be null due to typos
  });
  console.log('✅ Warehouse products seeded.');

  // --- Seed Transactions ---
  console.log('🌱 Seeding transactions...');
  await prisma.transaction.createMany({
    data: [
      // IN transactions
      { productId: getProductId('LAPTOP-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'IN', quantity: 10, note: 'Restok awal' },
      { productId: getProductId('MOUSE-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'IN', quantity: 20, note: 'Pengiriman dari supplier A' },
      { productId: getProductId('PAPER-A4-01'), warehouseId: getWarehouseId('Gudang Surabaya Timur'), type: 'IN', quantity: 50, note: 'Pembelian partai' },
      { productId: getProductId('DESK-001'), warehouseId: getWarehouseId('Gudang Bandung Utara'), type: 'IN', quantity: 5, note: 'Kedatangan batch baru' },
      { productId: getProductId('PRINTER-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'IN', quantity: 8, note: 'Stok tambahan promo' },
      { productId: getProductId('LAPTOP-002'), warehouseId: getWarehouseId('Gudang Surabaya Timur'), type: 'IN', quantity: 15, note: 'Restok reguler' },
      { productId: getProductId('BOOK-001'), warehouseId: getWarehouseId('Gudang Medan Amplas'), type: 'IN', quantity: 40, note: 'Pasokan buku sekolah' },
      { productId: getProductId('MONITOR-002'), warehouseId: getWarehouseId('Gudang Denpasar Barat'), type: 'IN', quantity: 10, note: 'Pembelian dari distributor' },
      { productId: getProductId('LAPTOP-001'), warehouseId: getWarehouseId('Gudang Semarang Kota'), type: 'IN', quantity: 5, note: 'Restok khusus' },
      { productId: getProductId('CHAIR-001'), warehouseId: getWarehouseId('Gudang Makassar Selatan'), type: 'IN', quantity: 10, note: 'Pembelian grosir' },
      { productId: getProductId('KEYBOARD-001'), warehouseId: getWarehouseId('Gudang Yogyakarta Ring Road'), type: 'IN', quantity: 15, note: 'Stok awal' },
      { productId: getProductId('HEADSET-001'), warehouseId: getWarehouseId('Gudang Denpasar Barat'), type: 'IN', quantity: 10, note: 'Pengadaan barang' },
      { productId: getProductId('BLENDER-001'), warehouseId: getWarehouseId('Gudang Surabaya Timur'), type: 'IN', quantity: 5, note: 'Stok baru' },
      { productId: getProductId('RICECOOK-001'), warehouseId: getWarehouseId('Gudang Bandung Utara'), type: 'IN', quantity: 8, note: 'Pengadaan barang dapur' },
      { productId: getProductId('PENCIL-001'), warehouseId: getWarehouseId('Gudang Medan Amplas'), type: 'IN', quantity: 50, note: 'Restok alat tulis' },

      // OUT transactions
      { productId: getProductId('LAPTOP-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'OUT', quantity: 2, note: 'Penjualan ke PT. ABC' },
      { productId: getProductId('MOUSE-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'OUT', quantity: 5, note: 'Penjualan online' },
      { productId: getProductId('PAPER-A4-01'), warehouseId: getWarehouseId('Gudang Surabaya Timur'), type: 'OUT', quantity: 10, note: 'Penggunaan internal kantor' },
      { productId: getProductId('BOOK-001'), warehouseId: getWarehouseId('Gudang Medan Amplas'), type: 'OUT', quantity: 5, note: 'Pengembalian barang rusak' },
      { productId: getProductId('PRINTER-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'OUT', quantity: 1, note: 'Demo produk' },
      { productId: getProductId('LAPTOP-002'), warehouseId: getWarehouseId('Gudang Surabaya Timur'), type: 'OUT', quantity: 3, note: 'Penjualan ke toko cabang' },
      { productId: getProductId('MONITOR-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'OUT', quantity: 2, note: 'Penjualan via marketplace' },
      { productId: getProductId('DESK-001'), warehouseId: getWarehouseId('Gudang Bandung Utara'), type: 'OUT', quantity: 1, note: 'Penjualan ke pelanggan langsung' },
      { productId: getProductId('CHAIR-001'), warehouseId: getWarehouseId('Gudang Makassar Selatan'), type: 'OUT', quantity: 3, note: 'Penjualan ke perusahaan' },
      { productId: getProductId('WEBCAM-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'OUT', quantity: 4, note: 'Retur ke supplier' }, // Example of an OUT that isn't a sale
      { productId: getProductId('COOKWARE-001'), warehouseId: getWarehouseId('Gudang Denpasar Barat'), type: 'OUT', quantity: 2, note: 'Penjualan grosir' },
      { productId: getProductId('IRON-001'), warehouseId: getWarehouseId('Gudang Yogyakarta Ring Road'), type: 'OUT', quantity: 3, note: 'Pengiriman ke reseller' },
      { productId: getProductId('KEYBOARD-002'), warehouseId: getWarehouseId('Gudang Bandung Utara'), type: 'OUT', quantity: 7, note: 'Penjualan e-commerce' },
      { productId: getProductId('HDD-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'OUT', quantity: 2, note: 'Pemesanan khusus' },

      // TRANSFER transactions
      {
        productId: getProductId('MOUSE-001'),
        warehouseId: getWarehouseId('Gudang Bandung Utara'),
        type: 'TRANSFER',
        quantity: 10,
        note: 'Transfer ke Gudang Surabaya Timur',
        sourceWarehouseId: getWarehouseId('Gudang Bandung Utara'),
        targetWarehouseId: getWarehouseId('Gudang Surabaya Timur')
      },
      {
        productId: getProductId('LAPTOP-001'),
        warehouseId: getWarehouseId('Gudang Pusat Jakarta'),
        type: 'TRANSFER',
        quantity: 5,
        note: 'Transfer ke Gudang Semarang Kota',
        sourceWarehouseId: getWarehouseId('Gudang Pusat Jakarta'),
        targetWarehouseId: getWarehouseId('Gudang Semarang Kota')
      },
      {
        productId: getProductId('PAPER-A4-01'),
        warehouseId: getWarehouseId('Gudang Surabaya Timur'),
        type: 'TRANSFER',
        quantity: 20,
        note: 'Transfer ke Gudang Denpasar Barat',
        sourceWarehouseId: getWarehouseId('Gudang Surabaya Timur'),
        targetWarehouseId: getWarehouseId('Gudang Denpasar Barat')
      },
      {
        productId: getProductId('CHAIR-001'),
        warehouseId: getWarehouseId('Gudang Pusat Jakarta'),
        type: 'TRANSFER',
        quantity: 3,
        note: 'Transfer ke Gudang Makassar Selatan',
        sourceWarehouseId: getWarehouseId('Gudang Pusat Jakarta'),
        targetWarehouseId: getWarehouseId('Gudang Makassar Selatan')
      },
      {
        productId: getProductId('KEYBOARD-001'),
        warehouseId: getWarehouseId('Gudang Yogyakarta Ring Road'),
        type: 'TRANSFER',
        quantity: 8,
        note: 'Transfer ke Gudang Bandung Utara',
        sourceWarehouseId: getWarehouseId('Gudang Yogyakarta Ring Road'),
        targetWarehouseId: getWarehouseId('Gudang Bandung Utara')
      },
      {
        productId: getProductId('MONITOR-001'),
        warehouseId: getWarehouseId('Gudang Semarang Kota'),
        type: 'TRANSFER',
        quantity: 2,
        note: 'Transfer ke Gudang Pusat Jakarta',
        sourceWarehouseId: getWarehouseId('Gudang Semarang Kota'),
        targetWarehouseId: getWarehouseId('Gudang Pusat Jakarta')
      },
      {
        productId: getProductId('BOOK-001'),
        warehouseId: getWarehouseId('Gudang Medan Amplas'),
        type: 'TRANSFER',
        quantity: 15,
        note: 'Transfer ke Gudang Surabaya Timur',
        sourceWarehouseId: getWarehouseId('Gudang Medan Amplas'),
        targetWarehouseId: getWarehouseId('Gudang Surabaya Timur')
      }
    ].filter(entry => entry.productId && entry.warehouseId) // Filter out entries with potential null IDs
  });
  console.log('✅ Transactions seeded.');

  console.log('🎉 Sukses men-seed database!');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });