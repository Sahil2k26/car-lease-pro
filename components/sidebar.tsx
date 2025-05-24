"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Car, Users, FileText, DollarSign, BarChart3, Settings } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Vehicles", href: "/vehicles", icon: Car },
  { name: "Lessees", href: "/lessees", icon: Users },
  { name: "Lease Agreements", href: "/leases", icon: FileText },
  { name: "Payments", href: "/payments", icon: DollarSign },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 bg-blue-600">
        <h1 className="text-white text-xl font-bold">CarLease Pro</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
