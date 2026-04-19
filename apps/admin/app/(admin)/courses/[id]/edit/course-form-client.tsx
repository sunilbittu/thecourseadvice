"use client";

// Re-export the shared CourseFormClient — the new and edit pages share the same form.
// The isEdit / PUT / DELETE behaviour is driven by whether `courseId` prop is set.
export { CourseFormClient } from "../../new/course-form-client";
