import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { InventoryActions } from "@/components/inventory/inventory-actions"

async function getWarehouseWithInventory(id: number) {
  const warehouse = await prisma.warehouse.findUnique({
    where: { id },
    include: {
      warehouseProducts: {
        include: {
          product: true,
        },
        orderBy: {
          product: { name: "asc" },
        },
      },
    },
  })

  if (!warehouse) {
    notFound()
  }

  return warehouse
}

async function getAllWarehouses() {
  return await prisma.warehouse.findMany({
    orderBy: { name: "asc" },
  })
}

interface WarehouseDetailPageProps {
  params: { id: string }
}

export default async function WarehouseDetailPage({ params }: WarehouseDetailPageProps) {
  const warehouseId = Number.parseInt(params.id)
  const [warehouse, allWarehouses] = await Promise.all([getWarehouseWithInventory(warehouseId), getAllWarehouses()])

  const totalItems = warehouse.warehouseProducts.reduce((sum, wp) => sum + wp.stok, 0)

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
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/warehouses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Gudang
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{warehouse.name}</h1>
            <p className="text-muted-foreground">{warehouse.location}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalItems}</div>
            <div className="text-sm text-muted-foreground">Total Item</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventaris Gudang</CardTitle>
          <CardDescription>{warehouse.warehouseProducts.length} jenis produk tersimpan di gudang ini</CardDescription>
        </CardHeader>
        <CardContent>
          {warehouse.warehouseProducts.length === 0 ? (
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
                  {warehouse.warehouseProducts.map((wp) => {
                    const item = {
                      warehouseId: wp.warehouseId,
                      productId: wp.productId,
                      stok: wp.stok,
                      hargaBeli: wp.hargaBeli,
                      hargaJual: wp.hargaJual,
                      product: wp.product,
                      warehouse: warehouse,
                    }

                    return (
                      <TableRow key={wp.productId}>
                        <TableCell className="font-medium">
                          <Link href={`/products/${wp.productId}`} className="hover:underline">
                            {wp.product.name}
                          </Link>
                        </TableCell>
                        <TableCell>{wp.product.code}</TableCell>
                        <TableCell>{wp.product.unit || "-"}</TableCell>
                        <TableCell className="text-right font-medium">{wp.stok}</TableCell>
                        <TableCell className="text-right">{formatCurrency(wp.hargaBeli)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(wp.hargaJual)}</TableCell>
                        <TableCell className="text-right flex justify-end items-end">
                          <InventoryActions item={item} warehouses={allWarehouses} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
