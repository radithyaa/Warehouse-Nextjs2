"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface InventoryItem {
  warehouseId: number
  productId: number
  stok: number
  product: {
    id: number
    name: string
    code: string
    unit: string | null
  }
  warehouse: {
    id: number
    name: string
  }
}

interface Warehouse {
  id: number
  name: string
  location: string
}

interface TransferDialogProps {
  children: React.ReactNode
  item: InventoryItem
  warehouses: Warehouse[]
}

export function TransferDialog({ children, item, warehouses }: TransferDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    targetWarehouseId: "",
    quantity: "",
    note: "",
  })

  const availableWarehouses = warehouses.filter((w) => w.id !== item.warehouseId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const quantity = Number.parseInt(formData.quantity)

      if (quantity > item.stok) {
        throw new Error("Jumlah yang ditransfer tidak boleh melebihi stok yang tersedia")
      }

      const response = await fetch("/api/inventory/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.productId,
          sourceWarehouseId: item.warehouseId,
          targetWarehouseId: Number.parseInt(formData.targetWarehouseId),
          quantity,
          note: formData.note || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan")
      }

      toast.success("Stok berhasil ditransfer")
      setOpen(false)
      router.refresh()
      setFormData({ targetWarehouseId: "", quantity: "", note: "" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Stok {item.product.name}</DialogTitle>
          <DialogDescription>
            Dari: {item.warehouse.name} | Stok tersedia: {item.stok} {item.product.unit || "pcs"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="targetWarehouse">Gudang Tujuan *</Label>
              <Select
                value={formData.targetWarehouseId}
                onValueChange={(value) => setFormData({ ...formData, targetWarehouseId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih gudang tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {availableWarehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Jumlah *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={item.stok}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note">Catatan</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Catatan transfer..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading || !formData.targetWarehouseId}>
              {loading ? "Mentransfer..." : "Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
