import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DOCS_DIR = path.join(process.cwd(), 'docs/gtm-content');

async function seed() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL not found in environment variables');
  }

  const client = new ConvexHttpClient(convexUrl);

  // Generate documents array
  const files = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));

  const documents = files.map((file, index) => {
    const filePath = path.join(DOCS_DIR, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContents);

    const slug = file.replace(/^\d+-/, '').replace(/\.md$/, '');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
    const orderMatch = file.match(/^(\d+)-/);
    const order = orderMatch ? parseInt(orderMatch[1]) : index + 1;

    return {
      slug,
      title,
      content,
      order,
    };
  });

  console.log(`Seeding ${documents.length} documents...`);

  try {
    const result = await client.mutation(api.migrate.seedDocuments, { documents });
    console.log('✅ Seed complete!', result);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
