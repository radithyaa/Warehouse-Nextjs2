import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const warehouseId = searchParams.get("warehouseId")

    if (!warehouseId) {
      return NextResponse.json({ message: "Warehouse ID is required" }, { status: 400 })
    }

    // Get products that are not yet in this warehouse
    const availableProducts = await prisma.product.findMany({
      where: {
        NOT: {
          warehouseProducts: {
            some: {
              warehouseId: Number.parseInt(warehouseId),
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(availableProducts)
  } catch (error) {
    console.error("Error fetching available products:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
