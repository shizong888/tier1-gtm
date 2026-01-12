# GTM Strategy Site - Implementation Plan

## Overview

Create a beautiful, documentation-style website to showcase Tier 1's Go-To-Market strategy with a sidebar navigation using shadcn/ui components. The site will automatically render markdown files from a directory structure, providing an elegant reading experience.

---

## Project Analysis

### Current State
- **Framework**: Next.js 16.1.1 with React 19
- **Styling**: Tailwind CSS v4 with shadcn/ui (New York style)
- **Icon Library**: Lucide React
- **Current Content**: Single large markdown file at `docs/gtm/gtm.md` (~1010 lines)
- **Content Structure**: The GTM document contains 13 distinct sections

### Document Sections Identified
1. Executive Summary
2. Go-To-Market Approach
3. Target Audience
4. Value Proposition
5. Expanding Reach via the Trading Ecosystem
6. Key Partnerships, Distribution Channels, and Growth Loops
7. Token Incentives and Governance
8. Community, Brand, and Partnership Development
9. Market Integrity and Execution Transparency
10. Centralized to On-Chain Trading Transition
11. Acquiring the First 1,000 Market Participants
12. Network Effects and Compounding Liquidity

---

## Implementation Strategy

### Phase 1: Content Restructuring

**Objective**: Break down the monolithic GTM document into individual, navigable markdown files.

#### New Directory Structure
```
docs/
└── gtm-content/           # New directory for markdown content
    ├── 01-executive-summary.md
    ├── 02-gtm-approach.md
    ├── 03-target-audience.md
    ├── 04-value-proposition.md
    ├── 05-expanding-reach.md
    ├── 06-partnerships.md
    ├── 07-token-incentives.md
    ├── 08-community-brand.md
    ├── 09-market-integrity.md
    ├── 10-cex-to-onchain.md
    ├── 11-first-1000.md
    └── 12-network-effects.md
```

#### File Naming Convention
- Prefix with numbers (01-12) for explicit ordering
- Use kebab-case for readability
- Descriptive names that reflect content
- `.md` extension for markdown files

#### Content Extraction Rules
- Remove duplicate "## Tier 1" and "### Go-To-Market Strategy" headers
- Preserve all substantive content, diagrams, and structure
- Maintain markdown formatting and hierarchy
- Each file should be self-contained and readable

---

### Phase 2: shadcn/ui Sidebar Integration

**Objective**: Install and configure the shadcn sidebar component for navigation.

#### Component Installation
```bash
npx shadcn@latest add sidebar
```

This will install:
- Sidebar component and its dependencies
- Required UI primitives (Sheet, Button, etc.)
- Proper TypeScript types

#### Sidebar Configuration
- **Position**: Left side, fixed on desktop
- **Behavior**:
  - Collapsible on mobile (hamburger menu)
  - Always visible on desktop (≥768px)
  - Smooth animations for open/close
- **Content**: Auto-generated navigation from markdown files
- **Styling**: Consistent with New York theme

---

### Phase 3: Dynamic Markdown Rendering System

**Objective**: Create a dynamic routing and rendering system for markdown content.

#### Required Dependencies
```json
{
  "react-markdown": "^9.0.1",      // Markdown parser
  "remark-gfm": "^4.0.0",           // GitHub Flavored Markdown
  "rehype-raw": "^7.0.0",           // Raw HTML support
  "rehype-sanitize": "^6.0.0",      // Security
  "gray-matter": "^4.0.3"           // Frontmatter parsing
}
```

#### File System Integration
- Use Node.js `fs` module to read markdown files
- Parse directory structure at build time
- Generate static paths for all markdown pages
- Support for metadata via frontmatter (optional)

#### Route Structure
```
/                          → Landing/Overview page
/gtm/[slug]                → Individual GTM strategy pages
  /gtm/executive-summary   → 01-executive-summary.md
  /gtm/gtm-approach        → 02-gtm-approach.md
  ...etc
```

---

### Phase 4: Component Architecture

**Objective**: Build a clean, maintainable component structure.

#### Core Components

##### 1. Layout Component (`/src/components/layout/gtm-layout.tsx`)
```typescript
interface GTMLayoutProps {
  children: React.ReactNode;
  navigation: NavItem[];
}
```
- Wraps sidebar and main content
- Responsive container
- Header/footer if needed

##### 2. Sidebar Navigation (`/src/components/layout/sidebar-nav.tsx`)
```typescript
interface NavItem {
  title: string;
  href: string;
  order: number;
}
```
- Auto-generated from file system
- Active state highlighting
- Smooth scroll behavior
- Mobile-responsive

##### 3. Markdown Renderer (`/src/components/markdown/markdown-content.tsx`)
```typescript
interface MarkdownContentProps {
  content: string;
  frontmatter?: FrontMatter;
}
```
- Custom styling for markdown elements
- Code syntax highlighting (optional)
- Responsive typography
- Proper heading hierarchy

##### 4. Table of Contents (`/src/components/markdown/toc.tsx`) - Optional
- Auto-generated from headings
- Sticky positioning
- Smooth scroll links

---

### Phase 5: Styling & Design System

**Objective**: Create a beautiful, professional reading experience.

#### Typography
- **Headings**: Clear hierarchy using Tailwind typography
- **Body**: Optimized line height (1.7-1.8) for readability
- **Max Width**: 65-75 characters per line (~800px)
- **Font Stack**: System fonts for performance

#### Color Scheme
- Use shadcn neutral base color (already configured)
- Subtle backgrounds for code blocks
- Accent colors for links and active states
- High contrast for accessibility

#### Spacing & Layout
- Generous whitespace between sections
- Consistent padding/margins
- Responsive breakpoints:
  - Mobile: < 768px (full width, hamburger menu)
  - Tablet: 768px - 1024px (collapsible sidebar)
  - Desktop: > 1024px (fixed sidebar)

#### Custom Markdown Styles
```css
/* Headings */
- h1: text-4xl font-bold mb-6
- h2: text-3xl font-semibold mb-4 border-b
- h3: text-2xl font-semibold mb-3

/* Content */
- p: text-base mb-4 leading-relaxed
- ul/ol: ml-6 mb-4 space-y-2
- blockquote: border-l-4 pl-4 italic
- hr: my-8 border-neutral-200

/* Interactive */
- links: underline hover:text-primary
- code blocks: bg-neutral-100 rounded-lg p-4
```

---

### Phase 6: Data Layer & Utils

**Objective**: Build utilities for file system operations and markdown processing.

#### Utilities to Create

##### 1. File System Utils (`/src/lib/markdown.ts`)
```typescript
// Get all markdown files from directory
async function getMarkdownFiles(dir: string): Promise<MarkdownFile[]>

// Parse individual markdown file
async function parseMarkdownFile(path: string): Promise<ParsedMarkdown>

// Generate navigation structure
function generateNavigation(files: MarkdownFile[]): NavItem[]

// Get file by slug
async function getMarkdownBySlug(slug: string): Promise<ParsedMarkdown>
```

##### 2. Slug Utils (`/src/lib/slugs.ts`)
```typescript
// Convert filename to slug (01-executive-summary.md → executive-summary)
function filenameToSlug(filename: string): string

// Convert slug to title (executive-summary → Executive Summary)
function slugToTitle(slug: string): string

// Extract order from filename (01-executive-summary.md → 1)
function extractOrder(filename: string): number
```

---

### Phase 7: Page Implementation

**Objective**: Implement Next.js pages with dynamic routing.

#### Pages to Create

##### 1. Home Page (`/src/app/page.tsx`)
- Overview of GTM strategy
- Quick links to main sections
- Optional: Hero section with key highlights

##### 2. GTM Dynamic Route (`/src/app/gtm/[slug]/page.tsx`)
```typescript
// Generate static paths for all markdown files
export async function generateStaticParams()

// Fetch markdown content for current page
export async function generateMetadata({ params })

// Render page with sidebar and content
export default async function GTMPage({ params })
```

##### 3. Root Layout Update (`/src/app/layout.tsx`)
- Add sidebar provider if needed
- Global navigation structure
- Metadata configuration

---

## Technical Specifications

### Performance Considerations
- **Static Generation**: Use Next.js SSG for all markdown pages
- **Code Splitting**: Lazy load markdown renderer
- **Image Optimization**: Use Next.js Image component if images added
- **Bundle Size**: Keep dependencies minimal

### Accessibility
- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Keyboard navigation support
- ARIA labels for sidebar toggle
- Focus management for mobile menu

### SEO
- Dynamic meta tags for each page
- Proper OpenGraph tags
- Structured data (optional)
- Sitemap generation (optional)

---

## File Checklist

### Files to Create
- [ ] 12 markdown content files in `docs/gtm-content/`
- [ ] `src/components/layout/gtm-layout.tsx`
- [ ] `src/components/layout/sidebar-nav.tsx`
- [ ] `src/components/markdown/markdown-content.tsx`
- [ ] `src/lib/markdown.ts`
- [ ] `src/lib/slugs.ts`
- [ ] `src/app/gtm/[slug]/page.tsx`
- [ ] Update `src/app/page.tsx`

### Dependencies to Install
- [ ] `react-markdown`
- [ ] `remark-gfm`
- [ ] `gray-matter`
- [ ] shadcn sidebar component via CLI

### Files to Modify
- [ ] `src/app/layout.tsx` (add sidebar context if needed)
- [ ] `src/app/globals.css` (add custom markdown styles)

---

## Implementation Order

1. **Content First**: Create all markdown files from existing content
2. **Dependencies**: Install required npm packages
3. **Utilities**: Build file system and markdown utilities
4. **Components**: Create sidebar and layout components
5. **Pages**: Implement dynamic routing
6. **Styling**: Apply custom styles and polish
7. **Testing**: Verify all pages render correctly
8. **Polish**: Fine-tune responsive behavior and animations

---

## Success Criteria

- ✅ All 12 sections accessible via sidebar navigation
- ✅ Responsive design works on mobile, tablet, and desktop
- ✅ Markdown content renders beautifully with proper typography
- ✅ Active page highlighted in sidebar
- ✅ Fast page load times (< 1s)
- ✅ Keyboard accessible
- ✅ Clean, professional aesthetic consistent with Tier 1 brand
- ✅ Easy to add new markdown files in the future

---

## Future Enhancements (Out of Scope)

- Full-text search across all content
- Dark mode toggle
- Print-friendly styles
- PDF export functionality
- Table of contents with scroll spy
- Version history/changelog
- Comments or feedback system
- Analytics integration

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Markdown rendering inconsistencies | Use well-tested libraries (react-markdown) with proper sanitization |
| Mobile sidebar UX issues | Thoroughly test on real devices, use shadcn's proven patterns |
| Performance with large files | Implement code splitting and lazy loading |
| Content becomes outdated | Make adding/editing markdown files dead simple |
| Accessibility gaps | Use semantic HTML and test with screen readers |

---

## Timeline Estimate

**Total Implementation**: 4-6 hours of focused development

- Content restructuring: 1 hour
- Component development: 2 hours
- Styling & polish: 1 hour
- Testing & refinement: 1 hour

---

## Notes

- The current `docs/gtm/gtm.md` should be kept as a backup initially
- Consider adding a `/docs/gtm-content/README.md` explaining the structure
- File naming convention allows for easy reordering (change number prefix)
- Each markdown file should have a clear H1 title at the top
- The numbered prefix (01-, 02-, etc.) won't appear in URLs or navigation

---

*This plan provides a comprehensive roadmap for transforming the GTM strategy into a beautiful, navigable website. Each phase builds upon the previous, ensuring a systematic and maintainable implementation.*
