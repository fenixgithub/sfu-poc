// src/app/tanks/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nations, tanks } from "@/data/mock";

type ViewMode = "grid" | "list";

export default function TanksPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [nationFilter, setNationFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [eraFilter, setEraFilter] = useState<string>("all");

  const nationOptions = useMemo(() => {
    return [...nations].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const roleOptions = useMemo(() => {
    return Array.from(new Set(tanks.map((t) => t.role))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  const eraOptions = useMemo(() => {
    return Array.from(new Set(tanks.map((t) => t.era))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  const filteredTanks = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = [...tanks].sort((a, b) => {
      const aKey = `${a.name} ${a.designation ?? ""}`.trim();
      const bKey = `${b.name} ${b.designation ?? ""}`.trim();
      return aKey.localeCompare(bKey);
    });

    return base.filter((t) => {
      if (nationFilter !== "all" && t.nationSlug !== nationFilter) return false;
      if (roleFilter !== "all" && t.role !== roleFilter) return false;
      if (eraFilter !== "all" && t.era !== eraFilter) return false;

      if (!q) return true;

      const nationName =
        nations.find((n) => n.slug === t.nationSlug)?.name ?? "";

      const haystack = [
        t.slug,
        t.name,
        t.designation ?? "",
        t.role,
        t.era,
        nationName,
        ...(t.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [query, nationFilter, roleFilter, eraFilter]);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tanks</h1>
          <p className="text-sm text-gray-600">
            Browse tanks in card (codex) or list (wiki) view.
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

      {/* Search + filters */}
      <div className="grid gap-3 rounded-lg border p-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="sr-only" htmlFor="tank-search">
            Search tanks
          </label>
          <input
            id="tank-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tanks (name, designation, role, era, tags)…"
            className="field-sfu"
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="tank-nation">
            Filter by nation
          </label>
          <select
            id="tank-nation"
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

        <div className="grid grid-cols-2 gap-3 md:col-span-1 md:grid-cols-1">
          <div>
            <label className="sr-only" htmlFor="tank-role">
              Filter by role
            </label>
            <select
              id="tank-role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select-sfu"
            >
              <option value="all">All roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="sr-only" htmlFor="tank-era">
              Filter by era
            </label>
            <select
              id="tank-era"
              value={eraFilter}
              onChange={(e) => setEraFilter(e.target.value)}
              className="select-sfu"
            >
              <option value="all">All eras</option>
              {eraOptions.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {filteredTanks.length} / {tanks.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setNationFilter("all");
              setRoleFilter("all");
              setEraFilter("all");
            }}
            className="rounded-md border px-2 py-1 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredTanks.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No tanks match your filters.
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTanks.map((t) => {
            const nation = nations.find((n) => n.slug === t.nationSlug);
            const displayName = `${t.designation ? `${t.designation} ` : ""}${t.name}`;

            return (
              <div key={t.slug} className="rounded-lg border p-4">
                <h2 className="font-semibold">
                  <Link className="hover:underline" href={`/tanks/${t.slug}`}>
                    {displayName}
                  </Link>
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {t.role} · {t.era}
                  {nation ? ` · ${nation.name}` : ""}
                </p>

                <div className="mt-3 text-xs text-gray-500">
                  Slug: <span className="font-mono">{t.slug}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {filteredTanks.map((t) => {
            const nation = nations.find((n) => n.slug === t.nationSlug);
            const displayName = `${t.designation ? `${t.designation} ` : ""}${t.name}`;

            return (
              <div key={t.slug} className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-semibold">
                    <Link className="hover:underline" href={`/tanks/${t.slug}`}>
                      {displayName}
                    </Link>
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">{t.slug}</span>
                </div>

                <p className="mt-1 text-sm text-gray-600">
                  {t.role} · {t.era}
                  {nation ? ` · ${nation.name}` : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}