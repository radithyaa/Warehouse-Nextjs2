const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Truncate semua data (optional, jika ingin clear database dulu)
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "transactions",
      "warehouse_products",
      "products",
      "warehouses"
    RESTART IDENTITY CASCADE;
  `);

  // Seed Products
  await prisma.product.createMany({
    data: [
      { name: 'Laptop Dell Inspiron', code: 'LAPTOP-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Mouse Wireless', code: 'MOUSE-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Keyboard Mechanical', code: 'KEYBOARD-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Monitor 24 inch', code: 'MONITOR-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Printer Canon', code: 'PRINTER-001', unit: 'pcs', category: 'Elektronik' },
      { name: 'Kertas A4', code: 'PAPER-A4', unit: 'rim', category: 'Alat Tulis' },
      { name: 'Pulpen Pilot', code: 'PEN-001', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Buku Tulis', code: 'BOOK-001', unit: 'pcs', category: 'Alat Tulis' },
      { name: 'Meja Kantor', code: 'DESK-001', unit: 'pcs', category: 'Furniture' },
      { name: 'Kursi Kantor', code: 'CHAIR-001', unit: 'pcs', category: 'Furniture' }
    ]
  });

  // Seed Warehouses
  await prisma.warehouse.createMany({
    data: [
      { name: 'Gudang Pusat Jakarta', location: 'Jl. Sudirman No. 123, Jakarta Pusat' },
      { name: 'Gudang Surabaya', location: 'Jl. Basuki Rahmat No. 456, Surabaya' },
      { name: 'Gudang Bandung', location: 'Jl. Asia Afrika No. 789, Bandung' },
      { name: 'Gudang Medan', location: 'Jl. Gatot Subroto No. 321, Medan' }
    ]
  });

  const products = await prisma.product.findMany();
  const warehouses = await prisma.warehouse.findMany();

  const getProductId = (code) => products.find(p => p.code === code).id;
  const getWarehouseId = (name) => warehouses.find(w => w.name === name).id;

  // Seed Warehouse Products
  await prisma.warehouseProduct.createMany({
    data: [
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('LAPTOP-001'), stok: 50, hargaBeli: 8000000, hargaJual: 10000000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('MOUSE-001'), stok: 100, hargaBeli: 150000, hargaJual: 200000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('KEYBOARD-001'), stok: 75, hargaBeli: 500000, hargaJual: 650000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('MONITOR-001'), stok: 30, hargaBeli: 2000000, hargaJual: 2500000 },
      { warehouseId: getWarehouseId('Gudang Pusat Jakarta'), productId: getProductId('PRINTER-001'), stok: 20, hargaBeli: 3000000, hargaJual: 3500000 },
      { warehouseId: getWarehouseId('Gudang Surabaya'), productId: getProductId('LAPTOP-001'), stok: 20, hargaBeli: 8000000, hargaJual: 10000000 },
      { warehouseId: getWarehouseId('Gudang Surabaya'), productId: getProductId('PAPER-A4'), stok: 120, hargaBeli: 50000, hargaJual: 65000 },
      { warehouseId: getWarehouseId('Gudang Bandung'), productId: getProductId('MOUSE-001'), stok: 80, hargaBeli: 150000, hargaJual: 200000 },
      { warehouseId: getWarehouseId('Gudang Bandung'), productId: getProductId('DESK-001'), stok: 15, hargaBeli: 1500000, hargaJual: 1800000 },
      { warehouseId: getWarehouseId('Gudang Medan'), productId: getProductId('BOOK-001'), stok: 90, hargaBeli: 8000, hargaJual: 12000 }
    ]
  });

  // Seed Transactions
  await prisma.transaction.createMany({
    data: [
      { productId: getProductId('LAPTOP-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'IN', quantity: 10, note: 'Restok awal' },
      { productId: getProductId('LAPTOP-001'), warehouseId: getWarehouseId('Gudang Pusat Jakarta'), type: 'OUT', quantity: 2, note: 'Pengambilan untuk demo' },
      { productId: getProductId('PAPER-A4'), warehouseId: getWarehouseId('Gudang Surabaya'), type: 'IN', quantity: 50, note: 'Tambah stok A4' },
      { productId: getProductId('BOOK-001'), warehouseId: getWarehouseId('Gudang Medan'), type: 'OUT', quantity: 5, note: 'Penyesuaian stok' },
      {
        productId: getProductId('MOUSE-001'),
        warehouseId: getWarehouseId('Gudang Bandung'),
        type: 'TRANSFER',
        quantity: 10,
        note: 'Transfer ke Gudang Surabaya',
        sourceWarehouseId: getWarehouseId('Gudang Bandung'),
        targetWarehouseId: getWarehouseId('Gudang Surabaya')
      }
    ]
  });

  console.log('✅ Sukses men-seed database!');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
