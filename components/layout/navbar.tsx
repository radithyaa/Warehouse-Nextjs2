"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package, Warehouse, BarChart3, History, Home } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Produk", href: "/products", icon: Package },
  { name: "Gudang", href: "/warehouses", icon: Warehouse },
  { name: "Inventaris", href: "/inventory", icon: BarChart3 },
  { name: "Riwayat", href: "/history", icon: History },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2 mr-8">
            <Package className="h-6 w-6" />
            <span className="font-bold">StokIn Lite</span>
          </Link>

          <div className="flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
