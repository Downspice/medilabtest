import Link from "next/link"
import { TestList } from "@/components/test-list"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Home() {
  const tests = await prisma.diagnosticTest.findMany({
    orderBy: {
      testDate: "desc",
    },
  })

  // Convert dates to strings for serialization
  const serializedTests = tests.map((test) => ({
    ...test,
    testDate: test.testDate.toISOString(),
    createdAt: test.createdAt.toISOString(),
    updatedAt: test.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Diagnostic Test Results</h2>
        <Link
          href="/tests/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Test
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <TestList initialTests={serializedTests} />
      </div>
    </div>
  )
}

