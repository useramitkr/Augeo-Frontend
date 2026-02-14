"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PageLoader } from "@/components/common/LoadingSpinner";
import {
  LayoutDashboard,
  Users,
  Gavel,
  Package,
  Grid3x3,
  FileText,
  Shield,
  DollarSign,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/auctions", label: "Auctions", icon: Gavel },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Grid3x3 },
  { href: "/admin/pages", label: "Pages / CMS", icon: FileText },
  { href: "/admin/kyc", label: "KYC", icon: Shield },
  { href: "/admin/financial", label: "Financial", icon: DollarSign },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated || !["admin", "superadmin"].includes(user?.role || ""))
    )
      router.push("/");
  }, [isLoading, isAuthenticated, user, router]);

  if (!isAuthenticated || !["admin", "superadmin"].includes(user?.role || ""))
    return null;

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-dark min-h-screen p-4 transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          >
            <div className="flex items-center justify-between lg:hidden mb-4">
              <span className="text-white font-bold">Admin</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="px-4 py-3 mb-4 border-b border-gray-700">
              <p className="text-gold font-bold text-lg">AUGEO</p>
              <p className="text-gray-400 text-xs">Super Admin Panel</p>
            </div>
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${isActive ? "bg-gold/20 text-gold font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <main className="flex-1 p-6 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mb-4 p-2 bg-white rounded-lg shadow-sm border"
            >
              <Menu className="h-5 w-5" />
            </button>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
