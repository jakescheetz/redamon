import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/projects - List authenticated user's projects
export async function GET() {
  const [user, authError] = await requireAuth()
  if (authError) return authError

  try {
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        targetDomain: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  const [user, authError] = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, targetDomain, ...optionalParams } = body

    if (!name || !targetDomain) {
      return NextResponse.json(
        { error: 'name and targetDomain are required' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        targetDomain,
        ...optionalParams
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
