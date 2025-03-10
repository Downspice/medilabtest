"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type DiagnosticTest = {
  id: string
  patientName: string
  testType: string
  result: string
  testDate: string
  notes?: string
  createdAt: string
  updatedAt: string
}

type TestListProps = {
  initialTests: DiagnosticTest[]
}

export function TestList({ initialTests }: TestListProps) {
  const router = useRouter()
  const [tests, setTests] = useState<DiagnosticTest[]>(initialTests)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test result?")) {
      return
    }

    setIsDeleting(id)

    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete test")
      }

      setTests((prevTests) => prevTests.filter((test) => test.id !== id))
      router.refresh()
    } catch (error:any) {
      console.error("Error deleting test:", error)
      alert("Failed to delete test")
    } finally {
      setIsDeleting(null)
    }
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No test results found</p>
        <Link
          href="/tests/new"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Test
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Result
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tests.map((test) => (
            <tr key={test.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.patientName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.testType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.result}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(test.testDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link href={`/tests/${test.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                  View
                </Link>
                <Link href={`/tests/${test.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(test.id)}
                  disabled={isDeleting === test.id}
                  className="text-red-600 hover:text-red-900"
                >
                  {isDeleting === test.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

