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

interface Warehouse {
  id: number
  name: string
  location: string
}

interface DeleteWarehouseDialogProps {
  children: React.ReactNode
  warehouse: Warehouse
}

export function DeleteWarehouseDialog({ children, warehouse }: DeleteWarehouseDialogProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/warehouses/${warehouse.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan")
      }

      toast.success("Gudang berhasil dihapus")
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
          <AlertDialogTitle>Konfirmasi Hapus Gudang</AlertDialogTitle>
          <AlertDialogDescription>
            Anda yakin ingin menghapus gudang <strong>"{warehouse.name}"</strong>? Aksi ini tidak dapat dibatalkan dan
            akan menghapus semua data inventaris terkait gudang ini.
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
