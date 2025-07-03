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

interface Warehouse {
  id: number
  name: string
  location: string
}

interface WarehouseDialogProps {
  children: React.ReactNode
  warehouse?: Warehouse
}

export function WarehouseDialog({ children, warehouse }: WarehouseDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: warehouse?.name || "",
    location: warehouse?.location || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = warehouse ? `/api/warehouses/${warehouse.id}` : "/api/warehouses"
      const method = warehouse ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan")
      }

      toast.success(warehouse ? "Gudang berhasil diperbarui" : "Gudang berhasil ditambahkan")
      setOpen(false)
      router.refresh()

      if (!warehouse) {
        setFormData({ name: "", location: "" })
      }
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
          <DialogTitle>{warehouse ? "Edit Gudang" : "Tambah Gudang Baru"}</DialogTitle>
          <DialogDescription>
            {warehouse ? "Perbarui informasi gudang di bawah ini." : "Masukkan informasi gudang baru di bawah ini."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Gudang *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi *</Label>
              <Textarea
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="Alamat lengkap gudang"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
