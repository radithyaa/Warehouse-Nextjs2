import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductDialog } from "@/components/products/product-dialog"
import { DeleteProductDialog } from "@/components/products/delete-product-dialog"
import Link from "next/link"

async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produk</h1>
          <p className="text-muted-foreground">Kelola data produk dan informasi barang</p>
        </div>
        <ProductDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </ProductDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Total {products.length} produk terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari produk..." className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Link href={`/products/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.unit || "-"}</TableCell>
                    <TableCell>{product.category || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ProductDialog product={product}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </ProductDialog>
                        <DeleteProductDialog product={product}>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DeleteProductDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Belum ada produk. Tambahkan produk pertama Anda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
