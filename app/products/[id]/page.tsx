import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getProductWithStock(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      warehouseProducts: {
        include: {
          warehouse: true,
        },
        orderBy: {
          warehouse: { name: "asc" },
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  return product
}

interface ProductDetailPageProps {
  params: { id: string }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = Number.parseInt(params.id)
  const product = await getProductWithStock(productId)

  const totalStock = product.warehouseProducts.reduce((sum, wp) => sum + wp.stok, 0)

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Produk
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">
              Kode: {product.code} | Unit: {product.unit || "-"} | Kategori: {product.category || "-"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalStock}</div>
            <div className="text-sm text-muted-foreground">Total Stok</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stok di Setiap Gudang</CardTitle>
          <CardDescription>Distribusi stok produk ini di {product.warehouseProducts.length} gudang</CardDescription>
        </CardHeader>
        <CardContent>
          {product.warehouseProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Produk ini belum tersedia di gudang manapun</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gudang</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead className="text-right">Stok</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.warehouseProducts.map((wp) => (
                    <TableRow key={wp.warehouseId}>
                      <TableCell className="font-medium">
                        <Link href={`/warehouses/${wp.warehouseId}`} className="hover:underline">
                          {wp.warehouse.name}
                        </Link>
                      </TableCell>
                      <TableCell>{wp.warehouse.location}</TableCell>
                      <TableCell className="text-right font-medium">
                        {wp.stok} {product.unit || "pcs"}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(wp.hargaBeli)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(wp.hargaJual)}</TableCell>
                      <TableCell>
                        <Badge variant={wp.stok > 0 ? "default" : "secondary"}>
                          {wp.stok > 0 ? "Tersedia" : "Kosong"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
