import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, sourceWarehouseId, targetWarehouseId, quantity, note } = body

    // Validate required fields
    if (!productId || !sourceWarehouseId || !targetWarehouseId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return NextResponse.json({ error: "Quantity must be a valid positive number" }, { status: 400 })
    }

    if (sourceWarehouseId === targetWarehouseId) {
      return NextResponse.json({ error: "Gudang asal dan tujuan tidak boleh sama" }, { status: 400 })
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

      if (!sourceStock || sourceStock.stok < quantityNum) {
        throw new Error("Stok di gudang asal tidak mencukupi")
      }

      // Reduce stock from source warehouse
      await tx.warehouseProduct.update({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(sourceWarehouseId),
            productId: Number.parseInt(productId),
          },
        },
        data: {
          stok: sourceStock.stok - quantityNum,
          updatedAt: new Date(),
        },
      })

      // Get or create target warehouse product
      const targetStock = await tx.warehouseProduct.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(targetWarehouseId),
            productId: Number.parseInt(productId),
          },
        },
      })

      await tx.warehouseProduct.upsert({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(targetWarehouseId),
            productId: Number.parseInt(productId),
          },
        },
        update: {
          stok: (targetStock?.stok || 0) + quantityNum,
          updatedAt: new Date(),
        },
        create: {
          warehouseId: Number.parseInt(targetWarehouseId),
          productId: Number.parseInt(productId),
          stok: quantityNum,
          hargaBeli: sourceStock.hargaBeli,
          hargaJual: sourceStock.hargaJual,
        },
      })

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          productId: Number.parseInt(productId),
          warehouseId: Number.parseInt(sourceWarehouseId),
          type: "TRANSFER",
          quantity: quantityNum,
          note: note || null,
          sourceWarehouseId: Number.parseInt(sourceWarehouseId),
          targetWarehouseId: Number.parseInt(targetWarehouseId),
        },
      })

      return transaction
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
