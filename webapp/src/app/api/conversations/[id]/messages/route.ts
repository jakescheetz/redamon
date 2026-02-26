import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// POST /api/conversations/[id]/messages - Append messages
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const [user, authError] = await requireAuth()
  if (authError) return authError

  try {
    const { id: conversationId } = await params

    // Verify conversation belongs to authenticated user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    if (conversation.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    // Support single or batch messages
    const items: Array<{ type: string; data: unknown }> = body.messages
      ? body.messages
      : [{ type: body.type, data: body.data }]

    // Get current max sequence number
    const maxSeq = await prisma.chatMessage.aggregate({
      where: { conversationId },
      _max: { sequenceNum: true },
    })
    let nextSeq = (maxSeq._max.sequenceNum ?? -1) + 1

    const created = await prisma.chatMessage.createMany({
      data: items.map((item) => ({
        conversationId,
        sequenceNum: nextSeq++,
        type: item.type,
        data: item.data as any,
      })),
    })

    // Touch the conversation's updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ count: created.count }, { status: 201 })
  } catch (error) {
    console.error('Failed to save messages:', error)
    return NextResponse.json(
      { error: 'Failed to save messages' },
      { status: 500 }
    )
  }
}
