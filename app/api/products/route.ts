import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, unit, category } = body

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json({ message: "Nama dan kode produk wajib diisi" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        code,
        unit,
        category,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Create product error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Kode produk sudah digunakan" }, { status: 400 })
    }
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}
