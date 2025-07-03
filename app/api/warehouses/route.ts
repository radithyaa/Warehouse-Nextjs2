import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(warehouses)
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data gudang" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location } = body

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
      },
    })

    return NextResponse.json(warehouse, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat menambah gudang" }, { status: 500 })
  }
}
