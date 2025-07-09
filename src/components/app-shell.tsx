"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Users, Phone } from 'lucide-react'
import { Logo } from '@/components/logo';

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

  if (pathname === '/signup') {
    return <main className="bg-slate-50 dark:bg-slate-950">{children}</main>;
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="h-10 w-10">
                <Link href="/">
                  <Logo className="w-8 h-8 text-primary" />
                </Link>
            </Button>
            <span className="text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">SafeCircle</span>
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
          <p className="text-xs text-muted-foreground">&copy; 2024 SafeCircle</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-2 border-b md:justify-end bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="md:hidden" />
             <div className="flex items-center gap-2 md:hidden">
              <Logo className="w-7 h-7 text-primary" />
              <span className="font-semibold text-primary">SafeCircle</span>
            </div>
            <div />
        </header>
        <main className="min-h-[calc(100vh-4rem)] bg-background/80">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
