import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: Number.parseInt(params.id) },
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, location } = body

    if (!name || !location) {
      return NextResponse.json({ error: "Name and location are required" }, { status: 400 })
    }

    const warehouse = await prisma.warehouse.update({
      where: { id: Number.parseInt(params.id) },
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.warehouse.delete({
      where: { id: Number.parseInt(params.id) },
    })

    return NextResponse.json({ message: "Warehouse deleted successfully" })
  } catch (error) {
    console.error("Delete warehouse error:", error)
    return NextResponse.json({ error: "Failed to delete warehouse" }, { status: 500 })
  }
}
