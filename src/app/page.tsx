"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuctionCard from "@/components/auction/AuctionCard";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { auctionAPI, categoryAPI } from "@/lib/api";
import { Auction, Category } from "@/types";
import {
  Gavel,
  Shield,
  Globe,
  Clock,
  ArrowRight,
  Star,
  ChevronRight,
  Award,
  Users,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<Auction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, liveRes, upcomingRes, catRes] =
          await Promise.allSettled([
            auctionAPI.getFeatured(),
            auctionAPI.getAll({ status: "live", limit: 6 }),
            auctionAPI.getAll({
              status: "scheduled",
              limit: 6,
              sort: "startTime",
            }),
            categoryAPI.getAll(),
          ]);

        if (featuredRes.status === "fulfilled")
          setFeaturedAuctions(featuredRes.value.data.data || []);
        if (liveRes.status === "fulfilled")
          setLiveAuctions(liveRes.value.data.data || []);
        if (upcomingRes.status === "fulfilled")
          setUpcomingAuctions(upcomingRes.value.data.data || []);
        if (catRes.status === "fulfilled")
          setCategories(catRes.value.data.data || []);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <>
        <Header />
        <PageLoader />
        <Footer />
      </>
    );

  return (
    <>
      {/* <Header /> */}

      {/* Hero Section */}
      <section className="relative bg-dark min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/70" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23c9a84c%22%20fill-opacity%3D%220.15%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold text-sm font-semibold uppercase tracking-widest">
                Premium Auction House
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
              Discover <span className="text-gold-gradient">Extraordinary</span>{" "}
              Items
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-lg">
              Bid on rare collectibles, fine art, jewelry, and more from
              world-class auction houses. Your next masterpiece awaits.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auctions"
                className="btn-primary text-lg !py-4 !px-8 gap-2"
              >
                Explore Auctions <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/pages/how-it-works"
                className="btn-outline !border-white/30 !text-white hover:!bg-white/10 text-lg !py-4 !px-8"
              >
                How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Items Sold</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Auction Houses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Active Bidders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Auctions */}
      {liveAuctions.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-600 text-sm font-semibold uppercase">
                    Live Now
                  </span>
                </div>
                <h2 className="section-title">Live Auctions</h2>
              </div>
              <Link
                href="/auctions?status=live"
                className="text-gold hover:text-gold-dark font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Auctions */}
      {featuredAuctions.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-gold text-sm font-semibold uppercase flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4" /> Featured
                </span>
                <h2 className="section-title">Featured Auctions</h2>
              </div>
              <Link
                href="/auctions?featured=true"
                className="text-gold hover:text-gold-dark font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="section-title mb-3">Browse by Category</h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Explore our curated collections spanning fine art, jewelry,
                antiques, and more.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <Link key={category._id} href={`/categories/${category.slug}`}>
                  <div className="relative group rounded-xl overflow-hidden bg-dark h-40 flex items-center justify-center hover:shadow-lg transition-all">
                    {category.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-dark-light to-dark" />
                    )}
                    <div className="relative text-center z-10">
                      <h3 className="text-white font-heading font-semibold text-lg">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Auctions */}
      {upcomingAuctions.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-blue-600 text-sm font-semibold uppercase flex items-center gap-1 mb-2">
                  <Clock className="h-4 w-4" /> Coming Soon
                </span>
                <h2 className="section-title">Upcoming Auctions</h2>
              </div>
              <Link
                href="/auctions?status=scheduled"
                className="text-gold hover:text-gold-dark font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-20 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Why Choose Augeo?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Trusted by collectors and auction houses worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Verified Authenticity
              </h3>
              <p className="text-gray-400 text-sm">
                Every item is verified by experts. Complete condition reports
                and provenance documentation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Global Reach
              </h3>
              <p className="text-gray-400 text-sm">
                Connect with auction houses and collectors from around the
                world. Bid from anywhere, anytime.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gavel className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Real-Time Bidding
              </h3>
              <p className="text-gray-400 text-sm">
                Experience the thrill with live updates, auto-bidding, and
                instant outbid notifications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-400 text-sm">
                Encrypted transactions, buyer protection, and seamless checkout
                powered by Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-gold-dark via-gold to-gold-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Start Bidding?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Create your free account today and join thousands of collectors
            discovering extraordinary items.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="bg-dark text-white font-semibold py-3.5 px-8 rounded-lg hover:bg-dark-light transition-all inline-flex items-center gap-2"
            >
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auctions"
              className="bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg hover:bg-white/30 transition-all border border-white/30"
            >
              Browse Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
}
