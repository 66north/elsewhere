export interface BucketListItem {
  slug: string;
  title: string;
  region: string;
  countries: string[];
  status: 'pending' | 'in-progress' | 'visited';
  priority: number;
  description: string;
  difficulty?: string;
  estimated_duration?: number;
  best_season?: string;
  visited_date?: string;
  notes?: string;
  image?: string;
  content?: string;
  latitude: number;
  longitude: number;
}

export const bucketlistItems: BucketListItem[] = [
  {
    slug: 'sahara-crossing',
    title: 'Trans-Sahara Crossing',
    region: 'North Africa',
    countries: ['Morocco', 'Algeria', 'Niger'],
    status: 'pending',
    priority: 1,
    description: 'A multi-week expedition across the Sahara Desert, following ancient caravan routes through the dunes and into Mali or Mauritania.',
    difficulty: 'extreme',
    estimated_duration: 21,
    best_season: 'November to February',
    notes: 'Requires permits, support vehicle, and desert experience. Spectacular and genuinely challenging.',
    image: '/assets/bucketlist-sahara.jpg',
    latitude: 25.5,
    longitude: 0,
  },
  {
    slug: 'pyrenees-traverse',
    title: 'Winter Pyrenees Traverse',
    region: 'Europe',
    countries: ['France', 'Spain', 'Andorra'],
    status: 'pending',
    priority: 2,
    description: 'High mountain pass expedition across the Pyrenees in winter, testing vehicle and driver in extreme conditions.',
    difficulty: 'hard',
    estimated_duration: 7,
    best_season: 'January to March',
    notes: 'Requires winter tires, avalanche awareness, and mountain driving experience. Stunning views, minimal crowds in winter.',
    image: '/assets/bucketlist-pyrenees.jpg',
    latitude: 42.7,
    longitude: 1.0,
  },
  {
    slug: 'faroe-islands',
    title: 'Faroe Islands Expedition',
    region: 'Europe',
    countries: ['Faroe Islands'],
    status: 'visited',
    priority: 1,
    visited_date: '2025-09-15',
    description: 'Remote island chain north of the UK with some of the most dramatic cliffs and valleys in Europe. Excellent for vehicle exploration of small roads and remote valleys.',
    difficulty: 'moderate',
    estimated_duration: 10,
    best_season: 'June to September',
    notes: 'Ferry required from Denmark or Iceland. Roads are narrow and twisting but well-maintained. Incredible scenery, minimal tourists.',
    image: '/assets/bucketlist-faroe.jpg',
    latitude: 61.9,
    longitude: -6.9,
  },
  {
    slug: 'dakar-rally-route',
    title: 'Dakar Rally Heritage Route',
    region: 'North Africa',
    countries: ['Senegal', 'Mali', 'Mauritania'],
    status: 'in-progress',
    priority: 2,
    description: 'Follow historic Dakar Rally stages across the Sahel, exploring the same terrain that challenges rally competitors but at expedition pace.',
    difficulty: 'hard',
    estimated_duration: 14,
    best_season: 'November to March',
    notes: 'Partially planned, support vehicle in place. Routes verified with local guides. Intended as 2026 expedition.',
    image: '/assets/bucketlist-dakar.jpg',
    latitude: 14.5,
    longitude: -8.0,
  },
];
