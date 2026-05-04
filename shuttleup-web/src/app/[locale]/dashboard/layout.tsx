"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { LayoutDashboard, CalendarPlus, List, CreditCard, User, LogOut, Loader2, Trophy } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Sessions", href: "/dashboard/sessions", icon: List },
    { label: "Host a Session", href: "/dashboard/sessions/new", icon: CalendarPlus },
    { label: "BELo Ranking", href: "/dashboard/belo", icon: Trophy },
    { label: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
    { label: "Profile Settings", href: "/profile", icon: User },
  ];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-card rounded-xl border shadow-sm p-4 sticky top-24">
          <div className="mb-6 px-3">
            <h2 className="text-xl font-bold truncate">{session.user.name}</h2>
            <p className="text-sm text-muted-foreground truncate">{session.user.email}</p>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-4 border-t">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
