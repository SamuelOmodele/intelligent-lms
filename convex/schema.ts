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
    unit: v.number(),
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

  enrollments: defineTable({
    studentId: v.id("users"),
    courseId: v.id("courses"),
    enrolledAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_course", ["courseId"])
    .index("by_student_course", ["studentId", "courseId"]), // Prevents double enrollment

  lessons: defineTable({
    title: v.string(),
    week: v.number(),
    courseId: v.id("courses"),
    storageId: v.optional(v.id("_storage")), // For PDF uploads
    format: v.string(), // e.g., "PDF" or "Video"
  }).index("by_course", ["courseId"]),

  assignments: defineTable({
    title: v.string(),
    instructions: v.string(),
    courseId: v.id("courses"),
    dueDate: v.number(),
    attachmentId: v.optional(v.string()),
    status: v.string(), // "Pending" or "Closed"
  }).index("by_course", ["courseId"]),

  submissions: defineTable({
    studentId: v.id("users"),
    assignmentId: v.id("assignments"),
    fileUrl: v.string(),
    storageId: v.string(), // If using Convex storage
    submittedAt: v.number(),
    grade: v.optional(v.string()),
    feedback: v.optional(v.string()),
  })
    .index("by_student", ["studentId"])
    .index("by_assignment", ["assignmentId"])
    // This index is crucial for the .unique() query we used earlier
    .index("by_student_assignment", ["studentId", "assignmentId"]),

});
