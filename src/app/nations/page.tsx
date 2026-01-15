// src/app/nations/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nations } from "@/data/mock";

type ViewMode = "grid" | "list";

export default function NationsPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");

  const filteredNations = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = [...nations].sort((a, b) => a.name.localeCompare(b.name));

    if (!q) return base;

    return base.filter((n) => {
      const haystack = [
        n.name,
        n.summary,
        n.slug,
        ...(n.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [query]);

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

      {/* Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
        <div className="min-w-[220px] flex-1">
          <label className="sr-only" htmlFor="nation-search">
            Search nations
          </label>
          <input
            id="nation-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nations (name, summary, tags, slug)…"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="text-xs text-gray-500">
          {filteredNations.length} / {nations.length}
        </div>
      </div>

      {/* Content */}
      {filteredNations.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No nations match your search.
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNations.map((n) => (
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
          {filteredNations.map((n) => (
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