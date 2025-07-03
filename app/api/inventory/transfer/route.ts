import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, sourceWarehouseId, targetWarehouseId, quantity, note } = body

    // Validate required fields
    if (!productId || !sourceWarehouseId || !targetWarehouseId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

      if (!sourceStock || sourceStock.stok < Number.parseInt(quantity)) {
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
          stok: sourceStock.stok - Number.parseInt(quantity),
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
          stok: (targetStock?.stok || 0) + Number.parseInt(quantity),
          updatedAt: new Date(),
        },
        create: {
          warehouseId: Number.parseInt(targetWarehouseId),
          productId: Number.parseInt(productId),
          stok: Number.parseInt(quantity),
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
          quantity: Number.parseInt(quantity),
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
