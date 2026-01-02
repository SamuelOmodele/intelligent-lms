import { v } from "convex/values";
import { query } from "./_generated/server";

export const getLessonsByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    // Fetches all lessons belonging to the selected course
    // Order them by week to keep the study flow logical
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    return lessons.sort((a, b) => a.week - b.week);
  },
});

export const getLessonById = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId);
  },
});