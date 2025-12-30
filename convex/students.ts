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

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    return {
      total: allStudents.length,
      thisWeek: allStudents.filter(s => (now - s._creationTime) < oneWeek).length,
      today: allStudents.filter(s => (now - s._creationTime) < oneDay).length,
    };
  },
});

export const toggleStudentAccess = mutation({
  args: { id: v.id("users"), isBlocked: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isBlocked: args.isBlocked });
  },
});