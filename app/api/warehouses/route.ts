import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(warehouses)
  } catch (error) {
    console.error("Get warehouses error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location } = body

    // Validate required fields
    if (!name || !location) {
      return NextResponse.json({ message: "Nama dan lokasi gudang wajib diisi" }, { status: 400 })
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
      },
    })

    return NextResponse.json(warehouse)
  } catch (error) {
    console.error("Create warehouse error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}
