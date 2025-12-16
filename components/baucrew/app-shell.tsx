"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  Home,
  Search,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
} from "lucide-react"
import type { UserRole } from "@/lib/types"
import { BetaBanner } from "./beta-banner"
import { AppEnvironmentBadge } from "./app-environment-badge"

interface AppShellProps {
  children: React.ReactNode
  userRole?: UserRole
  userName?: string
  userAvatar?: string
  showBetaBanner?: boolean
  showEnvironmentBadge?: boolean
  paymentStatus?: "disabled" | "test" | "live"
}

export function AppShell({
  children,
  userRole = "customer",
  userName = "Max Mustermann",
  userAvatar = "/placeholder.svg?height=40&width=40",
  showBetaBanner = true,
  showEnvironmentBadge = true,
  paymentStatus = "test",
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const customerNavItems = [
    { href: "/", label: "Startseite", icon: Home },
    { href: "/suche", label: "Handwerker suchen", icon: Search },
    { href: "/anfragen", label: "Meine Anfragen", icon: FileText },
    { href: "/buchungen", label: "Buchungen", icon: Calendar },
    { href: "/nachrichten", label: "Nachrichten", icon: MessageSquare },
  ]

  const providerNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/auftraege", label: "Aufträge", icon: Briefcase },
    { href: "/kalender", label: "Kalender", icon: Calendar },
    { href: "/nachrichten", label: "Nachrichten", icon: MessageSquare },
    { href: "/profil", label: "Mein Profil", icon: User },
  ]

  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/verifications", label: "Verifications", icon: ShieldCheck },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
    { href: "/admin/requests", label: "Job Requests", icon: ClipboardList },
  ]

  const navItems = userRole === "admin" ? adminNavItems : userRole === "provider" ? providerNavItems : customerNavItems

  return (
    <div className="flex min-h-screen flex-col">
      {showBetaBanner && <BetaBanner />}
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col gap-2 mt-6">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary" />
              <span className="text-xl font-semibold">BauCrew</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Benachrichtigungen</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Einstellungen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Über uns</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/ueber-uns" className="hover:text-foreground">
                    Über BauCrew
                  </Link>
                </li>
                <li>
                  <Link href="/karriere" className="hover:text-foreground">
                    Karriere
                  </Link>
                </li>
                <li>
                  <Link href="/presse" className="hover:text-foreground">
                    Presse
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/hilfe" className="hover:text-foreground">
                    Hilfe-Center
                  </Link>
                </li>
                <li>
                  <Link href="/kontakt" className="hover:text-foreground">
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link href="/sicherheit" className="hover:text-foreground">
                    Sicherheit
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Rechtliches</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/agb" className="hover:text-foreground">
                    AGB
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="hover:text-foreground">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link href="/impressum" className="hover:text-foreground">
                    Impressum
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="hover:text-foreground">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="hover:text-foreground">
                    Partner werden
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 BauCrew. Alle Rechte vorbehalten.</p>
            {showEnvironmentBadge && <AppEnvironmentBadge showPaymentStatus paymentStatus={paymentStatus} />}
          </div>
        </div>
      </footer>
    </div>
  )
}
