import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        warehouseProducts: {
          include: {
            warehouse: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { name, code, unit, category } = body

    if (!name || !code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 })
    }

    const { id } = await params;
    const product = await prisma.product.update({
      where: { id: Number.parseInt(id) },
      data: {
        name,
        code,
        unit: unit || null,
        category: category || null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    if (error instanceof Error && (error.message.includes("Unique constraint") || error.message.includes("unique constraint"))) {
      return NextResponse.json({ error: "Kode produk sudah digunakan" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id: Number.parseInt(id) },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    if (error instanceof Error && (error.message.includes("foreign key constraint") || error.message.includes("Foreign key constraint"))) {
      return NextResponse.json({ error: "Tidak dapat menghapus produk yang masih digunakan di warehouse" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
