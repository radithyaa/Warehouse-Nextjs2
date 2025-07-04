"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Box, Warehouse, ClipboardList, History, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

const navigationItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/products", label: "Produk", icon: Box },
  { href: "/warehouses", label: "Gudang", icon: Warehouse },
  { href: "/inventory", label: "Inventaris", icon: ClipboardList },
  { href: "/history", label: "Riwayat", icon: History },
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
            <div className="flex flex-col h-full">
              <div className="text-center py-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Navigasi</h2>
              </div>

              <nav className="flex-1 space-y-2 px-4">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant={isActive ? "default" : "ghost"}
                      className={`
                        w-full justify-center h-12 text-base
                        ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                      `}
                      onClick={() => setOpen(false)}
                    >
                      <Link href={item.href}>
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="ghost" onClick={toggleTheme} className="w-full justify-center h-12 text-base">
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-5 w-5 mr-3" />
                      <span>Mode Terang</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-3" />
                      <span>Mode Gelap</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">StokIn Lite</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </header>
  )
}
