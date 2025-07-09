"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Users, Phone, Shield } from 'lucide-react'

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Button } from './ui/button'

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/safe-route', label: 'Safe Route', icon: MapPin },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/resources', label: 'Resources', icon: Phone },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <Shield className="w-6 h-6 text-primary" />
            </Button>
            <span className="text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">Guardian Angel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-muted-foreground">&copy; 2024 Guardian Angel</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-2 border-b md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <span className="font-semibold text-primary md:hidden">Guardian Angel</span>
            <div />
        </header>
        <main className="min-h-[calc(100vh-4rem)] bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
