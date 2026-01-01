import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createAssignment = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    instructions: v.string(),
    dueDate: v.string(),
    status: v.string(),
    attachmentId: v.optional(v.string()), // Store the Convex storageId
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("assignments", args);
  },
});

export const updateAssignment = mutation({
  args: {
    assignmentId: v.id("assignments"),
    title: v.string(),
    instructions: v.string(),
    dueDate: v.string(),
    attachmentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { assignmentId, ...rest } = args;
    await ctx.db.patch(assignmentId, rest);
  },
});

export const deleteAssignment = mutation({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    // Optional: You could also delete all submissions linked to this assignment here
    await ctx.db.delete(args.assignmentId);
  },
});

export const getDownloadUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
