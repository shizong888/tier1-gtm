import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all documents ordered by their position
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").withIndex("by_order").collect();
  },
});

// Search documents by content and title
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const searchQuery = args.query.trim().toLowerCase();

    if (!searchQuery) {
      return [];
    }

    // Get all non-hidden documents
    const allDocs = await ctx.db
      .query("documents")
      .withIndex("by_order")
      .collect();

    const visibleDocs = allDocs.filter(doc => !doc.hidden);

    // Search and score results
    const results = visibleDocs
      .map(doc => {
        const titleLower = doc.title.toLowerCase();
        const contentLower = doc.content.toLowerCase();

        // Check if title matches
        const titleMatch = titleLower.includes(searchQuery);

        // Find all content matches with context
        const matches: Array<{ text: string; position: number }> = [];
        let position = contentLower.indexOf(searchQuery);

        while (position !== -1 && matches.length < 3) {
          // Extract context (50 chars before and after)
          const start = Math.max(0, position - 50);
          const end = Math.min(doc.content.length, position + searchQuery.length + 50);
          let snippet = doc.content.substring(start, end);

          // Add ellipsis if truncated
          if (start > 0) snippet = "..." + snippet;
          if (end < doc.content.length) snippet = snippet + "...";

          matches.push({
            text: snippet,
            position: position,
          });

          position = contentLower.indexOf(searchQuery, position + 1);
        }

        // Calculate score (title matches are worth more)
        const score = titleMatch ? 100 + matches.length : matches.length;

        return {
          _id: doc._id,
          title: doc.title,
          slug: doc.slug,
          order: doc.order,
          titleMatch,
          matches,
          score,
        };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);

    return results;
  },
});

// Get a single document by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get a document by ID
export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new document
export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    order: v.number(),
    hidden: v.optional(v.boolean()),
    headerStyle: v.optional(v.string()),
    headerLabel: v.optional(v.string()),
    headerTitle: v.optional(v.string()),
    headerAccent: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      slug: args.slug,
      title: args.title,
      content: args.content,
      order: args.order,
      hidden: args.hidden,
      headerStyle: args.headerStyle,
      headerLabel: args.headerLabel,
      headerTitle: args.headerTitle,
      headerAccent: args.headerAccent,
      updatedAt: Date.now(),
      updatedBy: args.userId,
    });
    return documentId;
  },
});

// Update a document (save published version)
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    order: v.optional(v.number()),
    hidden: v.optional(v.boolean()),
    headerStyle: v.optional(v.string()),
    headerLabel: v.optional(v.string()),
    headerTitle: v.optional(v.string()),
    headerAccent: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, userId, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
      updatedBy: userId,
    });

    // Clear pending changes for this document when saved
    const pendingChanges = await ctx.db
      .query("pendingChanges")
      .withIndex("by_document", (q) => q.eq("documentId", id))
      .collect();

    for (const change of pendingChanges) {
      await ctx.db.delete(change._id);
    }

    return id;
  },
});

// Delete a document
export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    // Delete associated pending changes
    const pendingChanges = await ctx.db
      .query("pendingChanges")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .collect();

    for (const change of pendingChanges) {
      await ctx.db.delete(change._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Update multiple document orders at once
export const updateOrders = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("documents"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, { order: update.order });
    }
  },
});

// Update pending changes (real-time collaborative editing)
export const updatePendingChanges = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Find existing pending change for this user and document
    const existing = await ctx.db
      .query("pendingChanges")
      .withIndex("by_user_and_document", (q) =>
        q.eq("userId", args.userId).eq("documentId", args.documentId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        lastUpdated: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("pendingChanges", {
        documentId: args.documentId,
        userId: args.userId,
        content: args.content,
        lastUpdated: Date.now(),
      });
    }
  },
});

// Get pending changes for a document
export const getPendingChanges = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pendingChanges")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

// Clear pending changes for current user
export const clearPendingChanges = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pendingChanges")
      .withIndex("by_user_and_document", (q) =>
        q.eq("userId", args.userId).eq("documentId", args.documentId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
