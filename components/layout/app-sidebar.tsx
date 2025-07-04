"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Home, Package, Warehouse, BarChart3, History, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Produk", href: "/products", icon: Package },
  { name: "Gudang", href: "/warehouses", icon: Warehouse },
  { name: "Inventaris", href: "/inventory", icon: BarChart3 },
  { name: "Riwayat", href: "/history", icon: History },
]

interface AppSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          isCollapsed ? "w-16" : "w-60",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              StokIn Lite
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            const buttonContent = (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full transition-colors",
                  isCollapsed ? "justify-center px-2" : "justify-start",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800",
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </Button>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return buttonContent
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-full">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{theme === "dark" ? "Mode Terang" : "Mode Gelap"}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start">
              {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
