"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Package, Warehouse, BarChart3, History, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Produk", href: "/products", icon: Package },
  { name: "Gudang", href: "/warehouses", icon: Warehouse },
  { name: "Inventaris", href: "/inventory", icon: BarChart3 },
  { name: "Riwayat", href: "/history", icon: History },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle className="text-center">StokIn Lite</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center space-y-4 mt-8">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full max-w-xs justify-center flex-col h-16 space-y-1",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800",
                )}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={item.href}>
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </Button>
            )
          })}

          {/* Dark Mode Toggle */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 w-full max-w-xs">
            <Button variant="ghost" onClick={toggleTheme} className="w-full justify-center flex-col h-16 space-y-1">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="text-sm">{theme === "dark" ? "Mode Terang" : "Mode Gelap"}</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
