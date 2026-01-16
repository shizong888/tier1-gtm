import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all documents ordered by their position
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").withIndex("by_order").collect();
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
