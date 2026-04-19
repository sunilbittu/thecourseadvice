import institutes from "@/lib/data/institutes.json";

const INSTITUTE_ALIASES: Record<string, string[]> = {
  "aswini-bajaj-classes": ["aswini bajaj classes"],
  "london-school-of-economics": ["london school of economics", "lse"],
  "mit-professional-education": ["mit professional education", "mit"],
  "national-university-of-singapore": ["national university of singapore", "nus", "singapore"],
  "eth-zurich": ["eth zurich", "zurich"],
  "university-of-sydney": ["university of sydney", "sydney"],
  "paris-school-of-design": ["paris school of design", "paris design"],
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function getInstituteSlugByCourseInstitution(institutionName: string): string | null {
  const normalizedName = normalize(institutionName);

  const direct = institutes.find((item) => normalize(item.name) === normalizedName);
  if (direct) return direct.slug;

  for (const item of institutes) {
    const aliases = INSTITUTE_ALIASES[item.slug] ?? [];
    if (aliases.includes(normalizedName)) {
      return item.slug;
    }
  }

  return null;
}

export function getInstitutionAliasesBySlug(slug: string): string[] {
  const institute = institutes.find((item) => item.slug === slug);
  if (!institute) return [];

  const aliases = INSTITUTE_ALIASES[slug] ?? [];
  return [normalize(institute.name), ...aliases];
}
