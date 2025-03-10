import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { diagnosticTestSchema } from "@/lib/validations"

// GET /api/tests - List all test results
export async function GET() {
  try {
    const tests = await prisma.diagnosticTest.findMany({
      orderBy: {
        testDate: "desc",
      },
    })
    return NextResponse.json(tests)
  } catch (error:any) {
    return NextResponse.json({ error: "Failed to fetch diagnostic tests" }, { status: 500 })
  }
}

// POST /api/tests - Create a new test result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = diagnosticTestSchema.parse(body)

    // Create the test result
    const test = await prisma.diagnosticTest.create({
      data: validatedData,
    })

    return NextResponse.json(test, { status: 201 })
  } catch (error:any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create diagnostic test" }, { status: 500 })
  }
}

