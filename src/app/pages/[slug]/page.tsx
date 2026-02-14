"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { pageAPI } from "@/lib/api";

export default function StaticPage() {
  const params = useParams();
  const [page, setPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    pageAPI
      .getBySlug(params.slug as string)
      .then((res) => setPage(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [params.slug]);

  if (isLoading)
    return (
      <>
        <PageLoader />
      </>
    );
  if (!page)
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">Page not found</p>
        </div>
      </>
    );

  return (
    <>
      <div className="bg-dark py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold text-white">
            {page.title}
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </>
  );
}
