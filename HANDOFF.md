# Elsewhere Project Handoff

**Project Date:** Started May 2026  
**Last Updated:** May 15, 2026  
**Current Status:** Core features complete, actively maintained

---

## Vision & Purpose

**Elsewhere** is a personal website documenting overland exploration expeditions across Europe and North Africa. It serves as:
- A journal of remote expeditions and travel experiences
- A curated bucket list of destinations to explore
- A comprehensive repository of Pajero/Montero/Shogun repair guides and maintenance information
- A technical showcase of the vehicle's build and capabilities

**Tagline:** "Overland exploration across Europe and North Africa"  
**Homepage Quote:** "A good traveler has no fixed plans and is not intent on arriving."

---

## Current Features

### 1. Homepage
- Hero section with site mission
- Quick stats: kilometers driven (248,310 km), trips completed (34)
- Featured guides section (randomized maintenance/troubleshooting)
- CTA buttons to Journal and Workshop

### 2. Journal Section (`/journal`)
- Trip reports with metadata: location, distance, duration, date
- Support for images, Markdown content
- Trip examples: South Coast Iceland, Langjökull, East Coast Drive, North Highlands
- BlogPosting schema for SEO

### 3. Bucket List Section (`/bucketlist`)
- Interactive Leaflet.js world map with OpenStreetMap tiles
- Destinations grouped by status: Visited, In Progress, Pending
- Destination cards with region, countries, description
- Individual destination pages with metadata and navigation
- Status-based color coding (green=visited, orange=in-progress, grey=pending)
- Hover popups showing details and link to destination page
- 4 example destinations: Sahara Crossing, Pyrenees Traverse, Faroe Islands, Dakar Rally Route

### 4. Workshop Section (`/workshop`)
- **112 comprehensive guides** covering:
  - Maintenance (oil changes, filter replacements, belt service)
  - Troubleshooting (starting issues, transmission problems, cooling)
  - Specifications (fluid types, capacities, torque specs)
  - Diagnostic codes and fault troubleshooting
  - Component reference and wiring diagrams
- Guides grouped by category (maintenance, troubleshoot, specifications, electrical, cooling, etc.)
- Difficulty levels (easy, moderate, hard)
- Time estimates for each procedure
- Parts lists with OEM numbers and sources
- HowTo schema for SEO
- Guide details page with related procedures

### 5. Build Log Section (`/build`)
- Visual documentation of vehicle modifications and build progress
- Photos and progress notes

### 6. Manual Archive Page (`/workshop/archive`)
- 16-chapter factory service manual index
- Manual metadata: coverage (NS 2006-2015, all engines), 19,617 pages
- Cross-reference to 112 guides
- Educational use disclaimer
- CreativeWork schema

### 7. SEO & Infrastructure
- ✅ robots.txt with crawl directives
- ✅ Dynamic sitemap with priority/changefreq:
  - Home: 1.0 (weekly)
  - Journal: 0.9 (weekly)
  - Bucket list: 0.85 (monthly)
  - Workshop guides: 0.85 (monthly)
  - Other: 0.7-0.8 (monthly)
- ✅ JSON-LD schemas:
  - Organization + WebSite (home)
  - BreadcrumbList (all content pages)
  - BlogPosting (journal entries)
  - HowTo (workshop guides)
  - CollectionPage (index pages)
  - Place (bucket list destinations)
  - CreativeWork (manual archive)
- ✅ Deployed to GitHub Pages (`gh-pages` branch)

---

## Technology Stack

**Framework:** Astro 6.3.3  
**Package Manager:** npm  
**Node Version:** 22.14.0 (required, >=22.12.0)  
**UI Framework:** Preact (for interactive components)  
**Integrations:**
- @astrojs/mdx (for content)
- @astrojs/preact (for interactive components)
- @astrojs/sitemap (for SEO)

**Libraries:**
- Leaflet 1.9.4 (interactive maps)
- OpenStreetMap (map tiles)

**Hosting:** GitHub Pages (`gh-pages` branch)  
**Repository:** https://github.com/66north/elsewhere.git

---

## Project Structure

```
elsewhere/
├── src/
│   ├── components/
│   │   └── BucketListMap.tsx          # Interactive Leaflet map component
│   ├── content/
│   │   ├── bucketlist/                # Bucket list destination items (MDX)
│   │   ├── guides/                    # Workshop repair guides (MDX)
│   │   ├── journal/                   # Trip journal entries (MDX)
│   │   └── config.ts                  # Content collection schemas
│   ├── layouts/
│   │   └── BaseLayout.astro           # Main page layout
│   ├── lib/
│   │   ├── bucketlist.ts              # Bucket list data structure
│   │   ├── guide.ts                   # Guide utility functions
│   │   └── site.ts                    # Site config (nav, paths, metadata)
│   └── pages/
│       ├── index.astro                # Homepage
│       ├── about.astro                # About page
│       ├── bucketlist/
│       │   ├── index.astro            # Bucket list index
│       │   └── [slug].astro           # Individual destination pages
│       ├── build/
│       │   └── index.astro            # Build log
│       ├── journal/
│       │   ├── index.astro            # Journal index
│       │   └── [slug].astro           # Individual trip entries
│       └── workshop/
│           ├── index.astro            # Workshop hub
│           ├── archive.astro          # Manual archive
│           └── guides/
│               ├── index.astro        # Guide listing
│               └── [slug].astro       # Individual guide pages
├── public/
│   ├── assets/                        # Images for content
│   └── robots.txt
├── astro.config.mjs                   # Astro configuration
├── package.json
└── tsconfig.json
```

---

## Running the Project

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Important:** Node 22.14.0 is required. Use `nvm use 22.14.0` to switch versions.

### Deployment

The site is deployed to GitHub Pages via the `gh-pages` branch.

**Deploy workflow:**
```bash
# Make changes on main branch
git add -A
git commit -m "Your message"

# Build
npm run build

# Deploy
git checkout gh-pages
cp -r dist/* .
rm -rf dist node_modules .astro
git add -A
git commit -m "Deploy: Your message"
git push origin gh-pages

# Return to main and push
git checkout main
git push origin main
```

---

## Data Structures

### Bucket List Item (`src/lib/bucketlist.ts`)
```typescript
interface BucketListItem {
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
  latitude: number;
  longitude: number;
}
```

### Content Collections
- **journal**: Trip reports with date, location, distance, duration, images
- **guides**: Repair guides with category, difficulty, time estimates, parts lists
- **bucketlist**: Destination items (see above)

---

## Future Goals & Features

### Planned Features
1. **Enhanced Bucket List**
   - Photo gallery per destination
   - Video links integration
   - Route planning integration
   - Estimated costs and budgeting
   - Permit/visa requirements database

2. **Journal Enhancements**
   - Photo gallery per trip
   - Route maps (maybe integrate Leaflet)
   - Interactive timelines
   - Comments/notes system
   - Trip statistics (fuel consumption, average speed)

3. **Workshop Improvements**
   - Video tutorials linked to guides
   - Parts suppliers directory
   - Tool recommendations
   - Cost estimations
   - Community contributions/comments

4. **Interactive Features**
   - Dark mode toggle
   - Language selection
   - Print-friendly guides
   - Offline access for guides
   - Search functionality

5. **Community & Sharing**
   - Share trip routes
   - Export guides as PDF
   - Trip planning collaboration
   - User comments on guides

### Performance Optimizations
- Image optimization/lazy loading
- Cache strategies
- Performance monitoring

### Analytics
- Page view tracking (privacy-respecting)
- Popular guides tracking
- Map interaction analytics

---

## Known Issues & Technical Notes

### Current Limitations
1. **Bucket List Data:** Currently hardcoded in `src/lib/bucketlist.ts`. Consider migrating to MDX files in `src/content/bucketlist/` if Astro collection system becomes reliable.
2. **Map Coordinates:** Using approximate center points for regions. Consider exact trip route data in the future.
3. **Images:** Placeholder assets in `/public/assets/`. Real photos from trips need to be added.
4. **Search:** Not yet implemented across guides/journal.

### Technical Debt
- Content config (`src/content/config.ts`) uses lenient schema validation (`z.any()`). Consider stricter typing as content stabilizes.
- Guide components in workshop don't have video embed support yet.

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Leaflet maps require JavaScript enabled
- Mobile: responsive design implemented, touch interactions work on bucket list map

---

## Content Guidelines

### Adding a Journal Entry
1. Create `src/content/journal/[slug].mdx`
2. Add frontmatter with: slug, title, date, location, preview, excerpt, image, distance, duration_days
3. Write trip report in Markdown
4. Rebuild and deploy

### Adding a Bucket List Destination
1. Add item to `src/lib/bucketlist.ts`
2. Include: slug, title, region, countries, status, priority, description, difficulty, duration, season, coordinates
3. Set status: 'pending', 'in-progress', or 'visited'
4. Rebuild and deploy

### Adding a Workshop Guide
1. Create `src/content/guides/[slug].mdx`
2. Add frontmatter: slug, title, category, difficulty, time_minutes, tools, parts, related guides
3. Write guide content with steps, warnings, specifications
4. Include parts list with OEM numbers
5. Rebuild and deploy

---

## Environment & Dependencies

### Required
- Node.js 22.14.0+
- npm 10.9.2+
- Git

### Optional
- GitHub CLI (`gh`) for managing deployments
- VS Code with Astro extension

### Key Dependencies
- astro@^6.3.3
- leaflet@^1.9.4
- @astrojs/mdx@^5.0.6
- @astrojs/preact@^5.1.3
- preact@^10.29.1

---

## Git Workflow

**Main branch:** Source code, latest development  
**gh-pages branch:** Built site deployed to GitHub Pages  

**Commit convention:**
- Feature: "Add [feature name]"
- Fix: "Fix [issue]"
- Update: "Update [section] text/content"
- Deploy: "Deploy: [description]"

---

## Monitoring & Maintenance

### Regular Tasks
- Check Google Search Console for indexing issues
- Monitor dead links in guides
- Update trip statistics on homepage
- Refresh workshop guides as new techniques are discovered
- Add new bucket list items as plans change

### Performance Checks
- PageSpeed Insights: https://pagespeed.web.dev/
- Schema validation: https://validator.schema.org/
- Mobile-friendliness: Google Mobile-Friendly Test

### Backups
- Repository backed up on GitHub
- Content in version control
- No database (static site)

---

## Support & Resources

**Project Repo:** https://github.com/66north/elsewhere  
**Live Site:** https://66north.github.io/elsewhere  
**Astro Docs:** https://docs.astro.build  
**Leaflet Docs:** https://leafletjs.com/reference.html  

---

## Next Session Checklist

When starting a new session on this project:

- [ ] Navigate to `/Users/rd/Projects/elsewhere`
- [ ] Run `nvm use 22.14.0` to ensure correct Node version
- [ ] Run `npm install` if needed
- [ ] Run `npm run dev` to start dev server
- [ ] Review any pending feature requests or changes
- [ ] After changes: `npm run build` → deploy to gh-pages
- [ ] Verify changes live at https://66north.github.io/elsewhere

---

**Last Handoff:** May 15, 2026  
**Handoff Author:** Claude  
**Project Owner:** RD
