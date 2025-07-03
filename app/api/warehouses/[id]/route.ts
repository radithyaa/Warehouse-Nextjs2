import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, location } = body
    const warehouseId = Number.parseInt(params.id)

    const warehouse = await prisma.warehouse.update({
      where: { id: warehouseId },
      data: {
        name,
        location,
      },
    })

    return NextResponse.json(warehouse)
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat memperbarui gudang" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const warehouseId = Number.parseInt(params.id)

    await prisma.warehouse.delete({
      where: { id: warehouseId },
    })

    return NextResponse.json({ message: "Gudang berhasil dihapus" })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat menghapus gudang" }, { status: 500 })
  }
}
