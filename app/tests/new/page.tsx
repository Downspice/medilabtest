import { TestForm } from "@/components/test-form"

export default function NewTestPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Add New Diagnostic Test</h2>
      <TestForm />
    </div>
  )
}

