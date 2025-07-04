import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { id } from "date-fns/locale"

async function getTransactions() {
  return await prisma.transaction.findMany({
    include: {
      product: true,
      warehouse: true,
      sourceWarehouse: true,
      targetWarehouse: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function HistoryPage() {
  const transactions = await getTransactions()

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "IN":
        return "Masuk"
      case "OUT":
        return "Keluar"
      case "TRANSFER":
        return "Transfer"
      default:
        return type
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "IN":
        return "default"
      case "OUT":
        return "destructive"
      case "TRANSFER":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto p-6">

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>Total {transactions.length} transaksi tercatat</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Belum ada transaksi</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Gudang</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead>Transfer</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm", { locale: id })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(transaction.type) as any}>
                          {getTypeLabel(transaction.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.product?.name}</div>
                          <div className="text-sm text-muted-foreground">{transaction.product?.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.warehouse?.name}</TableCell>
                      <TableCell className="text-right font-medium">
                        {transaction.quantity} {transaction.product?.unit || "pcs"}
                      </TableCell>
                      <TableCell>
                        {transaction.type === "TRANSFER" && (
                          <div className="text-sm">
                            <div>Dari: {transaction.sourceWarehouse?.name}</div>
                            <div>Ke: {transaction.targetWarehouse?.name}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={transaction.note || ""}>
                          {transaction.note || "-"}
                        </div>
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
