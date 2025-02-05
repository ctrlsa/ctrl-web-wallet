'use client'

import { Send, Settings, Receipt, Clock9 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16">
        <NavItem href="/" icon={Receipt} label="Receive" isActive={pathname === '/'} />
        <NavItem href="/send" icon={Send} label="Send" isActive={pathname === '/send'} />
        <NavItem
          href="/activity"
          icon={Clock9}
          label="Activity"
          isActive={pathname === '/activity'}
        />
        <NavItem
          href="/settings"
          icon={Settings}
          label="Settings"
          isActive={pathname === '/settings'}
        />
      </div>
    </nav>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  isActive
}: {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-in-out ${
        isActive
          ? 'text-primary bg-primary/10 font-medium'
          : 'text-muted-foreground hover:text-primary/80'
      }`}
    >
      <Icon
        className={`h-6 w-6 transition-all duration-200 ease-in-out ${isActive ? 'text-primary' : ''}`}
      />
      <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </Link>
  )
}
