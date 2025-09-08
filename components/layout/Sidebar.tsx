'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Clock, 
  BarChart3, 
  FileText, 
  Trophy, 
  Settings,
  HelpCircle
} from 'lucide-react'

interface SidebarProps {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname()
  
  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/sessions', icon: Clock, label: 'Sessions' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/achievements', icon: Trophy, label: 'Achievements' },
    { href: '/settings', icon: Settings, label: 'Settings' },
    { href: '/support', icon: HelpCircle, label: 'Support' },
  ]

  return (
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative lg:translate-x-0 z-30 h-screen w-64 bg-[#1A1A1A] border-r border-gray-800 transition-transform duration-200`}>
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#5E5CE6] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
