import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    order: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  // Track pending changes for real-time collaboration
  pendingChanges: defineTable({
    documentId: v.id("documents"),
    userId: v.string(),
    content: v.string(),
    lastUpdated: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_user_and_document", ["userId", "documentId"]),
});
