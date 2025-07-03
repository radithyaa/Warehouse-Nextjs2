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
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface InventoryItem {
  warehouseId: number
  productId: number
  stok: number
  hargaBeli: number | null
  hargaJual: number | null
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

interface StockDialogProps {
  children: React.ReactNode
  type: "add" | "reduce"
  item: InventoryItem
}

export function StockDialog({ children, type, item }: StockDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    quantity: "",
    hargaBeli: item.hargaBeli?.toString() || "",
    hargaJual: item.hargaJual?.toString() || "",
    note: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const quantity = Number.parseInt(formData.quantity)

      if (type === "reduce" && quantity > item.stok) {
        throw new Error("Jumlah yang dikurangi tidak boleh melebihi stok yang tersedia")
      }

      const response = await fetch("/api/inventory/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          warehouseId: item.warehouseId,
          productId: item.productId,
          type: type === "add" ? "IN" : "OUT",
          quantity,
          hargaBeli: formData.hargaBeli ? Number.parseInt(formData.hargaBeli) : null,
          hargaJual: formData.hargaJual ? Number.parseInt(formData.hargaJual) : null,
          note: formData.note || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan")
      }

      toast.success(type === "add" ? "Stok berhasil ditambahkan" : "Stok berhasil dikurangi")
      setOpen(false)
      router.refresh()
      setFormData({ quantity: "", hargaBeli: "", hargaJual: "", note: "" })
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
          <DialogTitle>
            {type === "add" ? "Tambah Stok" : "Kurangi Stok"} untuk {item.product.name}
          </DialogTitle>
          <DialogDescription>
            Gudang: {item.warehouse.name} | Stok saat ini: {item.stok} {item.product.unit || "pcs"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Jumlah *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            {type === "add" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="hargaBeli">Harga Beli (Rp)</Label>
                  <Input
                    id="hargaBeli"
                    type="number"
                    min="0"
                    value={formData.hargaBeli}
                    onChange={(e) => setFormData({ ...formData, hargaBeli: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hargaJual">Harga Jual (Rp)</Label>
                  <Input
                    id="hargaJual"
                    type="number"
                    min="0"
                    value={formData.hargaJual}
                    onChange={(e) => setFormData({ ...formData, hargaJual: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="note">Catatan</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder={type === "add" ? "Catatan tambahan..." : "Alasan pengurangan stok..."}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Memproses..." : type === "add" ? "Tambah Stok" : "Kurangi Stok"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
