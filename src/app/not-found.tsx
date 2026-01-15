// src/app/not-found.tsx
import Link from "next/link";

/**
 * Global not-found page.
 * This renders when you call notFound() in any route, or when a route doesn't exist.
 */
export default function NotFound() {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-sm text-gray-600">
          The page you’re looking for doesn’t exist (or it used to, and got moved).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50" href="/">
          Home
        </Link>
        <Link
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
          href="/nations"
        >
          Nations
        </Link>
        <Link className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50" href="/tanks">
          Tanks
        </Link>
        <Link className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50" href="/wiki">
          Wiki
        </Link>
      </div>

      <div className="text-xs text-gray-500">
        Tip: if you got here by clicking a link inside the site, that slug probably doesn’t exist in
        your mock data yet.
      </div>
    </div>
  );
}