"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  code: string
}

interface DeleteProductDialogProps {
  open: boolean
  onClose: () => void
  product?: Product | null
}

export function DeleteProductDialog({ open, onClose, product }: DeleteProductDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!product) return

    setLoading(true)
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Produk berhasil dihapus")
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal menghapus produk")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Terjadi kesalahan saat menghapus produk")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus Produk</AlertDialogTitle>
          <AlertDialogDescription>
            Anda yakin ingin menghapus produk <strong>{product?.name}</strong> dengan kode{" "}
            <strong>{product?.code}</strong>?
            <br />
            <br />
            Aksi ini tidak dapat dibatalkan dan akan menghapus semua data inventaris terkait produk ini di gudang
            manapun.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
