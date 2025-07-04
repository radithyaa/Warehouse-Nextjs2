"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { WarehouseSelector } from "@/components/inventory/warehouse-selector"
import { InventoryActions } from "@/components/inventory/inventory-actions"
import { StockDialog } from "@/components/inventory/stock-dialog"
import { TransferDialog } from "@/components/inventory/transfer-dialog"
import { AddProductDialog } from "@/components/inventory/add-product-dialog"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { toast } from "sonner"

interface InventoryItem {
  id: string
  product: {
    id: string
    name: string
    sku: string
    category: string
  }
  quantity: number
  buyPrice: number | null
  sellPrice: number | null
}

interface Warehouse {
  id: string
  name: string
  location: string
}

export default function InventoryPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("")
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stockDialog, setStockDialog] = useState<{
    open: boolean
    type: "add" | "reduce"
    item: InventoryItem | null
  }>({
    open: false,
    type: "add",
    item: null,
  })
  const [transferDialog, setTransferDialog] = useState<{
    open: boolean
    item: InventoryItem | null
  }>({
    open: false,
    item: null,
  })

  useEffect(() => {
    fetchWarehouses()
  }, [])

  useEffect(() => {
    if (selectedWarehouse) {
      fetchInventory()
    }
  }, [selectedWarehouse])

  const fetchWarehouses = async () => {
    try {
      const response = await fetch("/api/warehouses")
      if (response.ok) {
        const data = await response.json()
        setWarehouses(data)
        if (data.length > 0) {
          setSelectedWarehouse(data[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error)
      toast.error("Gagal memuat daftar gudang")
    }
  }

  const fetchInventory = async () => {
    if (!selectedWarehouse) return

    setLoading(true)
    try {
      const response = await fetch(`/api/inventory?warehouseId=${selectedWarehouse}`)
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
      toast.error("Gagal memuat data inventaris")
    } finally {
      setLoading(false)
    }
  }

  const handleStockAction = (type: "add" | "reduce", item: InventoryItem) => {
    setStockDialog({
      open: true,
      type,
      item,
    })
  }

  const handleTransferAction = (item: InventoryItem) => {
    setTransferDialog({
      open: true,
      item,
    })
  }

  const handleDialogSuccess = () => {
    fetchInventory()
    setStockDialog({ open: false, type: "add", item: null })
    setTransferDialog({ open: false, item: null })
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Habis</Badge>
    } else if (quantity < 10) {
      return <Badge variant="secondary">Rendah</Badge>
    } else {
      return <Badge variant="default">Normal</Badge>
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const selectedWarehouseName = warehouses.find((w) => w.id === selectedWarehouse)?.name || ""

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Inventaris Gudang</h1>
        <p className="text-gray-600 dark:text-gray-400">Kelola stok produk di setiap gudang</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Stok Produk</CardTitle>
              <CardDescription>{selectedWarehouseName && `Inventaris untuk ${selectedWarehouseName}`}</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <WarehouseSelector
                warehouses={warehouses}
                selectedWarehouse={selectedWarehouse}
                onWarehouseChange={setSelectedWarehouse}
              />
              {selectedWarehouse && <AddProductDialog warehouseId={selectedWarehouse} onSuccess={fetchInventory} />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton rows={5} columns={6} />}>
            {loading ? (
              <TableSkeleton rows={5} columns={6} />
            ) : inventory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Belum ada produk di gudang ini</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Harga Beli</TableHead>
                      <TableHead>Harga Jual</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>{item.product.sku}</TableCell>
                        <TableCell>{item.product.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{getStockStatus(item.quantity)}</TableCell>
                        <TableCell>{formatCurrency(item.buyPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.sellPrice)}</TableCell>
                        <TableCell>
                          <InventoryActions
                            onAddStock={() => handleStockAction("add", item)}
                            onReduceStock={() => handleStockAction("reduce", item)}
                            onTransferStock={() => handleTransferAction(item)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Suspense>
        </CardContent>
      </Card>

      {/* Stock Dialog */}
      <StockDialog
        open={stockDialog.open}
        onOpenChange={(open) => setStockDialog({ ...stockDialog, open })}
        type={stockDialog.type}
        item={stockDialog.item}
        onSuccess={handleDialogSuccess}
      />

      {/* Transfer Dialog */}
      <TransferDialog
        open={transferDialog.open}
        onOpenChange={(open) => setTransferDialog({ ...transferDialog, open })}
        item={transferDialog.item}
        warehouses={warehouses.filter((w) => w.id !== selectedWarehouse)}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
