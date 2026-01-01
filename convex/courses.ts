import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";


export const list = query({
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();

    // Enrich courses with lecturer names and student counts
    return Promise.all(
      courses.map(async (course) => {
        const lecturer = await ctx.db.get(course.lecturerId);
        return {
          ...course,
          lecturerName: lecturer?.name || "Unassigned",
          // You can also count students here if you have an enrollment table
          students: 0,
          status: 'Active'
        };
      })
    );
  },
});

export const getLecturers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "lecturer"))
      .collect();
  },
});


export const create = mutation({
  args: {
    courseName: v.string(),
    courseCode: v.string(),
    lecturerId: v.id("users"),
    department: v.string(),
    unit: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_code", (q) => q.eq("courseCode", args.courseCode))
      .unique();

    if (existing) throw new ConvexError("Course code already exists!");

    const courseId = await ctx.db.insert("courses", {
      ...args,
      createdBy: (await ctx.db.query("users").first())!._id,
    });

    await ctx.db.insert("logs", {
      action: `New Course Created: ${args.courseCode}`,
      type: "course",
      timestamp: Date.now(),
    });

    return courseId;
  },
});

export const update = mutation({
  args: {
    id: v.id("courses"),
    courseName: v.string(),
    lecturerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);

    await ctx.db.insert("logs", {
      action: `Updated details for: ${args.courseName}`,
      type: "course",
      timestamp: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);

    await ctx.db.insert("logs", {
      action: `Deleted Course: ${course?.courseCode}`,
      type: "course",
      timestamp: Date.now(),
    });
  },
});

export const getLecturerCourses = query({
  args: { lecturerId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    // 1. Return empty if no ID provided
    if (!args.lecturerId) return [];

    // 2. Fetch the lecturer's info once
    const lecturer = await ctx.db.get(args.lecturerId);

    // 3. Fetch all courses assigned to this lecturer
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("lecturerId"), args.lecturerId))
      .collect();

    // 4. Map through courses and attach the lecturer's name
    return courses.map((course) => ({
      ...course,
      lecturerName: lecturer?.name || "Unknown Lecturer",
    }));
  },
});


export const getCourseClassroomDetails = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) return null;

    const lecturer = await ctx.db.get(course.lecturerId);

    // Fetch Lessons
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    // Fetch Assignments
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    return {
      ...course,
      lecturerName: lecturer?.name || "Unknown",
      lessons,
      assignments
    };
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// 2. Create the lesson record in the DB
export const createLesson = mutation({
  args: {
    title: v.string(),
    week: v.number(),
    courseId: v.id("courses"),
    storageId: v.id("_storage"),
    format: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("lessons", args);
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getAllCourses = query({
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();

    // Map through courses and attach lecturer details
    const coursesWithLecturers = await Promise.all(
      courses.map(async (course) => {
        // Fetch the user record using the lecturerId stored in the course
        const lecturer = await ctx.db.get(course.lecturerId);

        return {
          ...course,
          lecturerName: lecturer?.name || "Unknown Lecturer",
        };
      })
    );

    return coursesWithLecturers;
  },
});

// 1. Get specific course details with Lecturer Name
export const getCourseDetails = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) return null;

    const lecturer = await ctx.db.get(course.lecturerId);
    return {
      ...course,
      lecturerName: lecturer?.name || "Unknown Lecturer",
    };
  },
});

export const checkEnrollment = query({
  // Accepting both studentId and courseId as explicit arguments
  args: {
    courseId: v.id("courses"),
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_student_course", (q) =>
        q.eq("studentId", args.studentId as Id<"users">).eq("courseId", args.courseId)
      )
      .unique();
  },
});

// 3. Enroll student
export const enrollInCourse = mutation({
  args: {
    courseId: v.id("courses"),
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check for existing enrollment first to prevent duplicates
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_student_course", (q) =>
        q.eq("studentId", args.studentId as Id<"users">).eq("courseId", args.courseId)
      )
      .unique();

    if (existing) return existing._id;

    // Insert new enrollment record
    return await ctx.db.insert("enrollments", {
      studentId: args.studentId as Id<"users">,
      courseId: args.courseId,
      enrolledAt: Date.now(),
    });
  },
});

export const deleteLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    // Delete the database record
    await ctx.db.delete(args.lessonId);

    // MODERN SYNTAX: Pass an object with storageId
    await ctx.storage.delete(args.storageId);

    return true;
  },
});

// 2. Get Download URL
export const getDownloadUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    // MODERN SYNTAX: Pass an object with storageId
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const updateCourseDescription = mutation({
  args: {
    courseId: v.id("courses"),
    description: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.courseId, {
      description: args.description,
    });
  },
});

export const getStudentCourses = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    // 1. Find all enrollments for this student
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();

    // 2. Fetch course details and join with lecturer data
    const coursesWithLecturers = await Promise.all(
      enrollments.map(async (enrol) => {
        const course = await ctx.db.get(enrol.courseId);
        
        if (!course) return null;

        // Fetch the lecturer's profile using the lecturerId in the course document
        const lecturer = await ctx.db.get(course.lecturerId);

        return {
          ...course,
          lecturerName: lecturer?.name || "Unknown Lecturer",
        };
      })
    );

    // Filter out any potential nulls (in case a course was deleted)
    return coursesWithLecturers.filter((c) => c !== null);
  },
});

