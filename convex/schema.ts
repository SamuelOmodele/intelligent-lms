// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.string(), // "admin", "lecturer", "student"
    department: v.optional(v.string()),
    staffId: v.optional(v.string()),
    matricNumber: v.optional(v.string()),
    // ADD THIS LINE:
    isBlocked: v.optional(v.boolean()), 
  }).index("by_email", ["email"]),

  // Keep your other tables like departments, etc.

  courses: defineTable({
    courseName: v.string(),
    courseCode: v.string(),
    lecturerId: v.id("users"), // Reference to the lecturer
    department: v.string(),
    description: v.string(),
    createdBy: v.id("users"), // Admin who created it
  }).index("by_code", ["courseCode"]),

});
