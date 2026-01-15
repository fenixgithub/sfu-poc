// src/app/nations/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { nations, tanks, wikiArticles } from "@/data/mock";
import { NationInfobox } from "@/components/infobox/NationInfobox";
import { TagPills } from "@/components/tags/TagPills";

export function generateStaticParams() {
  return nations.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nation = nations.find((n) => n.slug === slug);

  if (!nation) {
    return { title: "Nation Not Found — SFU" };
  }

  return {
    title: `${nation.name} — SFU`,
    description: nation.summary,
  };
}

function relatedByTags<T extends { slug: string; tags: string[] }>(
  baseTags: string[],
  items: T[],
  excludeSlug?: string
) {
  const base = new Set(baseTags);
  return items
    .filter((i) => i.slug !== excludeSlug)
    .map((i) => {
      const overlap = i.tags?.filter((t) => base.has(t)) ?? [];
      return { item: i, score: overlap.length, overlap };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}

export default async function NationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const nation = nations.find((n) => n.slug === slug);
  if (!nation) notFound();

  const relatedTanks = tanks
    .filter((t) => t.nationSlug === nation.slug)
    .sort((a, b) => a.name.localeCompare(b.name));

  const relatedArticles = wikiArticles
    .filter((a) => a.nationSlug === nation.slug)
    .sort((a, b) => a.title.localeCompare(b.title));

  // “Related by tags” (cross-links)
  const tanksByTags = relatedByTags(nation.tags, tanks);
  const articlesByTags = relatedByTags(nation.tags, wikiArticles);

  // Optional: “related nations” by tag overlap
  const nationsByTags = relatedByTags(nation.tags, nations, nation.slug);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link href="/nations" className="text-sm text-gray-600 hover:underline">
          ← Back to Nations
        </Link>

        <div>
          <h1 className="text-2xl font-bold">{nation.name}</h1>
          <p className="mt-1 text-sm text-gray-600">{nation.summary}</p>
        </div>

        <TagPills tags={nation.tags} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <NationInfobox nation={nation} />

        <section className="space-y-6 min-w-0">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Doctrine & Approach</h2>
            <p className="mt-2 text-sm text-gray-600">{nation.doctrine}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold">Industry</h2>
              <p className="mt-2 text-sm text-gray-600">{nation.industry}</p>
            </div>

            <div className="rounded-lg border p-4">
              <h2 className="font-semibold">Design Philosophy</h2>
              <p className="mt-2 text-sm text-gray-600">
                {nation.designPhilosophy}
              </p>
            </div>
          </div>

          {/* Related Tanks (by nation) */}
          <div className="rounded-lg border p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">Related Tanks</h2>
              <span className="text-xs text-gray-500">
                {relatedTanks.length} found
              </span>
            </div>

            {relatedTanks.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">
                No tanks linked to this nation yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {relatedTanks.map((tank) => (
                  <li key={tank.slug} className="rounded-md border p-3">
                    <Link
                      href={`/tanks/${tank.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {tank.designation ? `${tank.designation} ` : ""}
                      {tank.name}
                    </Link>
                    <p className="mt-1 text-xs text-gray-600">
                      {tank.role} · {tank.era}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Related Lore (by nation) */}
          <div className="rounded-lg border p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">Related Lore</h2>
              <span className="text-xs text-gray-500">
                {relatedArticles.length} found
              </span>
            </div>

            {relatedArticles.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">
                No lore articles linked to this nation yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {relatedArticles.map((a) => (
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

          {/* Cross-links by tags (optional but very "wiki") */}
            <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
                <h2 className="font-semibold">Also Relevant Tanks</h2>
                {tanksByTags.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600">Nothing yet.</p>
                ) : (
                <ul className="mt-3 space-y-2">
                    {tanksByTags.slice(0, 3).map(({ item, overlap }) => (
                    <li key={item.slug} className="text-sm">
                        <Link
                        href={`/tanks/${item.slug}`}
                        className="font-medium hover:underline"
                        >
                        {item.designation ? `${item.designation} ` : ""}
                        {item.name}
                        </Link>

                        <div className="mt-1">
                        <TagPills tags={overlap} />
                        </div>
                    </li>
                    ))}
                </ul>
                )}
            </div>

            <div className="rounded-lg border p-4">
                <h2 className="font-semibold">Also Relevant Articles</h2>
                {articlesByTags.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600">Nothing yet.</p>
                ) : (
                <ul className="mt-3 space-y-2">
                    {articlesByTags.slice(0, 3).map(({ item, overlap }) => (
                    <li key={item.slug} className="text-sm">
                        <Link
                        href={`/wiki/${item.slug}`}
                        className="font-medium hover:underline"
                        >
                        {item.title}
                        </Link>

                        <div className="mt-1">
                        <TagPills tags={overlap} />
                        </div>
                    </li>
                    ))}
                </ul>
                )}
            </div>
            </div>

          {/* Related Nations by tags */}
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Related Nations</h2>
            {nationsByTags.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">
                No overlap-based relations yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {nationsByTags.slice(0, 3).map(({ item, overlap }) => (
                  <li key={item.slug} className="rounded-md border p-3">
                    <Link
                      href={`/nations/${item.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {(item as any).name ?? item.slug}
                    </Link>
                    <div className="mt-2">
                      <TagPills tags={overlap} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}