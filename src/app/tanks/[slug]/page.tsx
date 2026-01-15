// src/app/tanks/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { nations, tanks, wikiArticles } from "@/data/mock";
import { InfoboxCard } from "@/components/infobox/InfoboxCard";
import { InfoboxRow } from "@/components/infobox/InfoboxRow";
import { TagPills } from "@/components/tags/TagPills";

export function generateStaticParams() {
  return tanks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tank = tanks.find((t) => t.slug === slug);

  if (!tank) {
    return { title: "Tank Not Found — SFU" };
  }

  const nation = nations.find((n) => n.slug === tank.nationSlug);
  const displayName = `${tank.designation ? `${tank.designation} ` : ""}${tank.name}`;

  return {
    title: `${displayName} — SFU`,
    description: `${tank.role} · ${tank.era}${nation ? ` · ${nation.name}` : ""}`,
  };
}

export default async function TankDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tank = tanks.find((t) => t.slug === slug);
  if (!tank) notFound();

  const nation = nations.find((n) => n.slug === tank.nationSlug);

  const relatedArticles = wikiArticles.filter(
    (a) => a.nationSlug === tank.nationSlug
  );

  const displayName = `${tank.designation ? `${tank.designation} ` : ""}${tank.name}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link href="/tanks" className="text-sm text-gray-600 hover:underline">
          ← Back to Tanks
        </Link>

        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {tank.role} · {tank.era}
            {nation ? ` · ${nation.name}` : ""}
          </p>
        </div>

        <TagPills tags={tank.tags} />
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Infobox */}
        <InfoboxCard title="Tank Infobox">
          <dl className="space-y-3 text-sm">
            <InfoboxRow label="Slug" value={tank.slug} mono />
            <InfoboxRow label="Designation" value={tank.designation ?? "—"} />
            <InfoboxRow label="Role" value={tank.role} />
            <InfoboxRow label="Era" value={tank.era} />
            <InfoboxRow
              label="Nation"
              value={nation?.name ?? tank.nationSlug}
            />
          </dl>

          <div className="mt-4 space-y-2">
            <div className="text-xs text-gray-500">Tags</div>
            <TagPills tags={tank.tags} />
          </div>

          {nation && (
            <div className="mt-4">
              <Link
                href={`/nations/${nation.slug}`}
                className="text-sm font-medium hover:underline"
              >
                View Nation →
              </Link>
            </div>
          )}
        </InfoboxCard>

        {/* Main content */}
        <section className="space-y-6 min-w-0">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Overview</h2>
            <p className="mt-2 text-sm text-gray-600">
              POC placeholder. This is where tank development history,
              operational doctrine, variants, and specifications would go.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Related Lore</h2>

            {relatedArticles.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">
                No lore articles linked to this tank’s nation yet.
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
        </section>
      </div>
    </div>
  );
}