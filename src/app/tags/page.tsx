// src/app/tags/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nations, tanks, wikiArticles } from "@/data/mock";

type TagCount = {
  tag: string;
  nations: number;
  tanks: number;
  articles: number;
  total: number;
};

export default function TagsPage() {
  const [query, setQuery] = useState("");

  const tagCounts = useMemo<TagCount[]>(() => {
    const map = new Map<string, TagCount>();

    const touch = (tag: string) => {
      if (!map.has(tag)) {
        map.set(tag, { tag, nations: 0, tanks: 0, articles: 0, total: 0 });
      }
      return map.get(tag)!;
    };

    for (const n of nations) {
      for (const t of n.tags ?? []) {
        const row = touch(t);
        row.nations += 1;
        row.total += 1;
      }
    }

    for (const tnk of tanks) {
      for (const t of tnk.tags ?? []) {
        const row = touch(t);
        row.tanks += 1;
        row.total += 1;
      }
    }

    for (const a of wikiArticles) {
      for (const t of a.tags ?? []) {
        const row = touch(t);
        row.articles += 1;
        row.total += 1;
      }
    }

    const list = Array.from(map.values()).sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.tag.localeCompare(b.tag);
    });

    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((x) => x.tag.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Tags</h1>
        <p className="text-sm text-gray-600">
          Browse tags across nations, tanks, and wiki articles.
        </p>
      </div>

      <div className="rounded-lg border p-3">
        <label className="sr-only" htmlFor="tag-search">
          Search tags
        </label>
        <input
          id="tag-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tags (e.g. late-cold-war)…"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {tagCounts.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No tags found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-2 border-b bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">
            <div>Tag</div>
            <div className="text-right">Total</div>
            <div className="text-right">Nations</div>
            <div className="text-right">Tanks</div>
            <div className="text-right">Wiki</div>
          </div>

          <div className="divide-y">
            {tagCounts.map((t) => (
              <div
                key={t.tag}
                className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-2 px-4 py-3 text-sm"
              >
                <div>
                  <Link
                    href={`/tags/${encodeURIComponent(t.tag)}`}
                    className="font-medium hover:underline"
                  >
                    #{t.tag}
                  </Link>
                </div>
                <div className="text-right tabular-nums text-gray-700">
                  {t.total}
                </div>
                <div className="text-right tabular-nums text-gray-700">
                  {t.nations}
                </div>
                <div className="text-right tabular-nums text-gray-700">
                  {t.tanks}
                </div>
                <div className="text-right tabular-nums text-gray-700">
                  {t.articles}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}