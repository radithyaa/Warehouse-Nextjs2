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
      return NextResponse.json({ message: "Gudang tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(warehouse)
  } catch (error) {
    console.error("Get warehouse error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, location } = body

    const warehouse = await prisma.warehouse.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        name,
        location,
      },
    })

    return NextResponse.json(warehouse)
  } catch (error) {
    console.error("Update warehouse error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.warehouse.delete({
      where: { id: Number.parseInt(params.id) },
    })

    return NextResponse.json({ message: "Gudang berhasil dihapus" })
  } catch (error) {
    console.error("Delete warehouse error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}
