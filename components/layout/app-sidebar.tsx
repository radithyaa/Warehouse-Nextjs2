"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Home, Box, Warehouse, ClipboardList, History, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

interface AppSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/products", label: "Produk", icon: Box },
  { href: "/warehouses", label: "Gudang", icon: Warehouse },
  { href: "/inventory", label: "Inventaris", icon: ClipboardList },
  { href: "/history", label: "Riwayat", icon: History },
]

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <TooltipProvider>
      <div
        className={`
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 flex flex-col h-full
        ${isCollapsed ? "w-16" : "w-60"}
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">StokIn Lite</h1>}
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const buttonContent = (
              <Button
                asChild
                variant={isActive ? "default" : "ghost"}
                className={`
                  w-full justify-start h-10
                  ${isCollapsed ? "px-2" : "px-3"}
                  ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                `}
              >
                <Link href={item.href}>
                  <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </Button>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{buttonContent}</div>
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-full h-10">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{theme === "dark" ? "Mode Terang" : "Mode Gelap"}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start h-10">
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 mr-3" />
                  <span>Mode Terang</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-3" />
                  <span>Mode Gelap</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
