// src/components/nav/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { nations, tanks, wikiArticles } from "@/data/mock";

/**
 * Breadcrumbs for your POC.
 * - Uses current path from usePathname()
 * - Converts known slugs into human-readable titles via mock data
 *
 * This is intentionally simple and deterministic:
 * - No async lookups
 * - No complex route configs
 */
function labelForSegment(segment: string, previousSegment?: string) {
  // Static section labels
  if (segment === "nations") return "Nations";
  if (segment === "tanks") return "Tanks";
  if (segment === "wiki") return "Wiki";

  // Dynamic labels: if the previous segment is a section, interpret segment as a slug.
  if (previousSegment === "nations") {
    return nations.find((n) => n.slug === segment)?.name ?? segment;
  }

  if (previousSegment === "tanks") {
    const tank = tanks.find((t) => t.slug === segment);
    if (!tank) return segment;
    return `${tank.designation ? `${tank.designation} ` : ""}${tank.name}`;
  }

  if (previousSegment === "wiki") {
    return wikiArticles.find((a) => a.slug === segment)?.title ?? segment;
  }

  // Fallback: show raw segment
  return segment;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  // Example pathname: "/nations/aurelion"
  const segments = pathname.split("/").filter(Boolean);

  // Always start with Home
  const crumbs = [
    {
      href: "/",
      label: "Home",
    },
  ];

  // Build up href segment by segment
  let runningPath = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const prev = i > 0 ? segments[i - 1] : undefined;

    runningPath += `/${seg}`;
    crumbs.push({
      href: runningPath,
      label: labelForSegment(seg, prev),
    });
  }

  // Hide breadcrumbs on homepage
  if (segments.length === 0) return null;

  return (
    <nav className="text-xs text-gray-600">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;

          return (
            <li key={c.href} className="flex items-center gap-1">
              {idx > 0 ? <span className="text-gray-400">→</span> : null}

              {isLast ? (
                <span className="font-medium text-gray-800">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}