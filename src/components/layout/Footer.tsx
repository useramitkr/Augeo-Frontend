import Link from 'next/link';
import { Gavel, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gavel className="h-7 w-7 text-gold" />
              <span className="text-xl font-heading font-bold">AUGEO</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium auction marketplace connecting discerning buyers with world-class auction houses and extraordinary items.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                <span>support@augeo.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/auctions" className="text-gray-400 hover:text-gold transition-colors">Browse Auctions</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-gold transition-colors">Categories</Link></li>
              <li><Link href="/pages/how-it-works" className="text-gray-400 hover:text-gold transition-colors">How It Works</Link></li>
              <li><Link href="/pages/buyers-premium" className="text-gray-400 hover:text-gold transition-colors">Buyer&apos;s Premium</Link></li>
              <li><Link href="/auth/register" className="text-gray-400 hover:text-gold transition-colors">Register to Bid</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/pages/about" className="text-gray-400 hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/pages/authentication-process" className="text-gray-400 hover:text-gold transition-colors">Authentication Process</Link></li>
              <li><Link href="/pages/shipping-taxes" className="text-gray-400 hover:text-gold transition-colors">Shipping &amp; Taxes</Link></li>
              <li><Link href="/pages/terms" className="text-gray-400 hover:text-gold transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/pages/privacy" className="text-gray-400 hover:text-gold transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Sell With Us */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Sell With Us</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Are you an auction house or consignor? Partner with Augeo to reach a global audience of premium buyers.
            </p>
            <Link href="/pages/contact" className="btn-outline !py-2.5 !px-5 text-sm">
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Augeo Auction Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/pages/terms" className="hover:text-gold transition-colors">Terms</Link>
              <Link href="/pages/privacy" className="hover:text-gold transition-colors">Privacy</Link>
              <Link href="/pages/contact" className="hover:text-gold transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
