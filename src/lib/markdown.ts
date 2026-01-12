import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { filenameToSlug, slugToTitle, extractOrder, isMarkdownFile } from './slugs';

const GTM_CONTENT_DIR = path.join(process.cwd(), 'docs', 'gtm-content');

export interface NavItem {
  title: string;
  href: string;
  order: number;
  slug: string;
}

export interface MarkdownFile {
  filename: string;
  slug: string;
  title: string;
  order: number;
}

export interface ParsedMarkdown {
  content: string;
  frontmatter: Record<string, any>;
  slug: string;
  title: string;
}

/**
 * Get all markdown files from the GTM content directory
 */
export async function getMarkdownFiles(): Promise<MarkdownFile[]> {
  const files = fs.readdirSync(GTM_CONTENT_DIR);

  const markdownFiles = files
    .filter(isMarkdownFile)
    .map(filename => {
      const slug = filenameToSlug(filename);
      const title = slugToTitle(slug);
      const order = extractOrder(filename);

      return {
        filename,
        slug,
        title,
        order,
      };
    })
    .sort((a, b) => a.order - b.order);

  return markdownFiles;
}

/**
 * Parse a markdown file and return its content and metadata
 */
export async function parseMarkdownFile(slug: string): Promise<ParsedMarkdown | null> {
  try {
    const files = await getMarkdownFiles();
    const file = files.find(f => f.slug === slug);

    if (!file) {
      return null;
    }

    const filePath = path.join(GTM_CONTENT_DIR, file.filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      content,
      frontmatter: data,
      slug: file.slug,
      title: file.title,
    };
  } catch (error) {
    console.error(`Error parsing markdown file: ${slug}`, error);
    return null;
  }
}

/**
 * Generate navigation structure from markdown files
 */
export async function generateNavigation(): Promise<NavItem[]> {
  const files = await getMarkdownFiles();

  return files.map(file => ({
    title: file.title,
    href: `/${file.slug}`,
    order: file.order,
    slug: file.slug,
  }));
}

/**
 * Get all slugs for static generation
 */
export async function getAllSlugs(): Promise<string[]> {
  const files = await getMarkdownFiles();
  return files.map(file => file.slug);
}
