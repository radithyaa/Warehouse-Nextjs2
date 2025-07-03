import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: {
        warehouseProducts: {
          include: {
            warehouse: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, code, unit, category } = body

    const product = await prisma.product.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        name,
        code,
        unit,
        category,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Update product error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Kode produk sudah digunakan" }, { status: 400 })
    }
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: Number.parseInt(params.id) },
    })

    return NextResponse.json({ message: "Produk berhasil dihapus" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}
