import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { WarehouseDialog } from "@/components/warehouses/warehouse-dialog"
import { DeleteWarehouseDialog } from "@/components/warehouses/delete-warehouse-dialog"
import Link from "next/link"

export const dynamic = 'force-dynamic'

async function getWarehouses() {
  return await prisma.warehouse.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export default async function WarehousesPage() {
  const warehouses = await getWarehouses()
  

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        
      </div>

      <Card>
        <CardHeader className="flex justify-between flex-row w-full">
          <div>
          <CardTitle>Daftar Gudang</CardTitle>
          <CardDescription>Total {warehouses.length} gudang terdaftar</CardDescription>
          </div>
          <WarehouseDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Gudang
          </Button>
        </WarehouseDialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari gudang..." className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama Gudang</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse, index) => (
                  <TableRow key={warehouse.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Link href={`/warehouses/${warehouse.id}`} className="hover:underline text-primary">
                        {warehouse.name}
                      </Link>
                    </TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <WarehouseDialog warehouse={warehouse}>
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </WarehouseDialog>
                        <DeleteWarehouseDialog warehouse={warehouse}>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DeleteWarehouseDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {warehouses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Belum ada gudang. Tambahkan gudang pertama Anda.
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
