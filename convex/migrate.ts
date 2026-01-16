import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// This mutation can be called once to populate the database with initial documents
export const seedDocuments = internalMutation({
  args: {
    documents: v.array(
      v.object({
        slug: v.string(),
        title: v.string(),
        content: v.string(),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const doc of args.documents) {
      // Check if document already exists
      const existing = await ctx.db
        .query("documents")
        .withIndex("by_slug", (q) => q.eq("slug", doc.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("documents", {
          ...doc,
          updatedAt: Date.now(),
        });
      }
    }

    return { count: args.documents.length };
  },
});
