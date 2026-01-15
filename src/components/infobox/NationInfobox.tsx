// src/components/infobox/NationInfobox.tsx
import { Nation } from "@/data/mock";
import { InfoboxCard } from "./InfoboxCard";
import { InfoboxRow } from "./InfoboxRow";
import { TagPills } from "@/components/tags/TagPills";

export function NationInfobox({ nation }: { nation: Nation }) {
  return (
    <InfoboxCard title="Nation Infobox">
      <dl className="space-y-3 text-sm">
        <InfoboxRow label="Slug" value={nation.slug} mono />
        <InfoboxRow label="Doctrine" value={nation.doctrine} />
        <InfoboxRow label="Industry" value={nation.industry} />
        <InfoboxRow label="Design Philosophy" value={nation.designPhilosophy} />
      </dl>

      <div className="mt-4 space-y-2">
        <div className="text-xs text-gray-500">Tags</div>
        <TagPills tags={nation.tags} />
      </div>
    </InfoboxCard>
  );
}