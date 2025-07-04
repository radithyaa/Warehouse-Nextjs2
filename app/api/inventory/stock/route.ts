import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, warehouseId, quantity, hargaBeli, hargaJual, type } = body

    if (!productId || !warehouseId || quantity === undefined || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return NextResponse.json({ error: "Quantity must be a valid positive number" }, { status: 400 })
    }

    if (!['IN', 'OUT'].includes(type)) {
      return NextResponse.json({ error: "Type must be 'IN' or 'OUT'" }, { status: 400 })
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find existing warehouse product
      const existingStock = await tx.warehouseProduct.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(warehouseId),
            productId: Number.parseInt(productId),
          },
        },
      })

      let newStock = 0
      if (type === "IN") {
        newStock = (existingStock?.stok || 0) + quantityNum
      } else if (type === "OUT") {
        newStock = (existingStock?.stok || 0) - quantityNum
        if (newStock < 0) {
          throw new Error("Stok tidak mencukupi")
        }
      }

      // Update or create warehouse product
      const warehouseProduct = await tx.warehouseProduct.upsert({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(warehouseId),
            productId: Number.parseInt(productId),
          },
        },
        update: {
          stok: newStock,
          ...(hargaBeli && { hargaBeli: Number.parseInt(hargaBeli) }),
          ...(hargaJual && { hargaJual: Number.parseInt(hargaJual) }),
          updatedAt: new Date(),
        },
        create: {
          warehouseId: Number.parseInt(warehouseId),
          productId: Number.parseInt(productId),
          stok: newStock,
          hargaBeli: hargaBeli ? Number.parseInt(hargaBeli) : null,
          hargaJual: hargaJual ? Number.parseInt(hargaJual) : null,
        },
      })

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          productId: Number.parseInt(productId),
          warehouseId: Number.parseInt(warehouseId),
          type: type,
          quantity: quantityNum,
          note: body.note || null,
        },
      })

      return { warehouseProduct, transaction }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Stock operation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
