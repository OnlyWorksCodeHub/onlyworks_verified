'use client'

import { Logo } from '@/components/ui/logo'
import { Home, BarChart3, Settings, Clock, FileText } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/helpers'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Sessions', href: '/sessions', icon: Clock },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Logo size={32} />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">OnlyWorks</span>
        </div>
      </div>
      
      <nav className="px-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-sm mb-1 transition',
              pathname === item.href
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-sm p-4">
          <h4 className="font-semibold text-purple-900 dark:text-purple-400 mb-2">Upgrade to Pro</h4>
          <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
            Get unlimited screenshots and advanced analytics
          </p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-sm hover:bg-purple-700 transition">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}
