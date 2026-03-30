"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Kanban, LayoutDashboard, FolderOpen, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header — glass effect */}
      <div className="lg:hidden flex items-center justify-between p-4 glass">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
            <Kanban className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold font-display">PlanForge</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar — tonal surface, no hard borders */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-surface-container/50 backdrop-blur-sm transform transition-transform lg:translate-x-0 lg:static lg:inset-auto",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 hidden lg:block">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
                <Kanban className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display">PlanForge</span>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-display">
                  {session?.user?.name ? getInitials(session.user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-4 h-4 mr-2" />Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
