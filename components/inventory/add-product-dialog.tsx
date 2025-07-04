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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  code: string
  unit: string | null
}

interface AddProductDialogProps {
  warehouseId: number
  availableProducts: Product[]
  onSuccess: () => void
}

export function AddProductDialog({ warehouseId, availableProducts, onSuccess }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [stok, setStok] = useState("")
  const [hargaBeli, setHargaBeli] = useState("")
  const [hargaJual, setHargaJual] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProductId || !stok) {
      toast.error("Produk dan stok harus diisi")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/inventory/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: Number.parseInt(selectedProductId),
          warehouseId,
          quantity: Number.parseInt(stok),
          type: "IN",
          hargaBeli: hargaBeli ? Number.parseFloat(hargaBeli) : null,
          hargaJual: hargaJual ? Number.parseFloat(hargaJual) : null,
          keterangan: "Penambahan produk baru ke gudang",
        }),
      })

      if (response.ok) {
        toast.success("Produk berhasil ditambahkan ke gudang")
        setOpen(false)
        setSelectedProductId("")
        setStok("")
        setHargaBeli("")
        setHargaJual("")
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal menambahkan produk")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Terjadi kesalahan saat menambahkan produk")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk ke Gudang Ini
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Produk ke Gudang</DialogTitle>
          <DialogDescription>
            Pilih produk yang ingin ditambahkan ke gudang ini dan tentukan stok awal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produk</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih produk..." />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name} ({product.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stok">Stok Awal</Label>
            <Input
              id="stok"
              type="number"
              min="1"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              placeholder="Masukkan jumlah stok..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hargaBeli">Harga Beli (Opsional)</Label>
            <Input
              id="hargaBeli"
              type="number"
              min="0"
              step="0.01"
              value={hargaBeli}
              onChange={(e) => setHargaBeli(e.target.value)}
              placeholder="Masukkan harga beli..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hargaJual">Harga Jual (Opsional)</Label>
            <Input
              id="hargaJual"
              type="number"
              min="0"
              step="0.01"
              value={hargaJual}
              onChange={(e) => setHargaJual(e.target.value)}
              placeholder="Masukkan harga jual..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menambahkan..." : "Tambah Produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
