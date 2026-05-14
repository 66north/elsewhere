#!/usr/bin/env node
/**
 * Migrate topic YAML files from the old Pajero repo to MDX format for Elsewhere.
 *
 * Usage:
 *   node migrate_topics.js
 *
 * Requires: npm install js-yaml
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PAJERO_TOPICS = path.resolve(
  '/Users/rd/Projects/Pajero Website/.claude/worktrees/recursing-lamarr-60dd1a/content/topics'
);
const GUIDES_OUT = path.resolve(__dirname, 'src/content/guides');

const GEN_MAP = { gen2: 'Gen 2', gen3: 'Gen 3', gen4: 'Gen 4' };
const DIFFICULTY_MAP = { 1: 'easy', 2: 'moderate', 3: 'hard' };

function extractCostRange(parts) {
  if (!Array.isArray(parts)) return [null, null];

  const prices = [];
  for (const part of parts) {
    const notes = part?.notes || '';
    const matches = notes.match(/[\$€]?\s*(\d+)\s*[–\-]\s*(\d+)/g) || [];
    for (const match of matches) {
      const nums = match.match(/(\d+)/g);
      if (nums) prices.push(...nums.map(Number));
    }
    const singles = notes.match(/[\$€]\s*(\d+)/g) || [];
    for (const single of singles) {
      const num = single.match(/(\d+)/);
      if (num) prices.push(Number(num[1]));
    }
  }

  if (prices.length === 0) return [null, null];
  return [Math.min(...prices), Math.max(...prices)];
}

function migrateTopic(yamlPath) {
  const content = fs.readFileSync(yamlPath, 'utf-8');
  let topic;
  try {
    topic = yaml.load(content);
  } catch (e) {
    console.error(`✗ ${path.basename(yamlPath)}: ${e.message}`);
    return null;
  }

  if (!topic) return null;

  const frontmatter = {};
  frontmatter.slug = topic.slug;
  frontmatter.title = topic.title;
  frontmatter.category = topic.category;

  // Generations
  const appliesto = topic.applies_to || {};
  const gens = (appliesto.generations || []).map(g => GEN_MAP[g] || g);
  if (gens.length > 0) frontmatter.gens = gens;

  // Engines
  const engines = appliesto.engines || [];
  if (engines.length > 0) frontmatter.engines = engines;

  // Difficulty
  if (topic.difficulty) {
    frontmatter.difficulty = DIFFICULTY_MAP[topic.difficulty] || 'moderate';
  }

  // Time
  if (topic.time_minutes) {
    frontmatter.time_minutes = topic.time_minutes;
  }

  // Cost
  const [costMin, costMax] = extractCostRange(topic.parts);
  if (costMin) frontmatter.cost_min_eur = costMin;
  if (costMax) frontmatter.cost_max_eur = costMax;

  // Parts
  if (Array.isArray(topic.parts) && topic.parts.length > 0) {
    frontmatter.parts = topic.parts;
  }

  // Torque specs
  if (Array.isArray(topic.torque_specs) && topic.torque_specs.length > 0) {
    frontmatter.torque_specs = topic.torque_specs;
  }

  // Last reviewed
  frontmatter.last_reviewed = new Date().toISOString().split('T')[0];

  // Related
  if (Array.isArray(topic.related) && topic.related.length > 0) {
    frontmatter.related = topic.related;
  }

  // Contributors
  frontmatter.contributors = [];

  // Build body
  const bodyParts = [];

  // Lede
  if (topic.description) {
    bodyParts.push(String(topic.description).trim());
  }

  // Symptoms
  if (Array.isArray(topic.symptoms) && topic.symptoms.length > 0) {
    bodyParts.push('\n## Symptoms\n');
    for (const symptom of topic.symptoms) {
      bodyParts.push(`- ${symptom}`);
    }
  }

  // Tools
  if (Array.isArray(topic.tools) && topic.tools.length > 0) {
    bodyParts.push('\n## Tools needed\n');
    for (const tool of topic.tools) {
      bodyParts.push(`- ${tool}`);
    }
  }

  // Tips
  if (Array.isArray(topic.tips) && topic.tips.length > 0) {
    bodyParts.push('\n## Tips\n');
    for (const tip of topic.tips) {
      bodyParts.push(`- ${tip}`);
    }
  }

  // Procedure refs
  if (Array.isArray(topic.procedure_refs) && topic.procedure_refs.length > 0) {
    bodyParts.push('\n## Factory procedure reference\n');
    for (const ref of topic.procedure_refs) {
      const label = ref.label || '';
      const section = ref.section || '';
      const manual = ref.manual || '';
      bodyParts.push(`- **${label}** (${manual}, section ${section})`);
    }
  }

  const body = bodyParts.join('\n').trim();

  // Format frontmatter as YAML
  const fmLines = [];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      continue;
    }
    if (Array.isArray(value)) {
      fmLines.push(`${key}:`);
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          fmLines.push(`  - ${JSON.stringify(item)}`);
        } else {
          fmLines.push(`  - ${item}`);
        }
      }
    } else if (typeof value === 'number') {
      fmLines.push(`${key}: ${value}`);
    } else {
      fmLines.push(`${key}: ${value}`);
    }
  }

  const fmStr = fmLines.join('\n');
  const mdx = `---\n${fmStr}\n---\n\n${body}\n`;

  return mdx;
}

function main() {
  if (!fs.existsSync(GUIDES_OUT)) {
    fs.mkdirSync(GUIDES_OUT, { recursive: true });
  }

  if (!fs.existsSync(PAJERO_TOPICS)) {
    console.error(`❌ Topics dir not found: ${PAJERO_TOPICS}`);
    process.exit(1);
  }

  const yamlFiles = fs.readdirSync(PAJERO_TOPICS)
    .filter(f => f.endsWith('.yml'))
    .sort();

  console.log(`📖 Found ${yamlFiles.length} topic files`);

  let success = 0;
  let errors = 0;

  for (const file of yamlFiles) {
    const yamlPath = path.join(PAJERO_TOPICS, file);
    const mdx = migrateTopic(yamlPath);

    if (!mdx) {
      errors++;
      continue;
    }

    const slug = file.replace(/\.yml$/, '');
    const mdxPath = path.join(GUIDES_OUT, `${slug}.mdx`);
    fs.writeFileSync(mdxPath, mdx, 'utf-8');
    console.log(`✓ ${slug}`);
    success++;
  }

  console.log(`\n✓ Migrated ${success}, errors ${errors}`);
}

main();
