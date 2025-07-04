import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { InventoryActions } from "@/components/inventory/inventory-actions"
import { WarehouseSelector } from "@/components/inventory/warehouse-selector"

async function getWarehouses() {
  return await prisma.warehouse.findMany({
    orderBy: { name: "asc" },
  })
}

async function getInventoryByWarehouse(warehouseId?: number) {
  if (!warehouseId) return []

  return await prisma.warehouseProduct.findMany({
    where: { warehouseId },
    include: {
      product: true,
      warehouse: true,
    },
    orderBy: {
      product: { name: "asc" },
    },
  })
}

interface InventoryPageProps {
  searchParams: { warehouse?: string }
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const warehouses = await getWarehouses()
  const selectedWarehouseId = searchParams.warehouse ? Number.parseInt(searchParams.warehouse) : warehouses[0]?.id
  const inventory = await getInventoryByWarehouse(selectedWarehouseId)
  const selectedWarehouse = warehouses.find((w) => w.id === selectedWarehouseId)

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="container mx-auto p-6">

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stok Produk</CardTitle>
              <CardDescription>
                {selectedWarehouse
                  ? `Inventaris di ${selectedWarehouse.name}`
                  : "Pilih gudang untuk melihat inventaris"}
              </CardDescription>
            </div>
            <WarehouseSelector warehouses={warehouses} selectedId={selectedWarehouseId} />
          </div>
        </CardHeader>
        <CardContent>
          {!selectedWarehouse ? (
            <div className="text-center py-8 text-muted-foreground">Pilih gudang untuk melihat inventaris</div>
          ) : inventory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Belum ada produk di gudang ini</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kode Produk</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Stok</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={`${item.warehouseId}-${item.productId}`}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell>{item.product.code}</TableCell>
                      <TableCell>{item.product.unit || "-"}</TableCell>
                      <TableCell className="text-right font-medium">{item.stok}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.hargaBeli)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.hargaJual)}</TableCell>
                      <TableCell className="text-right">
                        <InventoryActions item={item} warehouses={warehouses} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
