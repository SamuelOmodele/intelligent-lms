import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    
    // Enrich courses with lecturer names and student counts
    return Promise.all(
      courses.map(async (course) => {
        const lecturer = await ctx.db.get(course.lecturerId);
        return {
          ...course,
          lecturerName: lecturer?.name || "Unassigned",
          // You can also count students here if you have an enrollment table
          students: 0, 
          status: 'Active'
        };
      })
    );
  },
});

export const getLecturers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "lecturer"))
      .collect();
  },
});


export const create = mutation({
  args: {
    courseName: v.string(),
    courseCode: v.string(),
    lecturerId: v.id("users"),
    department: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_code", (q) => q.eq("courseCode", args.courseCode))
      .unique();

    if (existing) throw new ConvexError("Course code already exists!");

    const courseId = await ctx.db.insert("courses", {
      ...args,
      createdBy: (await ctx.db.query("users").first())!._id, 
    });

    await ctx.db.insert("logs", {
      action: `New Course Created: ${args.courseCode}`,
      type: "course",
      timestamp: Date.now(),
    });

    return courseId;
  },
});

export const update = mutation({
  args: {
    id: v.id("courses"),
    courseName: v.string(),
    lecturerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);

    await ctx.db.insert("logs", {
      action: `Updated details for: ${args.courseName}`,
      type: "course",
      timestamp: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);

    await ctx.db.insert("logs", {
      action: `Deleted Course: ${course?.courseCode}`,
      type: "course",
      timestamp: Date.now(),
    });
  },
});