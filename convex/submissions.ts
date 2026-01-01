import { v } from "convex/values";
import { mutation } from "./_generated/server";


export const createSubmission = mutation({
  args: {
    studentId: v.id("users"),
    assignmentId: v.id("assignments"),
    storageId: v.string(), // The Convex storage ID
    fileUrl: v.string(),    // The public/temporary URL
  },
  handler: async (ctx, args) => {
    // Check if a submission already exists to prevent duplicates
    const existing = await ctx.db
      .query("submissions")
      .withIndex("by_student_assignment", (q) =>
        q.eq("studentId", args.studentId).eq("assignmentId", args.assignmentId)
      )
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        storageId: args.storageId,
        fileUrl: args.fileUrl,
        submittedAt: Date.now(),
      });
    }

    return await ctx.db.insert("submissions", {
      studentId: args.studentId,
      assignmentId: args.assignmentId,
      storageId: args.storageId,
      fileUrl: args.fileUrl,
      submittedAt: Date.now(),
    });
  },
});