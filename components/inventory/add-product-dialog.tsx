"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  id: string
  name: string
  sku: string
}

interface AddProductDialogProps {
  warehouseId: string
  onSuccess: () => void
}

export function AddProductDialog({ warehouseId, onSuccess }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [buyPrice, setBuyPrice] = useState("")
  const [sellPrice, setSellPrice] = useState("")

  useEffect(() => {
    if (open) {
      fetchAvailableProducts()
    }
  }, [open, warehouseId])

  const fetchAvailableProducts = async () => {
    try {
      const response = await fetch(`/api/products/available?warehouseId=${warehouseId}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Gagal memuat daftar produk")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !quantity) {
      toast.error("Mohon lengkapi semua field yang wajib")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/inventory/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          warehouseId,
          productId: selectedProduct,
          quantity: Number.parseInt(quantity),
          buyPrice: buyPrice ? Number.parseFloat(buyPrice) : null,
          sellPrice: sellPrice ? Number.parseFloat(sellPrice) : null,
        }),
      })

      if (response.ok) {
        toast.success("Produk berhasil ditambahkan ke gudang")
        setOpen(false)
        resetForm()
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

  const resetForm = () => {
    setSelectedProduct("")
    setQuantity("")
    setBuyPrice("")
    setSellPrice("")
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
            <Label htmlFor="product">Produk *</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih produk..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Stok Awal *</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Masukkan jumlah stok awal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyPrice">Harga Beli (Opsional)</Label>
            <Input
              id="buyPrice"
              type="number"
              min="0"
              step="0.01"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="Masukkan harga beli"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellPrice">Harga Jual (Opsional)</Label>
            <Input
              id="sellPrice"
              type="number"
              min="0"
              step="0.01"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="Masukkan harga jual"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
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
