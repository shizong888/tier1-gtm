import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_DIR = path.join(process.cwd(), 'docs/gtm-content');

async function migrateDocuments() {
  const files = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));

  const documents = files.map((file, index) => {
    const filePath = path.join(DOCS_DIR, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContents);

    // Extract slug from filename (e.g., "01-executive-summary.md" -> "executive-summary")
    const slug = file.replace(/^\d+-/, '').replace(/\.md$/, '');

    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');

    // Extract order from filename prefix
    const orderMatch = file.match(/^(\d+)-/);
    const order = orderMatch ? parseInt(orderMatch[1]) : index + 1;

    return {
      slug,
      title,
      content,
      order,
    };
  });

  console.log('Documents to migrate:');
  console.log(JSON.stringify(documents, null, 2));
  console.log(`\nTotal: ${documents.length} documents`);
  console.log('\nTo complete migration:');
  console.log('1. Copy the JSON output above');
  console.log('2. Go to your Convex dashboard');
  console.log('3. Use the data import feature or create an internal mutation');
  console.log('4. Or run: node -e "console.log(require(\'./scripts/migrate-to-convex.js\').getDocuments())"');
}

migrateDocuments().catch(console.error);
