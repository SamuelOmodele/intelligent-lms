// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values"; // Add this import

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.string(),
    department: v.string(),
    matricNumber: v.optional(v.string()),
    staffId: v.optional(v.string()),
    level: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // 2. Insert the user
    // Note: In a production app, you'd hash the password here using a library like bcryptjs
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: args.role,
      department: args.department,
      matricNumber: args.matricNumber,
      staffId: args.staffId,
      level: args.level,
      isBlocked: false,
    });

    // LOG THE EVENT
    await ctx.db.insert("logs", {
      action: `New ${args.role} registered: ${args.name}`,
      type: "user",
      timestamp: Date.now(),
    });

    return userId;
  },
});


export const login = mutation({
  args: {
    identifier: v.string(), // This can be email or matricNumber
    password: v.string(),
  },
  handler: async (ctx, args) => {

    // 1. Try to find the user by email OR matricNumber
    const user = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("email"), args.identifier),
          q.eq(q.field("matricNumber"), args.identifier)
        )
      )
      .unique();

    // Inside your login mutation
    if (!user || user.password !== args.password) {
      throw new ConvexError("Invalid credentials. Please check your details.");
    }

    // 3. Return the user info (excluding password)
    return {
      _id: user._id,
      role: user.role,
      name: user.name,
    };
  },
});

export const getUserRole = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) return null;
    return { role: user.role };
  },
});

export const currentUser = query({
  args: { id: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    return await ctx.db.get(args.id);
  },
});