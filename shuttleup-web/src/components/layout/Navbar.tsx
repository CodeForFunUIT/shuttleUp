"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dumbbell, Menu, LayoutDashboard, User, LogOut, Telescope } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/sessions", label: "Find Session", icon: Telescope },
]

/** Initials avatar from full name */
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div
      className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold select-none"
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

export function Navbar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const user = session?.user

  return (
    <nav
      className="w-full border-b backdrop-blur-md bg-background/80 sticky top-0 z-50"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-primary shrink-0"
          aria-label="ShuttleUp — Home"
        >
          <Dumbbell className="h-5 w-5" aria-hidden="true" />
          ShuttleUp
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                className={cn(
                  "font-medium text-muted-foreground hover:text-foreground",
                  pathname === href && "text-foreground bg-accent"
                )}
              >
                {label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <ThemeToggle />

          {!isPending && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 hover:bg-accent transition-colors cursor-pointer"
                  aria-label={`Account menu for ${user.name}`}
                >
                  <UserAvatar name={user.name ?? "U"} />
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/api/auth/sign-out")}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90 font-semibold">
                  Login
                </Button>
              </Link>
            )
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>

              {/* Mobile header */}
              <div className="flex items-center gap-2 px-6 py-5 border-b">
                <Dumbbell className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-display font-bold text-lg text-primary">ShuttleUp</span>
              </div>

              {/* Mobile user info */}
              {user && (
                <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
                  <UserAvatar name={user.name ?? "U"} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </div>
                </div>
              )}

              {/* Mobile nav links */}
              <nav className="flex flex-col px-3 py-4 gap-1" aria-label="Mobile navigation">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                ))}

                {user && (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        pathname.startsWith("/dashboard")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        pathname === "/profile"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      Profile
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile auth CTA */}
              <div className="px-6 pt-2 pb-6 border-t mt-auto">
                {!isPending && !user && (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 font-semibold">
                      Login
                    </Button>
                  </Link>
                )}
                {user && (
                  <Link href="/api/auth/sign-out" onClick={() => setMobileOpen(false)} className="block">
                    <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
                      <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                      Sign Out
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  )
}
