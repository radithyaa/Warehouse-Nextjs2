"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <StockDialog type="add" item={item}>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <Plus className="h-4 w-4" />
              </Button>
            </StockDialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tambah Stok</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <StockDialog type="reduce" item={item}>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <Minus className="h-4 w-4" />
              </Button>
            </StockDialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Kurangi Stok</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TransferDialog item={item} warehouses={warehouses}>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </TransferDialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Transfer Stok</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
