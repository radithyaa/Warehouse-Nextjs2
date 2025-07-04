import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { warehouseId, productId, quantity, hargaBeli, hargaJual } = body

    if (!warehouseId || !productId || quantity === undefined) {
      return NextResponse.json({ message: "Warehouse ID, Product ID, and quantity are required" }, { status: 400 })
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      return NextResponse.json({ message: "Quantity must be a valid non-negative number" }, { status: 400 })
    }

    // Check if product already exists in warehouse
    const existingWarehouseProduct = await prisma.warehouseProduct.findUnique({
      where: {
        warehouseId_productId: {
          warehouseId: Number.parseInt(warehouseId),
          productId: Number.parseInt(productId),
        },
      },
    })

    if (existingWarehouseProduct) {
      return NextResponse.json({ message: "Product already exists in this warehouse" }, { status: 400 })
    }

    // Create warehouse product and transaction in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create warehouse product
      const warehouseProduct = await tx.warehouseProduct.create({
        data: {
          warehouseId: Number.parseInt(warehouseId),
          productId: Number.parseInt(productId),
          stok: quantityNum,
          hargaBeli: hargaBeli ? Number.parseInt(hargaBeli) : null,
          hargaJual: hargaJual ? Number.parseInt(hargaJual) : null,
        },
      })

      // Create transaction record if quantity > 0
      if (quantityNum > 0) {
        await tx.transaction.create({
          data: {
            productId: Number.parseInt(productId),
            warehouseId: Number.parseInt(warehouseId),
            type: "IN",
            quantity: quantityNum,
            note: "Stok awal produk",
          },
        })
      }

      return warehouseProduct
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error adding product to warehouse:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
