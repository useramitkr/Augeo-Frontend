"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { categoryAPI } from "@/lib/api";
import { Category } from "@/types";
import { Grid3x3 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading)
    return (
      <>
        <PageLoader />
      </>
    );
  return (
    <>
      <div className="bg-dark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold text-white">
            Categories
          </h1>
          <p className="text-gray-400 mt-2">Browse auctions by category</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/categories/${cat.slug}`}>
              <div className="relative group rounded-xl overflow-hidden bg-dark h-48 flex items-center justify-center hover:shadow-xl transition-all">
                {cat.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-dark-light to-dark" />
                )}
                <div className="relative text-center z-10 p-4">
                  <h3 className="text-white font-heading font-bold text-xl mb-1">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-gray-300 text-sm">{cat.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="text-center py-20">
            <Grid3x3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No categories available</p>
          </div>
        )}
      </div>
    </>
  );
}
