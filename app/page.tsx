import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Warehouse, BarChart3, History } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getDashboardStats() {
  const [totalProducts, totalWarehouses, totalStock] = await Promise.all([
    prisma.product.count(),
    prisma.warehouse.count(),
    prisma.warehouseProduct.aggregate({
      _sum: {
        stok: true,
      },
    }),
  ])

  return {
    totalProducts,
    totalWarehouses,
    totalStock: totalStock._sum.stok || 0,
  }
}

export default async function Dashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">StokIn Lite</h1>
        <p className="text-muted-foreground">Sistem Manajemen Inventaris Multi-Gudang</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produk terdaftar dalam sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gudang</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">Gudang aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item Tersimpan</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">Item di semua gudang</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produk
            </CardTitle>
            <CardDescription>Kelola data produk dan informasi barang</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/products">Lihat Produk</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Gudang
            </CardTitle>
            <CardDescription>Kelola data gudang dan lokasi penyimpanan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/warehouses">Lihat Gudang</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Inventaris
            </CardTitle>
            <CardDescription>Kelola stok barang di setiap gudang</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/inventory">Lihat Inventaris</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Riwayat
            </CardTitle>
            <CardDescription>Lihat riwayat transaksi dan pergerakan stok</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/history">Lihat Riwayat</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
