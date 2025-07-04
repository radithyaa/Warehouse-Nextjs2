"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { Menu, Home, Package, Warehouse, ClipboardList, History, Moon, Sun } from "lucide-react"

const navigationItems = [
  {
    title: "Beranda",
    href: "/",
    icon: Home,
  },
  {
    title: "Produk",
    href: "/products",
    icon: Package,
  },
  {
    title: "Gudang",
    href: "/warehouses",
    icon: Warehouse,
  },
  {
    title: "Inventaris",
    href: "/inventory",
    icon: ClipboardList,
  },
  {
    title: "Riwayat",
    href: "/history",
    icon: History,
  },
]

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[400px]">
            <div className="py-6">
              <h2 className="text-lg font-semibold text-center mb-6">Navigasi</h2>
              <nav className="space-y-4">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-center"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4 mr-2" />
                        {item.title}
                      </Link>
                    </Button>
                  )
                })}
              </nav>

              {/* Theme Toggle */}
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="ghost" onClick={toggleTheme} className="w-full justify-center">
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Mode Terang
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Mode Gelap
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">StokIn Lite</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </header>
  )
}
