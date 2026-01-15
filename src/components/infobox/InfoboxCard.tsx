// src/components/infobox/InfoboxCard.tsx
import React from "react";

export function InfoboxCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="h-fit rounded-lg border p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </aside>
  );
}