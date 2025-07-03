"use client"

import type React from "react"

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  code: string
}

interface DeleteProductDialogProps {
  children: React.ReactNode
  product: Product
}

export function DeleteProductDialog({ children, product }: DeleteProductDialogProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan")
      }

      toast.success("Produk berhasil dihapus")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus Produk</AlertDialogTitle>
          <AlertDialogDescription>
            Anda yakin ingin menghapus produk <strong>"{product.name}"</strong>? Aksi ini tidak dapat dibatalkan dan
            akan menghapus semua data inventaris terkait produk ini di gudang manapun.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
