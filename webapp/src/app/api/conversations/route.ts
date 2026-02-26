import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/conversations?projectId=X
export async function GET(request: NextRequest) {
  const [user, authError] = await requireAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      )
    }

    const conversations = await prisma.conversation.findMany({
      where: { projectId, userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        sessionId: true,
        title: true,
        status: true,
        agentRunning: true,
        currentPhase: true,
        iterationCount: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  const [user, authError] = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { projectId, sessionId } = body

    if (!projectId || !sessionId) {
      return NextResponse.json(
        { error: 'projectId and sessionId are required' },
        { status: 400 }
      )
    }

    const conversation = await prisma.conversation.create({
      data: { projectId, userId: user.id, sessionId },
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Failed to create conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
