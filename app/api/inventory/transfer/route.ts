import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, sourceWarehouseId, targetWarehouseId, quantity, note } = body

    if (sourceWarehouseId === targetWarehouseId) {
      return NextResponse.json({ message: "Gudang asal dan tujuan tidak boleh sama" }, { status: 400 })
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get source stock
      const sourceStock = await tx.warehouseProduct.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: sourceWarehouseId,
            productId,
          },
        },
      })

      if (!sourceStock || sourceStock.stok < quantity) {
        throw new Error("Stok di gudang asal tidak mencukupi")
      }

      // Update source warehouse stock
      await tx.warehouseProduct.update({
        where: {
          warehouseId_productId: {
            warehouseId: sourceWarehouseId,
            productId,
          },
        },
        data: {
          stok: sourceStock.stok - quantity,
        },
      })

      // Get or create target warehouse stock
      const targetStock = await tx.warehouseProduct.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: targetWarehouseId,
            productId,
          },
        },
      })

      if (targetStock) {
        // Update existing stock
        await tx.warehouseProduct.update({
          where: {
            warehouseId_productId: {
              warehouseId: targetWarehouseId,
              productId,
            },
          },
          data: {
            stok: targetStock.stok + quantity,
          },
        })
      } else {
        // Create new stock entry
        await tx.warehouseProduct.create({
          data: {
            warehouseId: targetWarehouseId,
            productId,
            stok: quantity,
            hargaBeli: sourceStock.hargaBeli,
            hargaJual: sourceStock.hargaJual,
          },
        })
      }

      // Create transaction record
      await tx.transaction.create({
        data: {
          productId,
          warehouseId: sourceWarehouseId,
          type: "TRANSFER",
          quantity,
          note,
          sourceWarehouseId,
          targetWarehouseId,
        },
      })

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan" }, { status: 500 })
  }
}
