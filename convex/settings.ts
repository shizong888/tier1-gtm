import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get a setting by key
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return setting;
  },
});

// Get all settings
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("settings").collect();
  },
});

// Update or create a setting
export const set = mutation({
  args: {
    key: v.string(),
    value: v.string(),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: Date.now(),
        updatedBy: args.updatedBy,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("settings", {
        key: args.key,
        value: args.value,
        updatedAt: Date.now(),
        updatedBy: args.updatedBy,
      });
    }
  },
});

// Generate upload URL for logo files
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save logo after upload
export const saveLogo = mutation({
  args: {
    storageId: v.string(),
    mode: v.union(v.literal("light"), v.literal("dark")),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const key = args.mode === "light" ? "logo_light" : "logo_dark";

    // Store the storage ID as the value
    await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first()
      .then(async (existing) => {
        if (existing) {
          await ctx.db.patch(existing._id, {
            value: args.storageId,
            updatedAt: Date.now(),
            updatedBy: args.updatedBy,
          });
        } else {
          await ctx.db.insert("settings", {
            key,
            value: args.storageId,
            updatedAt: Date.now(),
            updatedBy: args.updatedBy,
          });
        }
      });

    return { success: true };
  },
});

// Get logo URL
export const getLogoUrl = query({
  args: { mode: v.union(v.literal("light"), v.literal("dark")) },
  handler: async (ctx, args) => {
    const key = args.mode === "light" ? "logo_light" : "logo_dark";
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    if (!setting) return null;

    // Get the storage URL
    const url = await ctx.storage.getUrl(setting.value as any);
    return url;
  },
});
