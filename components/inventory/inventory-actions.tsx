"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Minus, ArrowRightLeft } from "lucide-react"

interface InventoryActionsProps {
  onAddStock: () => void
  onReduceStock: () => void
  onTransferStock: () => void
}

export function InventoryActions({ onAddStock, onReduceStock, onTransferStock }: InventoryActionsProps) {
  return (
    <TooltipProvider>
      <div className="flex space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onAddStock} className="h-8 w-8 bg-transparent">
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tambah Stok</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onReduceStock} className="h-8 w-8 bg-transparent">
              <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Kurangi Stok</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onTransferStock} className="h-8 w-8 bg-transparent">
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Transfer Stok</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
