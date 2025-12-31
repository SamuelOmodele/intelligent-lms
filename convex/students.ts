import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listStudents = query({
  handler: async (ctx) => {
    const students = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "student"))
      .collect();

    // Map to include a default status if missing
    return students.map(s => ({
      ...s,
      status: s.isBlocked ? "Suspended" : "Active",
    }));
  },
});

export const getStudentStats = query({
  handler: async (ctx) => {
    const allStudents = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "student"))
      .collect();

    const now = new Date();

    // Get timestamp for start of TODAY (00:00:00)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Get timestamp for start of THIS WEEK (last 7 days or start of current week)
    // Option A: Last 7 full days
    const sevenDaysAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);

    return {
      total: allStudents.length,
      // Filtering by actual calendar day
      today: allStudents.filter(s => s._creationTime >= startOfToday).length,
      // Filtering by the last 168 hours (7 days)
      thisWeek: allStudents.filter(s => s._creationTime >= sevenDaysAgo).length,
    };
  },
});

export const toggleStudentAccess = mutation({
  args: { id: v.id("users"), isBlocked: v.boolean() },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    await ctx.db.patch(args.id, { isBlocked: args.isBlocked });

    await ctx.db.insert("logs", {
      action: `${args.isBlocked ? "Suspended" : "Restored"} student: ${student?.name}`,
      type: "user",
      timestamp: Date.now(),
    });
  },
});

export const updateStudent = mutation({
  args: {
    id: v.id("users"),
    name: v.string(),
    department: v.string(),
    level: v.string(),
    matricNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);

    await ctx.db.insert("logs", {
      action: `Updated student details: ${args.name}`,
      type: "user",
      timestamp: Date.now(),
    });
  },
});