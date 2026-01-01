import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const getLecturerDashboardStats = query({
  args: { lecturerId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.lecturerId) return null;

    // 1. Get courses assigned to this lecturer
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("lecturerId"), args.lecturerId))
      .collect();

    const courseIds = courses.map(c => c._id);
    const courseCodes = courses.map(c => c.courseCode);

    // 2. Get enrollments for these courses
    // Assumes you have an 'enrollments' table linking studentId and courseId
    const enrollments = await ctx.db
      .query("enrollments")
      .collect();

    const myEnrollments = enrollments.filter(e => courseIds.includes(e.courseId));

    // 3. Get student details for the table
    const studentData = await Promise.all(
      myEnrollments.map(async (enrol) => {
        const student = await ctx.db.get(enrol.studentId);
        const course = courses.find(c => c._id === enrol.courseId);
        return {
          id: enrol._id,
          name: student?.name || "Unknown",
          email: student?.email || "N/A",
          course: course?.courseCode || "N/A",
          level: student?.level || "N/A",
          status: student?.isBlocked ? "Inactive" : "Active"
        };
      })
    );

    return {
      stats: {
        assignedCourses: courses.length,
        totalStudents: studentData.length,
        assignments: 0, // Placeholder for future logic
        assessments: 0,  // Placeholder for future logic
      },
      students: studentData,
      courseList: ["All", ...courseCodes]
    };
  }
});

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

export const getEnrolledStudents = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    // 1. Get all enrollments for this course
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    // 2. Map through enrollments to get full student (user) details
    const students = await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = await ctx.db.get(enrollment.studentId);
        return {
          ...student,
          enrolledAt: enrollment.enrolledAt,
          enrollmentId: enrollment._id,
        };
      })
    );

    // Filter out any nulls in case a user was deleted but enrollment remains
    return students.filter((s) => s !== null);
  },
});