import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_DIR = path.join(process.cwd(), 'docs/gtm-content');

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

// Output just the JSON array for the CLI
console.log(JSON.stringify({ documents }));
