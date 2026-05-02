"use client"

import { useState } from "react"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "@/i18n/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation";
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn.email({ email, password })

    if (error) {
      toast.error(error.message || "Failed to login. Check your credentials and try again.")
      setLoading(false)
      return
    }

    toast.success("Welcome back!")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-display font-bold text-center tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to book sessions &amp; track your progress
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                spellCheck={false}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 font-semibold"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4 text-sm text-muted-foreground">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
