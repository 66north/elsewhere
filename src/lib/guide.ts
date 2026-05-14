/**
 * Guide helpers — parse frontmatter, extract headings, generate schemas.
 */

export interface GuideData {
  slug: string;
  title: string;
  category: string;
  gens?: string[];
  engines?: string[];
  difficulty?: 'easy' | 'moderate' | 'hard';
  time_minutes?: number;
  cost_min_eur?: number;
  cost_max_eur?: number;
  parts?: Array<{
    name: string;
    oem: string;
    spec: string;
    notes?: string;
    verify?: boolean;
  }>;
  torque_specs?: Array<{
    component: string;
    value: number;
    unit: string;
    notes?: string;
  }>;
  last_reviewed?: string;
  related?: string[];
  contributors?: string[];
}

export interface Heading {
  level: number;
  text: string;
  slug: string;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
};

const DIFFICULTY_ESTIMATE_MINUTES: Record<string, number> = {
  easy: 30,
  moderate: 60,
  hard: 120,
};

/** Extract headings (H2 and H3) from HTML content. */
export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /<h([23])[^>]*>([^<]+)<\/h\1>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].trim();
    const slug = slugify(text);

    headings.push({ level, text, slug });
  }

  return headings;
}

/** Convert text to URL slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Get difficulty label for a guide. */
export function getDifficultyLabel(difficulty?: string): string {
  if (!difficulty) return 'Unknown';
  return DIFFICULTY_LABELS[difficulty] || difficulty;
}

/** Get skill level (string) for HowTo schema. */
export function getSkillLevel(difficulty?: string): string {
  if (!difficulty) return 'Intermediate';
  switch (difficulty) {
    case 'easy':
      return 'Beginner';
    case 'moderate':
      return 'Intermediate';
    case 'hard':
      return 'Expert';
    default:
      return 'Intermediate';
  }
}

/** Estimate total time including preparation. */
export function estimateTime(timeMins?: number, difficulty?: string): number {
  if (timeMins) return timeMins;
  if (difficulty && difficulty in DIFFICULTY_ESTIMATE_MINUTES) {
    return DIFFICULTY_ESTIMATE_MINUTES[difficulty];
  }
  return 60;
}

/** Generate HowTo JSON-LD schema for a guide. */
export function generateHowToSchema(
  guide: GuideData,
  url: string
): Record<string, unknown> {
  const totalTime = estimateTime(guide.time_minutes, guide.difficulty);
  const estimatedCost = guide.cost_max_eur
    ? {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: String(guide.cost_max_eur),
      }
    : undefined;

  const tools =
    guide.torque_specs?.map((spec) => ({
      '@type': 'HowToTool',
      name: spec.component,
    })) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: `${guide.title} for Mitsubishi Pajero ${guide.gens?.join(', ')}`,
    url,
    totalTime: `PT${totalTime}M`,
    estimatedCost,
    tool: tools,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Read the guide',
        text: 'Follow the detailed steps in the guide below',
      },
    ],
  };
}

/** Get related guides with titles. */
export async function getRelatedGuides(
  related?: string[]
): Promise<Array<{ slug: string; title: string }>> {
  if (!related || related.length === 0) return [];

  // In a real app, this would fetch full guide metadata
  // For now, return placeholders that will be filled at runtime
  return related.map((slug) => ({
    slug,
    title: slug.replace(/-/g, ' '), // Placeholder
  }));
}
