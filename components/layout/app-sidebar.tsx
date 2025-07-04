"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { Home, Package, Warehouse, ClipboardList, History, ChevronLeft, ChevronRight, Moon, Sun, LogOut, Menu } from "lucide-react"

interface AppSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

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

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <TooltipProvider>
      <div
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-60"
        } flex flex-col h-full`}
      >
        {/* Header */}
        <div className="py-4 px-2 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {!isCollapsed && <h1 className="text-xl pl-4 font-bold text-primary dark:text-primary">Warehouses</h1>}
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 text-primary hover:text-primary">
              {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4 text-primary hover:text-primary" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 text-center space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const buttonContent = (
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full ${isCollapsed ? "px-4 justify-center" : "justify-start"}`}
                asChild
              >
                <Link href={item.href}>
                  <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"}`} />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{buttonContent}</div>
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="pt-2 px-2 pb-0 border-t border-gray-200 dark:border-gray-700">
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
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                </>
              )}
              <span>Ganti Mode</span>
            </Button>
          )}
        </div>
        <div className="px-2 pb-2 pt-0 border-gray-200 dark:border-gray-700">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full">
                  <LogOut/>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Log Out</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log Out</span>
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
