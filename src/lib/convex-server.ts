import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('NEXT_PUBLIC_CONVEX_URL is not set');
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function getAllDocuments() {
  return await convex.query(api.documents.list);
}

export async function getDocumentBySlug(slug: string) {
  return await convex.query(api.documents.getBySlug, { slug });
}
