import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for file storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save media metadata after file is uploaded
export const saveMedia = mutation({
  args: {
    filename: v.string(),
    storageId: v.id("_storage"),
    contentType: v.string(),
    size: v.number(),
    uploadedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const mediaId = await ctx.db.insert("media", {
      filename: args.filename,
      storageId: args.storageId,
      contentType: args.contentType,
      size: args.size,
      uploadedAt: Date.now(),
      uploadedBy: args.uploadedBy,
    });
    return mediaId;
  },
});

// List all media files
export const list = query({
  args: {},
  handler: async (ctx) => {
    const media = await ctx.db
      .query("media")
      .withIndex("by_uploaded_at")
      .order("desc")
      .collect();

    // Get URLs for each media file
    const mediaWithUrls = await Promise.all(
      media.map(async (m) => {
        const url = await ctx.storage.getUrl(m.storageId);
        return {
          ...m,
          url,
        };
      })
    );

    return mediaWithUrls;
  },
});

// Get single media file
export const get = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) return null;

    const url = await ctx.storage.getUrl(media.storageId);
    return {
      ...media,
      url,
    };
  },
});

// Delete media file
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) {
      throw new Error("Media not found");
    }

    // Delete from storage
    await ctx.storage.delete(media.storageId);

    // Delete from database
    await ctx.db.delete(args.id);
  },
});
