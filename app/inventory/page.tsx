"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { WarehouseSelector } from "@/components/inventory/warehouse-selector"
import { InventoryActions } from "@/components/inventory/inventory-actions"
import { AddProductDialog } from "@/components/inventory/add-product-dialog"
import { TableSkeleton } from "@/components/ui/table-skeleton"

interface WarehouseProduct {
  id: string
  quantity: number
  buyPrice: number | null
  sellPrice: number | null
  product: {
    id: string
    name: string
    sku: string
    category: string
  }
}

function InventoryContent() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("")
  const [inventory, setInventory] = useState<WarehouseProduct[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedWarehouse) {
      fetchInventory()
    }
  }, [selectedWarehouse])

  const fetchInventory = async () => {
    if (!selectedWarehouse) return

    setLoading(true)
    try {
      const response = await fetch(`/api/warehouses/${selectedWarehouse}/inventory`)
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Habis", variant: "destructive" as const }
    if (quantity < 10) return { label: "Rendah", variant: "secondary" as const }
    return { label: "Tersedia", variant: "default" as const }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventaris Gudang</h1>
        <p className="text-gray-600 dark:text-gray-400">Kelola stok produk di setiap gudang</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilih Gudang</CardTitle>
          <CardDescription>Pilih gudang untuk melihat dan mengelola inventaris</CardDescription>
        </CardHeader>
        <CardContent>
          <WarehouseSelector selectedWarehouse={selectedWarehouse} onWarehouseChange={setSelectedWarehouse} />
        </CardContent>
      </Card>

      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventaris</CardTitle>
                <CardDescription>Daftar produk dan stok di gudang yang dipilih</CardDescription>
              </div>
              <AddProductDialog warehouseId={selectedWarehouse} onSuccess={fetchInventory} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton rows={5} columns={6} />
            ) : inventory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Tidak ada produk di gudang ini</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Harga Beli</TableHead>
                    <TableHead>Harga Jual</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const stockStatus = getStockStatus(item.quantity)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.product.sku}</TableCell>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>{item.product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{item.quantity}</span>
                            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(item.buyPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.sellPrice)}</TableCell>
                        <TableCell>
                          <InventoryActions
                            warehouseProductId={item.id}
                            productName={item.product.name}
                            currentStock={item.quantity}
                            onStockUpdate={fetchInventory}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={10} columns={6} />}>
      <InventoryContent />
    </Suspense>
  )
}
