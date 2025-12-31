// convex/departments.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const departments = await ctx.db.query("departments").collect();

    // Map through departments and calculate counts dynamically
    return await Promise.all(
      departments.map(async (dept) => {
        // Count Courses assigned to this department name
        const courses = await ctx.db
          .query("courses")
          .filter((q) => q.eq(q.field("department"), dept.name))
          .collect();

        // Count Staff (Lecturers) assigned to this department name
        const staff = await ctx.db
          .query("users")
          .filter((q) => 
            q.and(
              q.eq(q.field("role"), "lecturer"),
              q.eq(q.field("department"), dept.name)
            )
          )
          .collect();

        // Count Students assigned to this department name
        const students = await ctx.db
          .query("users")
          .filter((q) => 
            q.and(
              q.eq(q.field("role"), "student"),
              q.eq(q.field("department"), dept.name)
            )
          )
          .collect();

        return {
          ...dept,
          courseCount: courses.length,
          staffCount: staff.length,
          studentCount: students.length,
        };
      })
    );
  },
});

export const create = mutation({
  args: { name: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("departments", {
      name: args.name,
      code: args.code,
    });

    await ctx.db.insert("logs", {
      action: `Created Department: ${args.name} (${args.code})`,
      type: "system",
      timestamp: Date.now(),
    });
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    const dept = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);

    await ctx.db.insert("logs", {
      action: `Deleted Department: ${dept?.name}`,
      type: "system",
      timestamp: Date.now(),
    });
  },
});