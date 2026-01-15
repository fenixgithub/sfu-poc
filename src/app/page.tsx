// src/app/page.tsx
import Link from "next/link";
import { tanks, wikiArticles, nations } from "@/data/mock";

export default function HomePage() {
  return (
    <main>
      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Welcome</h2>
          <p className="text-sm text-gray-600">
            This is the SFU proof-of-concept site. Content is mocked locally for
            now.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Latest Tanks</h3>
            <ul className="mt-2 space-y-2">
              {tanks.slice(0, 2).map((tank) => {
                const nation = nations.find((n) => n.slug === tank.nationSlug);

                return (
                  <li key={tank.slug}>
                    <Link
                      href={`/tanks/${tank.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {tank.designation ? `${tank.designation} ` : ""}
                      {tank.name}
                    </Link>

                    <p className="text-xs text-gray-600">
                      {tank.role} · {tank.era}
                      {nation ? ` · ${nation.name}` : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Latest Lore</h3>
            <ul className="mt-2 space-y-2">
              {wikiArticles.slice(0, 2).map((article) => {
                const nation = nations.find((n) => n.slug === article.nationSlug);

                return (
                  <li key={article.slug}>
                    <Link
                      href={`/wiki/${article.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {article.title}
                    </Link>

                    <p className="text-xs text-gray-600">
                      {article.summary}
                      {nation ? ` · ${nation.name}` : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}