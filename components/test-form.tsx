"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

type TestFormProps = {
  initialData?: {
    id: string
    patientName: string
    testType: string
    result: string
    testDate: string
    notes?: string |null
  }
  onSuccess?: () => void
}

export function TestForm({ initialData, onSuccess }: TestFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    patientName: initialData?.patientName || "",
    testType: initialData?.testType || "",
    result: initialData?.result || "",
    testDate: initialData?.testDate
      ? new Date(initialData.testDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    notes: initialData?.notes || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = initialData ? `/api/tests/${initialData.id}` : "/api/tests"

      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Something went wrong")
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err:any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div>
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
          Patient Name
        </label>
        <input
          type="text"
          id="patientName"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="testType" className="block text-sm font-medium text-gray-700">
          Test Type
        </label>
        <select
          id="testType"
          name="testType"
          value={formData.testType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a test type</option>
          <option value="Blood Test">Blood Test</option>
          <option value="Urine Test">Urine Test</option>
          <option value="COVID-19">COVID-19</option>
          <option value="X-Ray">X-Ray</option>
          <option value="MRI">MRI</option>
          <option value="CT Scan">CT Scan</option>
          <option value="Ultrasound">Ultrasound</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="result" className="block text-sm font-medium text-gray-700">
          Result
        </label>
        <input
          type="text"
          id="result"
          name="result"
          value={formData.result}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="testDate" className="block text-sm font-medium text-gray-700">
          Test Date
        </label>
        <input
          type="date"
          id="testDate"
          name="testDate"
          value={formData.testDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  )
}

