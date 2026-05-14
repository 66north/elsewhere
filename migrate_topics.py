#!/usr/bin/env python3
"""
Migrate topic YAML files from the old Pajero repo to MDX format for Elsewhere.

Usage:
  python3 migrate_topics.py

Reads from:  ../Pajero Website/.claude/worktrees/*/content/topics/*.yml
Writes to:   src/content/guides/*.mdx
"""

import sys
import re
import json
from pathlib import Path
from datetime import datetime

# Paths
PAJERO_TOPICS = Path(
    '/Users/rd/Projects/Pajero Website/.claude/worktrees/recursing-lamarr-60dd1a/content/topics'
)
GUIDES_OUT = Path(__file__).parent / 'src' / 'content' / 'guides'

# Generation mapping
GEN_MAP = {'gen2': 'Gen 2', 'gen3': 'Gen 3', 'gen4': 'Gen 4'}

# Difficulty mapping
DIFFICULTY_MAP = {1: 'easy', 2: 'moderate', 3: 'hard'}


def parse_yaml_simple(text: str) -> dict:
    """Simple YAML parser for this specific schema. Handles nested lists."""
    result = {}
    lines = text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip() or line.startswith('#'):
            i += 1
            continue

        # Key: value line
        if ':' in line and not line.startswith(' '):
            key, _, rest = line.partition(':')
            key = key.strip()
            rest = rest.strip()

            if rest.endswith('>'):
                # Multi-line string (description, etc.)
                value_lines = []
                i += 1
                while i < len(lines):
                    l = lines[i]
                    if l and not l[0].isspace():
                        break
                    value_lines.append(l.lstrip())
                    i += 1
                result[key] = '\n'.join(value_lines).strip()
                continue

            elif rest.startswith('['):
                # Inline list
                result[key] = json.loads(rest)
                i += 1
                continue

            elif rest:
                # Simple value
                try:
                    result[key] = int(rest)
                except ValueError:
                    result[key] = rest
                i += 1
                continue

            else:
                # Nested object or list coming next
                i += 1
                if i < len(lines) and lines[i].startswith('  '):
                    nested = {}
                    while i < len(lines) and lines[i].startswith('  '):
                        subline = lines[i][2:]  # Remove indent
                        if ':' in subline:
                            subkey, _, subrest = subline.partition(':')
                            subkey = subkey.strip()
                            subrest = subrest.strip()
                            if subrest.startswith('['):
                                nested[subkey] = json.loads(subrest)
                            else:
                                try:
                                    nested[subkey] = int(subrest) if subrest.isdigit() else subrest
                                except:
                                    nested[subkey] = subrest
                        i += 1
                    result[key] = nested
                else:
                    result[key] = {}
                continue

        # List item (- something)
        elif line.strip().startswith('-') and not isinstance(result.get(list(result.keys())[-1] if result else None), list):
            # Start a new list or append to existing
            current_key = None
            for k in reversed(result.keys()):
                if not isinstance(result[k], (dict, str)):
                    current_key = k
                    break

            if not current_key:
                current_key = list(result.keys())[-1] if result else None

            if current_key and not isinstance(result[current_key], list):
                result[current_key] = []

            item_text = line.strip()[1:].strip()
            if item_text.startswith('{'):
                # Dict item
                item = json.loads(item_text)
            else:
                # Simple string item
                item = item_text

            if current_key:
                result[current_key].append(item)

            i += 1
            continue

        # Nested dict items (key: value with 2-space indent)
        elif line.startswith('  ') and ':' in line:
            # This is part of a list/dict we just started
            i += 1
            continue

        i += 1

    return result


def extract_cost_range(parts: list) -> tuple:
    """Heuristically extract min/max cost (EUR) from parts notes."""
    prices = []
    for part in parts:
        if isinstance(part, dict):
            notes = part.get('notes', '')
        else:
            notes = str(part)
        # Match patterns like "$X–Y" or "€X–Y" or "$X–Y" or "X–Y"
        matches = re.findall(r'[\$€]?\s*(\d+)\s*[–\-]\s*(\d+)', notes)
        for match in matches:
            prices.extend([int(match[0]), int(match[1])])
        # Also single prices
        matches = re.findall(r'[\$€]\s*(\d+)', notes)
        for match in matches:
            prices.append(int(match))

    if not prices:
        return None, None
    return min(prices), max(prices)


def migrate_topic(yaml_path: Path) -> str:
    """Migrate a single topic YAML to MDX."""
    with open(yaml_path, 'r', encoding='utf-8') as f:
        topic = parse_yaml_simple(f.read())

    if not topic:
        print(f'⚠️  {yaml_path.name}: empty file, skipping')
        return None

    # Build frontmatter dict
    frontmatter = {}
    frontmatter['slug'] = topic.get('slug')
    frontmatter['title'] = topic.get('title')
    frontmatter['category'] = topic.get('category')

    # Generations
    applies_to = topic.get('applies_to', {})
    gens = applies_to.get('generations', []) if isinstance(applies_to, dict) else []
    frontmatter['gens'] = [GEN_MAP.get(g, g) for g in gens]

    # Engines
    engines = applies_to.get('engines', []) if isinstance(applies_to, dict) else []
    frontmatter['engines'] = engines

    # Difficulty
    difficulty = topic.get('difficulty')
    if difficulty:
        frontmatter['difficulty'] = DIFFICULTY_MAP.get(int(difficulty) if isinstance(difficulty, (int, str)) else difficulty, 'moderate')

    # Time
    if topic.get('time_minutes'):
        frontmatter['time_minutes'] = topic['time_minutes']

    # Cost (heuristic from parts)
    parts = topic.get('parts', [])
    cost_min, cost_max = extract_cost_range(parts if isinstance(parts, list) else [])
    if cost_min:
        frontmatter['cost_min_eur'] = cost_min
    if cost_max:
        frontmatter['cost_max_eur'] = cost_max

    # Parts
    if parts:
        frontmatter['parts'] = parts

    # Torque specs
    torque_specs = topic.get('torque_specs', [])
    if torque_specs:
        frontmatter['torque_specs'] = torque_specs if isinstance(torque_specs, list) else []

    # Last reviewed
    frontmatter['last_reviewed'] = datetime.now().strftime('%Y-%m-%d')

    # Related
    related = topic.get('related', [])
    if related:
        frontmatter['related'] = related if isinstance(related, list) else []

    # Contributors (stub)
    frontmatter['contributors'] = []

    # Build body
    body_parts = []

    # Lede (from description)
    description = topic.get('description', '')
    if isinstance(description, str):
        description = description.strip()
        if description:
            body_parts.append(description)

    # Symptoms
    symptoms = topic.get('symptoms', [])
    if symptoms and isinstance(symptoms, list):
        body_parts.append('\n## Symptoms\n')
        for symptom in symptoms:
            body_parts.append(f'- {symptom}')

    # Tools
    tools = topic.get('tools', [])
    if tools and isinstance(tools, list):
        body_parts.append('\n## Tools needed\n')
        for tool in tools:
            body_parts.append(f'- {tool}')

    # Tips
    tips = topic.get('tips', [])
    if tips and isinstance(tips, list):
        body_parts.append('\n## Tips\n')
        for tip in tips:
            body_parts.append(f'- {tip}')

    # Procedure refs (as a note)
    procedure_refs = topic.get('procedure_refs', [])
    if procedure_refs and isinstance(procedure_refs, list):
        body_parts.append('\n## Factory procedure reference\n')
        for ref in procedure_refs:
            if isinstance(ref, dict):
                label = ref.get('label', '')
                section = ref.get('section', '')
                manual = ref.get('manual', '')
                body_parts.append(f'- **{label}** ({manual}, section {section})')

    body = '\n'.join(body_parts).strip()

    # Format frontmatter as YAML
    fm_lines = []
    for key, value in frontmatter.items():
        if value is None or (isinstance(value, list) and len(value) == 0):
            continue
        if isinstance(value, list):
            fm_lines.append(f'{key}:')
            for item in value:
                if isinstance(item, dict):
                    fm_lines.append(f'  - {json.dumps(item)}')
                else:
                    fm_lines.append(f'  - {item}')
        elif isinstance(value, (int, float)):
            fm_lines.append(f'{key}: {value}')
        elif isinstance(value, str):
            fm_lines.append(f'{key}: {value}')

    fm_str = '\n'.join(fm_lines)

    # Assemble MDX
    mdx = f'''---
{fm_str}
---

{body}
'''
    return mdx


def main():
    GUIDES_OUT.mkdir(parents=True, exist_ok=True)

    if not PAJERO_TOPICS.exists():
        print(f'❌ Topics dir not found: {PAJERO_TOPICS}')
        sys.exit(1)

    yaml_files = sorted(PAJERO_TOPICS.glob('*.yml'))
    print(f'📖 Found {len(yaml_files)} topic files')

    success = 0
    skipped = 0
    errors = 0

    for yaml_path in yaml_files:
        try:
            mdx = migrate_topic(yaml_path)
            if not mdx:
                skipped += 1
                continue

            # Write output
            slug = yaml_path.stem
            mdx_path = GUIDES_OUT / f'{slug}.mdx'
            mdx_path.write_text(mdx, encoding='utf-8')
            print(f'✓ {slug}')
            success += 1

        except Exception as e:
            print(f'✗ {yaml_path.name}: {e}')
            errors += 1

    print(f'\n✓ Migrated {success}, skipped {skipped}, errors {errors}')


if __name__ == '__main__':
    main()
