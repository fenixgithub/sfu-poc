// src/components/infobox/InfoboxRow.tsx
export function InfoboxRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className={mono ? "font-mono" : "text-gray-700"}>{value || "—"}</dd>
    </div>
  );
}