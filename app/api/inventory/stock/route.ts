import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { warehouseId, productId, type, quantity, hargaBeli, hargaJual, note } = body

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get current stock
      const currentStock = await tx.warehouseProduct.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId,
            productId,
          },
        },
      })

      let newStock = 0
      if (type === "IN") {
        newStock = (currentStock?.stok || 0) + quantity
      } else {
        newStock = (currentStock?.stok || 0) - quantity
        if (newStock < 0) {
          throw new Error("Stok tidak mencukupi")
        }
      }

      // Update or create warehouse product
      const updateData: any = { stok: newStock }
      if (hargaBeli !== null) updateData.hargaBeli = hargaBeli
      if (hargaJual !== null) updateData.hargaJual = hargaJual

      await tx.warehouseProduct.upsert({
        where: {
          warehouseId_productId: {
            warehouseId,
            productId,
          },
        },
        update: updateData,
        create: {
          warehouseId,
          productId,
          stok: newStock,
          hargaBeli,
          hargaJual,
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          productId,
          warehouseId,
          type,
          quantity,
          note,
        },
      })

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan" }, { status: 500 })
  }
}
