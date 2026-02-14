"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { PageLoader } from "@/components/common/LoadingSpinner";
import {
  LayoutDashboard,
  Gavel,
  Package,
  BarChart3,
  Wallet,
  Settings,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/client", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/auctions", label: "My Auctions", icon: Gavel },
  { href: "/client/orders", label: "Orders", icon: Package },
  { href: "/client/reports", label: "Reports", icon: BarChart3 },
  { href: "/client/settings", label: "Settings", icon: Settings },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.role.startsWith("client")))
      router.push("/");
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading)
    return (
      <>
        <PageLoader />
      </>
    );
  if (!isAuthenticated || !user?.role.startsWith("client")) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <aside
              className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-dark rounded-xl p-4 transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
              <div className="flex items-center justify-between lg:hidden mb-4">
                <span className="text-white font-bold">Menu</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="px-4 py-3 mb-4 border-b border-gray-700">
                <p className="text-gold font-semibold text-sm">
                  {user.companyName || "Auction House"}
                </p>
                <p className="text-gray-400 text-xs">Client Panel</p>
              </div>
              <nav className="space-y-1">
                {links.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/client" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${isActive ? "bg-gold/20 text-gold font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                    >
                      <link.icon className="h-5 w-5" />
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
            <main className="flex-1 min-w-0">
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
      </div>
    </>
  );
}
