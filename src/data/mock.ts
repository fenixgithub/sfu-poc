// src/data/mock.ts
// POC-only mock data. This will be replaced by Supabase later.

export type Nation = {
  slug: string;
  name: string;
  summary: string;
  doctrine: string;
  industry: string;
  designPhilosophy: string
  tags: string[];
};

export type Tank = {
  slug: string;
  name: string;
  designation?: string;
  nationSlug: string;
  role: string;
  era: string;
  tags: string[];
};

export type WikiArticle = {
  slug: string;
  title: string;
  nationSlug: string;
  summary: string;
  tags: string[];
};

export const nations: Nation[] = [
  {
    slug: "aurelion",
    name: "Republic of Aurelion",
    summary:
      "A mid-industrial continental power emphasizing survivability and deliberate armored advances.",
    doctrine:
      "Deliberate armored advances supported by artillery; centralized command; medium-range engagements.",
    industry:
      "Mature heavy manufacturing; conservative electronics; reliable engines and metallurgy.",
    designPhilosophy:
      "Frontal armor and crew survivability prioritized; mobility is secondary; autoloaders are rare.",
    tags: ["survivability", "artillery", "centralized", "mid-industrial"],
  },
  {
    slug: "virex-compact",
    name: "Virex Compact",
    summary:
      "A mobile alliance prioritizing rapid maneuver warfare and aggressive exploitation.",
    doctrine:
      "Fast breakthroughs and flanking actions; distributed initiative at lower echelons; tempo as a weapon.",
    industry:
      "Moderate industrial base with strong standardization; rapid iteration favored over perfect quality.",
    designPhilosophy:
      "Mobility and firepower prioritized; armor is optimized and selective; systems are streamlined.",
    tags: ["maneuver", "tempo", "standardization", "rapid-iteration"],
  },
];

export const tanks: Tank[] = [
  {
    slug: "t17-brasshound",
    name: "Brasshound",
    designation: "T-17",
    nationSlug: "aurelion",
    role: "Heavy Tank",
    era: "Late Cold War",
    tags: ["heavy", "survivability", "frontal-armor", "late-cold-war"],
  },
  {
    slug: "m4-strix",
    name: "Strix",
    designation: "M-4",
    nationSlug: "virex-compact",
    role: "MBT",
    era: "Late Cold War",
    tags: ["mbt", "mobility", "maneuver", "late-cold-war"],
  },
];

export const wikiArticles: WikiArticle[] = [
  {
    slug: "border-wars-overview",
    title: "Border Wars (Overview)",
    nationSlug: "aurelion",
    summary: "A series of frontier clashes that reshaped Aurelion’s armored doctrine.",
    tags: ["border-wars", "doctrine", "artillery"],
  },
  {
    slug: "compact-maneuver-theory",
    title: "Compact Maneuver Theory",
    nationSlug: "virex-compact",
    summary: "The doctrinal foundation for the Compact’s rapid breakthrough operations.",
    tags: ["doctrine", "maneuver", "tempo"],
  },
];