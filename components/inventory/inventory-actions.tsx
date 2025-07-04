"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Minus, ArrowRightLeft } from "lucide-react"
import { StockDialog } from "./stock-dialog"
import { TransferDialog } from "./transfer-dialog"

interface InventoryActionsProps {
  warehouseProductId: string
  productName: string
  currentStock: number
  onStockUpdate: () => void
}

export function InventoryActions({
  warehouseProductId,
  productName,
  currentStock,
  onStockUpdate,
}: InventoryActionsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <StockDialog
              warehouseProductId={warehouseProductId}
              productName={productName}
              type="in"
              onSuccess={onStockUpdate}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
            <StockDialog
              warehouseProductId={warehouseProductId}
              productName={productName}
              type="out"
              onSuccess={onStockUpdate}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
            <TransferDialog
              warehouseProductId={warehouseProductId}
              productName={productName}
              currentStock={currentStock}
              onSuccess={onStockUpdate}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
