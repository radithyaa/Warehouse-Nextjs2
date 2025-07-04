import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Sepertinya Anda tersesat. Halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>

        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  )
}
