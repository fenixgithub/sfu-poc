// src/app/wiki/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nations, wikiArticles } from "@/data/mock";

type ViewMode = "grid" | "list";

export default function WikiPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [nationFilter, setNationFilter] = useState<string>("all");

  const nationOptions = useMemo(() => {
    return [...nations].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = [...wikiArticles].sort((a, b) => a.title.localeCompare(b.title));

    return base.filter((a) => {
      if (nationFilter !== "all" && a.nationSlug !== nationFilter) return false;
      if (!q) return true;

      const nationName =
        nations.find((n) => n.slug === a.nationSlug)?.name ?? "";

      const haystack = [a.slug, a.title, a.summary, a.nationSlug, nationName, ...(a.tags ?? [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [query, nationFilter]);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Wiki</h1>
          <p className="text-sm text-gray-600">
            Browse lore articles in card (codex) or list (wiki) view.
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

      {/* Search + filter */}
      <div className="grid gap-3 rounded-lg border p-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="sr-only" htmlFor="wiki-search">
            Search wiki
          </label>
          <input
            id="wiki-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wiki (title, summary, tags, slug)…"
            className="field-sfu"
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="wiki-nation">
            Filter by nation
          </label>
          <select
            id="wiki-nation"
            value={nationFilter}
            onChange={(e) => setNationFilter(e.target.value)}
            className="select-sfu"
          >
            <option value="all">All nations</option>
            {nationOptions.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 md:col-span-1">
          <span>
            {filteredArticles.length} / {wikiArticles.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setNationFilter("all");
            }}
            className="rounded-md border px-2 py-1 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No articles match your filters.
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((a) => {
            const nation = nations.find((n) => n.slug === a.nationSlug);

            return (
              <div key={a.slug} className="rounded-lg border p-4">
                <h2 className="font-semibold">
                  <Link className="hover:underline" href={`/wiki/${a.slug}`}>
                    {a.title}
                  </Link>
                </h2>

                <p className="mt-2 text-sm text-gray-600">{a.summary}</p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                  <span className="font-mono">{a.slug}</span>
                  {nation ? <span>{nation.name}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {filteredArticles.map((a) => {
            const nation = nations.find((n) => n.slug === a.nationSlug);

            return (
              <div key={a.slug} className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-semibold">
                    <Link className="hover:underline" href={`/wiki/${a.slug}`}>
                      {a.title}
                    </Link>
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">{a.slug}</span>
                </div>

                <p className="mt-1 text-sm text-gray-600">{a.summary}</p>

                {nation ? (
                  <div className="mt-2 text-xs text-gray-500">{nation.name}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}