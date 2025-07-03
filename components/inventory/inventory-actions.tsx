"use client"

import { Button } from "@/components/ui/button"
import { Plus, Minus, ArrowRightLeft } from "lucide-react"
import { StockDialog } from "./stock-dialog"
import { TransferDialog } from "./transfer-dialog"

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

interface Warehouse {
  id: number
  name: string
  location: string
}

interface InventoryActionsProps {
  item: InventoryItem
  warehouses: Warehouse[]
}

export function InventoryActions({ item, warehouses }: InventoryActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <StockDialog type="add" item={item}>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Tambah
        </Button>
      </StockDialog>

      <StockDialog type="reduce" item={item}>
        <Button variant="outline" size="sm">
          <Minus className="h-4 w-4 mr-1" />
          Kurangi
        </Button>
      </StockDialog>

      <TransferDialog item={item} warehouses={warehouses}>
        <Button variant="outline" size="sm">
          <ArrowRightLeft className="h-4 w-4 mr-1" />
          Transfer
        </Button>
      </TransferDialog>
    </div>
  )
}
