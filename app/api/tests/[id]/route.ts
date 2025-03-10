import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { diagnosticTestSchema } from "@/lib/validations"

// GET /api/tests/:id - Get a specific test result
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const test = await prisma.diagnosticTest.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!test) {
      return NextResponse.json({ error: "Diagnostic test not found" }, { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch diagnostic test" }, { status: 500 })
  }
}

// PUT /api/tests/:id - Update a test result
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = diagnosticTestSchema.parse(body)

    // Check if the test exists
    const existingTest = await prisma.diagnosticTest.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingTest) {
      return NextResponse.json({ error: "Diagnostic test not found" }, { status: 404 })
    }

    // Update the test
    const updatedTest = await prisma.diagnosticTest.update({
      where: {
        id: params.id,
      },
      data: validatedData,
    })

    return NextResponse.json(updatedTest)
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update diagnostic test" }, { status: 500 })
  }
}

// DELETE /api/tests/:id - Delete a test result
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if the test exists
    const existingTest = await prisma.diagnosticTest.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingTest) {
      return NextResponse.json({ error: "Diagnostic test not found" }, { status: 404 })
    }

    // Delete the test
    await prisma.diagnosticTest.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete diagnostic test" }, { status: 500 })
  }
}

