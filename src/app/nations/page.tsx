// src/app/nations/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nations } from "@/data/mock";

type ViewMode = "grid" | "list";

export default function NationsPage() {
  const [view, setView] = useState<ViewMode>("grid");

  const sortedNations = useMemo(() => {
    // Keeping this predictable: sort alphabetically.
    return [...nations].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Nations</h1>
          <p className="text-sm text-gray-600">
            Browse nations in card (codex) or list (wiki) view.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 rounded-lg border p-1 text-sm">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`rounded-md px-3 py-1 ${
              view === "grid" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-md px-3 py-1 ${
              view === "list" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedNations.map((n) => (
            <div key={n.slug} className="rounded-lg border p-4">
              <h2 className="font-semibold">
                <Link className="hover:underline" href={`/nations/${n.slug}`}>
                  {n.name}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-gray-600">{n.summary}</p>

              <div className="mt-3 text-xs text-gray-500">
                Slug: <span className="font-mono">{n.slug}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {sortedNations.map((n) => (
            <div key={n.slug} className="p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold">
                  <Link className="hover:underline" href={`/nations/${n.slug}`}>
                    {n.name}
                  </Link>
                </h2>
                <span className="text-xs text-gray-500 font-mono">{n.slug}</span>
              </div>

              <p className="mt-1 text-sm text-gray-600">{n.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}