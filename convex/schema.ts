// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.string(),
    department: v.string(),
    matricNumber: v.optional(v.string()),
    staffId: v.optional(v.string()),
    level: v.optional(v.string()),
    isBlocked: v.optional(v.boolean()),
  }).index("by_email", ["email"]),

  courses: defineTable({
    courseName: v.string(),
    courseCode: v.string(),
    lecturerId: v.id("users"), // Reference to the lecturer
    department: v.string(),
    description: v.string(),
    createdBy: v.id("users"), // Admin who created it
  }).index("by_code", ["courseCode"])
    .index("by_lecturerId", ["lecturerId"]),

  departments: defineTable({
    name: v.string(),
    code: v.string(),
    // Add these lines to match your database data
    courseCount: v.optional(v.number()),
    staffCount: v.optional(v.number()),
    studentCount: v.optional(v.number()),
  }),

  logs: defineTable({
    action: v.string(),     // e.g., "New Student Registered"
    type: v.string(),       // e.g., "user", "course", "system" (to determine dot color)
    timestamp: v.number(),  // used for sorting and "time ago"
  }),

});
