"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session, isPending } = useSession()

  return (
    <nav className="w-full border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl tracking-tighter text-primary">
          ShuttleUp 🏸
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/sessions">
            <Button variant="ghost">Find Group</Button>
          </Link>
          {!isPending && (
            session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Link href="/profile">
                  <Button>Profile</Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
