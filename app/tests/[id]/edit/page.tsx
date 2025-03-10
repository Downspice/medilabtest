import { notFound } from "next/navigation"
import { TestForm } from "@/components/test-form"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function EditTestPage({ params }: any) {
  const test = await prisma.diagnosticTest.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!test) {
    notFound()
  }

  // Convert dates to strings for the form
  const serializedTest = {
    ...test,
    testDate: test.testDate.toISOString(),
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Edit Diagnostic Test</h2>
      <TestForm initialData={serializedTest} />
    </div>
  )
}

