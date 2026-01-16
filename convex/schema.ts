import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    order: v.number(),
    headerStyle: v.optional(v.string()), // e.g., "executive-summary", "target-audience", etc.
    headerLabel: v.optional(v.string()), // Top label text
    headerTitle: v.optional(v.string()), // Main title text
    headerAccent: v.optional(v.string()), // Bottom accent text
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

  // Media files (images, etc.)
  media: defineTable({
    filename: v.string(),
    storageId: v.id("_storage"),
    contentType: v.string(),
    size: v.number(),
    uploadedAt: v.number(),
    uploadedBy: v.optional(v.string()),
  })
    .index("by_uploaded_at", ["uploadedAt"]),
});
