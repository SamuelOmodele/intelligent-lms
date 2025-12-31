import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listLecturers = query({
  handler: async (ctx) => {
    const lecturers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "lecturer"))
      .collect();

    return await Promise.all(
      lecturers.map(async (lecturer) => {
        const workload = await ctx.db
          .query("courses")
          .filter((q) => q.eq(q.field("lecturerId"), lecturer._id))
          .collect();

        return {
          ...lecturer,
          workloadCount: workload.length,
          // Default to false if the field is missing in the DB
          isBlocked: lecturer.isBlocked ?? false,
        };
      })
    );
  },
});

export const toggleBlockStatus = mutation({
  args: { id: v.id("users"), status: v.boolean() },
  handler: async (ctx, args) => {
    const lecturer = await ctx.db.get(args.id);
    await ctx.db.patch(args.id, { isBlocked: args.status });

    await ctx.db.insert("logs", {
      action: `${args.status ? "Blocked" : "Unblocked"} lecturer: ${lecturer?.name}`,
      type: "user",
      timestamp: Date.now(),
    });
  },
});
