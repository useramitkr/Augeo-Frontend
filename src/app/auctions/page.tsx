"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuctionCard from "@/components/auction/AuctionCard";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { auctionAPI, categoryAPI } from "@/lib/api";
import { Auction, Category } from "@/types";
import {
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AuctionsPage() {
  const searchParams = useSearchParams();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    page: 1,
  });

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const params: any = { page: filters.page, limit: 12 };
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    if (filters.sort) params.sort = filters.sort;

    auctionAPI
      .getAll(params)
      .then((res) => {
        setAuctions(res.data.data || []);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [filters]);

  return (
    <>
      <div className="bg-dark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold text-white">
            Browse Auctions
          </h1>
          <p className="text-gray-400 mt-2">
            Discover extraordinary items from world-class auction houses
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-100">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
            className="input-field !w-auto !py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="live">Live Now</option>
            <option value="scheduled">Upcoming</option>
            <option value="ended">Ended</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value, page: 1 })
            }
            className="input-field !w-auto !py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="input-field !w-auto !py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="ending-soon">Ending Soon</option>
            <option value="most-bids">Most Bids</option>
          </select>
          <span className="ml-auto text-sm text-gray-500">
            {pagination.total} auctions found
          </span>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : auctions.length === 0 ? (
          <div className="text-center py-20">
            <SlidersHorizontal className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No auctions found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((a) => (
                <AuctionCard key={a._id} auction={a} />
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page - 1 })
                  }
                  disabled={filters.page === 1}
                  className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from(
                  { length: Math.min(pagination.pages, 5) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilters({ ...filters, page: p })}
                    className={`h-10 w-10 rounded-lg text-sm font-medium ${p === filters.page ? "bg-gold text-white" : "border hover:bg-gray-50"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page + 1 })
                  }
                  disabled={filters.page >= pagination.pages}
                  className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
