"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface Warehouse {
  id: number
  name: string
  location: string
}

interface WarehouseSelectorProps {
  warehouses: Warehouse[]
  selectedId?: number
}

export function WarehouseSelector({ warehouses, selectedId }: WarehouseSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleWarehouseChange = (warehouseId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("warehouse", warehouseId)
    router.push(`/inventory?${params.toString()}`)
  }

  return (
    <Select value={selectedId?.toString()} onValueChange={handleWarehouseChange}>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Pilih gudang" />
      </SelectTrigger>
      <SelectContent>
        {warehouses.map((warehouse) => (
          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
            {warehouse.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
