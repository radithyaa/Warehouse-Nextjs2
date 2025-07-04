"use client"

import { Button } from "@/components/ui/button"
import { Plus, Minus, ArrowRightLeft, MoreHorizontal } from "lucide-react"
import { StockDialog } from "./stock-dialog"
import { TransferDialog } from "./transfer-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

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
    <div className="flex items-end justify-end gap-2">
      <DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="ghost" className="size-10" size="sm">
      <MoreHorizontal className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-48" align="end">
      <DropdownMenuItem asChild >
        <StockDialog type="add" item={item} >
          <Button className="text-sm px-2 font-normal w-full h-full flex justify-between" variant={"ghost"}>Tambah Produk</Button>
        </StockDialog>
      </DropdownMenuItem>
      <DropdownMenuItem asChild >
        <StockDialog type="reduce" item={item} >
          <Button className="text-sm px-2 font-normal w-full h-full flex justify-between" variant={"ghost"}>Kurangi Produk</Button>
        </StockDialog>
      </DropdownMenuItem>
      <DropdownMenuItem asChild >
        <TransferDialog warehouses={warehouses} item={item} >
          <Button className="text-sm px-2 font-normal w-full h-full flex justify-between" variant={"ghost"}>Transfer Produk</Button>
        </TransferDialog>
      </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    </div>
  )
}
