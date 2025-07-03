import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { warehouseId, productId, type, quantity, hargaBeli, hargaJual, note } = body

    // Validate required fields
    if (!warehouseId || !productId || !type || !quantity) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get current stock
      const currentStock = await tx.warehouseProduct.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(warehouseId),
            productId: Number.parseInt(productId),
          },
        },
      })

      let newStock = 0
      if (type === "IN") {
        newStock = (currentStock?.stok || 0) + Number.parseInt(quantity)
      } else {
        newStock = (currentStock?.stok || 0) - Number.parseInt(quantity)
        if (newStock < 0) {
          throw new Error("Stok tidak mencukupi")
        }
      }

      // Update or create warehouse product
      const updateData: any = { stok: newStock }
      if (hargaBeli !== null && hargaBeli !== undefined) updateData.hargaBeli = Number.parseInt(hargaBeli)
      if (hargaJual !== null && hargaJual !== undefined) updateData.hargaJual = Number.parseInt(hargaJual)

      await tx.warehouseProduct.upsert({
        where: {
          warehouseId_productId: {
            warehouseId: Number.parseInt(warehouseId),
            productId: Number.parseInt(productId),
          },
        },
        update: updateData,
        create: {
          warehouseId: Number.parseInt(warehouseId),
          productId: Number.parseInt(productId),
          stok: newStock,
          hargaBeli: hargaBeli ? Number.parseInt(hargaBeli) : null,
          hargaJual: hargaJual ? Number.parseInt(hargaJual) : null,
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          productId: Number.parseInt(productId),
          warehouseId: Number.parseInt(warehouseId),
          type,
          quantity: Number.parseInt(quantity),
          note,
        },
      })

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Stock operation error:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    )
  }
}
