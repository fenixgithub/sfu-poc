// src/app/tags/[tag]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { nations, tanks, wikiArticles } from "@/data/mock";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  return {
    title: `#${decoded} — Tags — SFU`,
    description: `Content tagged with #${decoded}.`,
  };
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const taggedNations = nations.filter((n) => (n.tags ?? []).includes(decoded));
  const taggedTanks = tanks.filter((t) => (t.tags ?? []).includes(decoded));
  const taggedArticles = wikiArticles.filter((a) =>
    (a.tags ?? []).includes(decoded)
  );

  // If a tag exists nowhere, treat it as not found.
  if (
    taggedNations.length === 0 &&
    taggedTanks.length === 0 &&
    taggedArticles.length === 0
  ) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link href="/tags" className="text-sm text-gray-600 hover:underline">
          ← Back to Tags
        </Link>

        <div>
          <h1 className="text-2xl font-bold">#{decoded}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {taggedNations.length} nations · {taggedTanks.length} tanks ·{" "}
            {taggedArticles.length} articles
          </p>
        </div>

        {/* Quick jump into filtered lists (optional but handy) */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/nations?tag=${encodeURIComponent(decoded)}`}
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
          >
            View in Nations
          </Link>
          <Link
            href={`/tanks?tag=${encodeURIComponent(decoded)}`}
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
          >
            View in Tanks
          </Link>
          <Link
            href={`/wiki?tag=${encodeURIComponent(decoded)}`}
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
          >
            View in Wiki
          </Link>
        </div>
      </div>

      {/* Nations */}
      <div className="rounded-lg border p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-semibold">Nations</h2>
          <span className="text-xs text-gray-500">{taggedNations.length}</span>
        </div>

        {taggedNations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">None.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {taggedNations.map((n) => (
              <li key={n.slug} className="rounded-md border p-3">
                <Link
                  href={`/nations/${n.slug}`}
                  className="text-sm font-medium hover:underline"
                >
                  {n.name}
                </Link>
                <p className="mt-1 text-xs text-gray-600">{n.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tanks */}
      <div className="rounded-lg border p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-semibold">Tanks</h2>
          <span className="text-xs text-gray-500">{taggedTanks.length}</span>
        </div>

        {taggedTanks.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">None.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {taggedTanks.map((t) => (
              <li key={t.slug} className="rounded-md border p-3">
                <Link
                  href={`/tanks/${t.slug}`}
                  className="text-sm font-medium hover:underline"
                >
                  {t.designation ? `${t.designation} ` : ""}
                  {t.name}
                </Link>
                <p className="mt-1 text-xs text-gray-600">
                  {t.role} · {t.era}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Wiki */}
      <div className="rounded-lg border p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-semibold">Wiki Articles</h2>
          <span className="text-xs text-gray-500">{taggedArticles.length}</span>
        </div>

        {taggedArticles.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">None.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {taggedArticles.map((a) => (
              <li key={a.slug} className="rounded-md border p-3">
                <Link
                  href={`/wiki/${a.slug}`}
                  className="text-sm font-medium hover:underline"
                >
                  {a.title}
                </Link>
                <p className="mt-1 text-xs text-gray-600">{a.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}