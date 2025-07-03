import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data produk" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, unit, category } = body

    // Check if code already exists
    const existingProduct = await prisma.product.findUnique({
      where: { code },
    })

    if (existingProduct) {
      return NextResponse.json({ message: "Kode produk sudah digunakan" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        code,
        unit: unit || null,
        category: category || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat menambah produk" }, { status: 500 })
  }
}
