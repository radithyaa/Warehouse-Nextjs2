import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        warehouseProducts: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!warehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 })
    }

    return NextResponse.json(warehouse)
  } catch (error) {
    console.error("Get warehouse error:", error)
    return NextResponse.json({ error: "Failed to fetch warehouse" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { name, location } = body

    if (!name || !location) {
      return NextResponse.json({ error: "Name and location are required" }, { status: 400 })
    }

    const { id } = await params;
    const warehouse = await prisma.warehouse.update({
      where: { id: Number.parseInt(id) },
      data: {
        name,
        location,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(warehouse)
  } catch (error) {
    console.error("Update warehouse error:", error)
    return NextResponse.json({ error: "Failed to update warehouse" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.warehouse.delete({
      where: { id: Number.parseInt(id) },
    })

    return NextResponse.json({ message: "Warehouse deleted successfully" })
  } catch (error) {
    console.error("Delete warehouse error:", error)
    if (error instanceof Error && (error.message.includes("foreign key constraint") || error.message.includes("Foreign key constraint"))) {
      return NextResponse.json({ error: "Tidak dapat menghapus warehouse yang masih memiliki produk atau transaksi" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to delete warehouse" }, { status: 500 })
  }
}
