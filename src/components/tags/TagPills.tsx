// src/components/tags/TagPills.tsx
import Link from "next/link";

export function TagPills({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Link
          key={t}
          href={`/tags/${encodeURIComponent(t)}`}
          className="rounded-md border bg-gray-50 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-100"
          title={`View tag: ${t}`}
        >
          #{t}
        </Link>
      ))}
    </div>
  );
}