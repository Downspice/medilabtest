import { z } from "zod"

export const diagnosticTestSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  testType: z.string().min(1, "Test type is required"),
  result: z.string().min(1, "Result is required"),
  testDate: z.string().transform((str) => new Date(str)),
  notes: z.string().optional(),
})

export type DiagnosticTestInput = z.infer<typeof diagnosticTestSchema>

