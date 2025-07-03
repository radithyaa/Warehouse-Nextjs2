import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, code, unit, category } = body
    const productId = Number.parseInt(params.id)

    // Check if code already exists for other products
    const existingProduct = await prisma.product.findFirst({
      where: {
        code,
        NOT: { id: productId },
      },
    })

    if (existingProduct) {
      return NextResponse.json({ message: "Kode produk sudah digunakan" }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        code,
        unit: unit || null,
        category: category || null,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat memperbarui produk" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ message: "Produk berhasil dihapus" })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat menghapus produk" }, { status: 500 })
  }
}
