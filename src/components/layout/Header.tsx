'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import {
  Search, Bell, User, Menu, X, ChevronDown, Gavel,
  LayoutDashboard, Heart, Package, LogOut, Settings
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) fetchUnreadCount();
  }, [isAuthenticated, fetchUnreadCount]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'superadmin' || user.role === 'admin') return '/admin';
    if (user.role.startsWith('client')) return '/client';
    return '/dashboard';
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'}`}>
      {/* Top bar */}
      <div className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center gap-4">
              <Link href="/pages/how-it-works" className="hover:text-gold transition-colors">How It Works</Link>
              <Link href="/pages/buyers-premium" className="hover:text-gold transition-colors">Buyer&apos;s Premium</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pages/about" className="hover:text-gold transition-colors">About</Link>
              <Link href="/pages/contact" className="hover:text-gold transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Gavel className="h-8 w-8 text-gold" />
            <span className="text-2xl font-heading font-bold text-dark">AUGEO</span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search auctions, lots, artists..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/auctions" className="text-gray-700 hover:text-gold font-medium transition-colors text-sm">
              Auctions
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gold font-medium transition-colors text-sm">
              Categories
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard/watchlist" className="relative text-gray-600 hover:text-gold transition-colors">
                  <Heart className="h-5 w-5" />
                </Link>

                <Link href="/dashboard/notifications" className="relative text-gray-600 hover:text-gold transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gold transition-colors"
                  >
                    <div className="h-8 w-8 bg-gold/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-sm font-medium hidden lg:inline">{user?.firstName}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-slide-up">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-sm">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <Link href={getDashboardLink()} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/dashboard/bids" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                        <Gavel className="h-4 w-4" /> My Bids
                      </Link>
                      <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                        <Package className="h-4 w-4" /> Orders
                      </Link>
                      <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                        <Settings className="h-4 w-4" /> Settings
                      </Link>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-gold transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm !py-2 !px-4">
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-up">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search auctions..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
          <nav className="px-4 pb-4 space-y-1">
            <Link href="/auctions" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Auctions</Link>
            <Link href="/categories" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()} className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/watchlist" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Watchlist</Link>
                <Link href="/dashboard/notifications" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Notifications {unreadCount > 0 && <span className="badge bg-accent text-white ml-2">{unreadCount}</span>}
                </Link>
                <button onClick={handleLogout} className="block py-2.5 text-red-600 font-medium w-full text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/auth/register" className="block py-2.5 text-gold font-medium" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
