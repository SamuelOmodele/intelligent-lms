// convex/dashboard.ts
import { query } from "./_generated/server";

export const getStats = query({
  handler: async (ctx) => {

    // 1. Fetch all students and lecturers
    const students = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "student"))
      .collect();

    const lecturers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "lecturer"))
      .collect();

    // 2. Fetch counts for Courses and Departments
    const courses = await ctx.db.query("courses").collect();
    const departments = await ctx.db.query("departments").collect();

    // 3. Get 5 most recently created courses
    const rawRecentCourses = await ctx.db
      .query("courses")
      .order("desc")
      .take(5);

    // 4. Enrich course data with Lecturer names
    // This resolves the "lecturerName" field your frontend needs
    const enrichedRecentCourses = await Promise.all(
      rawRecentCourses.map(async (course) => {
        const lecturer = await ctx.db.get(course.lecturerId);
        return {
          ...course,
          lecturerName: lecturer?.name || "Unassigned",
        };
      })
    );

    // Fetch the 5 most recent logs
    const logs = await ctx.db
      .query("logs")
      .order("desc")
      .take(5);

    // 5. Return the structured data
    return {
      totalStudents: students.length,
      totalLecturers: lecturers.length,
      totalCourses: courses.length,
      totalDepartments: departments.length,
      recentCourses: enrichedRecentCourses,
      logs,
    };
  },
});