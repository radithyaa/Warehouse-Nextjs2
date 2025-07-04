"use client"

import Link from "next/link"
import { MobileNav } from "./mobile-nav"

export function MobileHeader() {
  return (
    <header className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-16">
        <MobileNav />
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          StokIn Lite
        </Link>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </header>
  )
}
