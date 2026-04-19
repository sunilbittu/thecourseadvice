"use client";

// Re-export the shared InstitutionFormClient — new and edit pages share the same form.
// The isEdit / PUT / DELETE behaviour is driven by whether `institutionId` prop is set.
export { InstitutionFormClient } from "../../new/institution-form-client";
