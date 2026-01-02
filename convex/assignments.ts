/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createAssignment = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    instructions: v.string(),
    dueDate: v.string(), // Input is string from your form/UI
    status: v.string(),
    attachmentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // CONVERT TO NUMBER HERE
    const timestamp = new Date(args.dueDate).getTime();
    
    return await ctx.db.insert("assignments", {
      ...args,
      dueDate: timestamp as any, // Store as number
    });
  },
});

export const updateAssignment = mutation({
  args: {
    assignmentId: v.id("assignments"),
    title: v.string(),
    instructions: v.string(),
    dueDate: v.string(),
    attachmentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { assignmentId, ...rest } = args;
    
    // CONVERT TO NUMBER HERE
    const timestamp = new Date(args.dueDate).getTime();

    await ctx.db.patch(assignmentId, {
      ...rest,
      dueDate: timestamp as any,
    });
  },
});

export const deleteAssignment = mutation({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    // Optional: You could also delete all submissions linked to this assignment here
    await ctx.db.delete(args.assignmentId);
  },
});

export const getDownloadUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getEnrolledAssignments = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    // 1. Get student's enrollments
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();

    if (enrollments.length === 0) return [];

    const courseIds = enrollments.map((e) => e.courseId);

    // 2. Fetch all assignments for these courses
    const allAssignments = await ctx.db.query("assignments").collect();
    const myAssignments = allAssignments.filter((asgn) =>
      courseIds.includes(asgn.courseId)
    );

    // 3. Check submission status for each assignment
    const results = await Promise.all(
      myAssignments.map(async (asgn) => {
        const submission = await ctx.db
          .query("submissions")
          .withIndex("by_student_assignment", (q) =>
            q.eq("studentId", args.studentId).eq("assignmentId", asgn._id)
          )
          .unique();

        const course = await ctx.db.get(asgn.courseId);

        return {
          ...asgn,
          courseCode: course?.courseCode || "Unknown",
          status: submission ? "Submitted" : "Pending",
        };
      })
    );

    // Sort by due date (closest first)
    return results.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  },
});

export const getAssignmentById = query({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.assignmentId);
  },
});

export const getAssignmentsByCourse = query({
  args: { 
    courseId: v.id("courses"),
    studentId: v.id("users") 
  },
  handler: async (ctx, args) => {
    // 1. Fetch the course details first to get the courseCode
    const course = await ctx.db.get(args.courseId);
    
    // 2. Get all assignments for this specific course
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    // 3. Map through and attach submission status + courseCode
    const results = await Promise.all(
      assignments.map(async (asgn) => {
        const submission = await ctx.db
          .query("submissions")
          .withIndex("by_student_assignment", (q) =>
            q.eq("studentId", args.studentId).eq("assignmentId", asgn._id)
          )
          .unique();

        return {
          ...asgn,
          courseCode: course?.courseCode || "N/A", // Attaching the course code here
          status: submission ? "Submitted" : "Pending",
        };
      })
    );

    return results;
  },
});