// src/components/search/GlobalSearch.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { nations, tanks, wikiArticles } from "@/data/mock";

/**
 * Universal search across Nations, Tanks, and Wiki.
 * POC rules:
 * - purely client-side
 * - searches name/title/summary/slug/tags
 * - shows a small dropdown with top results
 */

type ResultType = "nation" | "tank" | "wiki";

type SearchResult = {
  type: ResultType;
  slug: string;
  title: string;
  subtitle: string;
  href: string;
};

function normalize(s: string) {
  return s.toLowerCase();
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim();
    if (q.length === 0) return [];

    const needle = normalize(q);

    const nationResults: SearchResult[] = nations
      .filter((n) => {
        const haystack = normalize(
          [n.slug, n.name, n.summary, ...(n.tags ?? [])].join(" ")
        );
        return haystack.includes(needle);
      })
      .map((n) => ({
        type: "nation",
        slug: n.slug,
        title: n.name,
        subtitle: n.summary,
        href: `/nations/${n.slug}`,
      }));

    const tankResults: SearchResult[] = tanks
      .filter((t) => {
        const nationName =
          nations.find((n) => n.slug === t.nationSlug)?.name ?? "";
        const displayName = `${t.designation ? `${t.designation} ` : ""}${t.name}`;

        const haystack = normalize(
          [
            t.slug,
            displayName,
            t.role,
            t.era,
            nationName,
            ...(t.tags ?? []),
          ].join(" ")
        );

        return haystack.includes(needle);
      })
      .map((t) => {
        const nationName =
          nations.find((n) => n.slug === t.nationSlug)?.name ?? t.nationSlug;

        const displayName = `${t.designation ? `${t.designation} ` : ""}${t.name}`;

        return {
          type: "tank",
          slug: t.slug,
          title: displayName,
          subtitle: `${t.role} · ${t.era} · ${nationName}`,
          href: `/tanks/${t.slug}`,
        };
      });

    const wikiResults: SearchResult[] = wikiArticles
      .filter((a) => {
        const nationName =
          nations.find((n) => n.slug === a.nationSlug)?.name ?? "";
        const haystack = normalize(
          [a.slug, a.title, a.summary, nationName, ...(a.tags ?? [])].join(" ")
        );
        return haystack.includes(needle);
      })
      .map((a) => {
        const nationName =
          nations.find((n) => n.slug === a.nationSlug)?.name ?? a.nationSlug;

        return {
          type: "wiki",
          slug: a.slug,
          title: a.title,
          subtitle: `${a.summary} · ${nationName}`,
          href: `/wiki/${a.slug}`,
        };
      });

    // Lightweight ranking:
    // - Prefer matches where title contains the needle
    // - Then by shorter titles (often more direct)
    const all = [...nationResults, ...tankResults, ...wikiResults];

    const score = (r: SearchResult) => {
      const title = normalize(r.title);
      if (title === needle) return 100;
      if (title.startsWith(needle)) return 75;
      if (title.includes(needle)) return 50;
      return 10;
    };

    return all
      .sort((a, b) => {
        const sa = score(a);
        const sb = score(b);
        if (sb !== sa) return sb - sa;
        return a.title.length - b.title.length;
      })
      .slice(0, 8);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const hasResults = results.length > 0;
  const showDropdown = open && (query.trim().length > 0);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-md border bg-black/20 px-3 py-2 text-gray-100">
        <span className="text-xs text-gray-400">Search</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Nations, tanks, wiki…"
          className="w-full bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none"
        />
        {query.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
              setOpen(true);
            }}
            className="rounded px-2 py-1 text-xs text-gray-300 hover:bg-white/10"
            aria-label="Clear search"
          >
            Clear
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border bg-black/90 shadow-sm backdrop-blur">
          {hasResults ? (
            <ul className="divide-y">
              {results.map((r) => (
                <li key={`${r.type}:${r.slug}`}>
                  <Link
                    href={r.href}
                    className="block p-3 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-sm font-medium text-gray-100">{r.title}</div>
                      <span className="rounded-md border bg-white/5 px-2 py-0.5 text-[10px] text-gray-300">
                        {r.type}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-300">
                      {r.subtitle}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-gray-300">No results.</div>
          )}

          <div className="border-t border-white/10 p-2 text-[11px] text-gray-400">
            Tip: try searching by slug (e.g. <span className="font-mono">aurelion</span>)
            or tags.
          </div>
        </div>
      ) : null}
    </div>
  );
}