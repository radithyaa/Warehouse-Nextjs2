import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, sourceWarehouseId, targetWarehouseId, quantity, note } = body

    // Validate required fields
    if (!productId || !sourceWarehouseId || !targetWarehouseId || !quantity) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (sourceWarehouseId === targetWarehouseId) {
      return NextResponse.json({ message: "Gudang asal dan tujuan tidak boleh sama" }, { status: 400 })
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get current stock in source warehouse
      const sourceStock = await tx.warehouseProduct.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(sourceWarehouseId),
            productId: Number.parseInt(productId),
          },
        },
      })

      if (!sourceStock || sourceStock.stok < Number.parseInt(quantity)) {
        throw new Error("Stok di gudang asal tidak mencukupi")
      }

      // Reduce stock in source warehouse
      await tx.warehouseProduct.update({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(sourceWarehouseId),
            productId: Number.parseInt(productId),
          },
        },
        data: {
          stok: sourceStock.stok - Number.parseInt(quantity),
        },
      })

      // Get or create stock in target warehouse
      const targetStock = await tx.warehouseProduct.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(targetWarehouseId),
            productId: Number.parseInt(productId),
          },
        },
      })

      if (targetStock) {
        // Update existing stock
        await tx.warehouseProduct.update({
          where: {
            warehouseId_productId: {
              warehouseId: Number.parseInt(targetWarehouseId),
              productId: Number.parseInt(productId),
            },
          },
          data: {
            stok: targetStock.stok + Number.parseInt(quantity),
          },
        })
      } else {
        // Create new stock entry
        await tx.warehouseProduct.create({
          data: {
            warehouseId: Number.parseInt(targetWarehouseId),
            productId: Number.parseInt(productId),
            stok: Number.parseInt(quantity),
            hargaBeli: sourceStock.hargaBeli,
            hargaJual: sourceStock.hargaJual,
          },
        })
      }

      // Create transaction record
      await tx.transaction.create({
        data: {
          productId: Number.parseInt(productId),
          warehouseId: Number.parseInt(sourceWarehouseId),
          type: "TRANSFER",
          quantity: Number.parseInt(quantity),
          note,
          sourceWarehouseId: Number.parseInt(sourceWarehouseId),
          targetWarehouseId: Number.parseInt(targetWarehouseId),
        },
      })

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Transfer operation error:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    )
  }
}
