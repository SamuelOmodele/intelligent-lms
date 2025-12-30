import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Get list of lecturers for the dropdown
export const getLecturers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "lecturer"))
      .collect();
  },
});

// Create the course
export const create = mutation({
  args: {
    courseName: v.string(),
    courseCode: v.string(),
    lecturerId: v.id("users"),
    department: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if course code exists
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_code", (q) => q.eq("courseCode", args.courseCode))
      .unique();

    if (existing) throw new ConvexError("Course code already exists!");

    // Get current user (admin) from localStorage ID passed from frontend or context
    // For now, we'll just insert
    return await ctx.db.insert("courses", {
      ...args,
      createdBy: (await ctx.db.query("users").first())!._id, // Placeholder for simplicity
    });
  },
});


export const list = query({
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();

    // Join with users to get lecturer names
    return Promise.all(
      courses.map(async (course) => {
        const lecturer = await ctx.db.get(course.lecturerId);
        return {
          ...course,
          lecturerName: lecturer?.name || "Unknown Lecturer",
          // For now, we'll mock student count, but you'd normally query an enrollments table
          students: 0,
          status: "Active",
        };
      })
    );
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
  },
});

export const remove = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});