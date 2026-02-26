import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export interface AuthUser {
  id: string
  clerkUserId: string
  name: string
  email: string
}

/**
 * Gets or creates a Prisma User record linked to the current Clerk user.
 * Lazy sync: first access creates the DB record. Matches by email
 * for migration from pre-Clerk users.
 */
export async function getOrCreateUser(): Promise<AuthUser> {
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    throw new Error('Not authenticated')
  }

  // Try to find existing user by clerkUserId
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId },
  })

  if (existingUser) {
    return {
      id: existingUser.id,
      clerkUserId: existingUser.clerkUserId!,
      name: existingUser.name,
      email: existingUser.email,
    }
  }

  // Fetch profile from Clerk
  const clerkUser = await currentUser()

  if (!clerkUser) {
    throw new Error('Could not fetch Clerk user profile')
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || email || 'User'

  if (!email) {
    throw new Error('Clerk user has no email address')
  }

  // Check if a user with this email already exists (pre-Clerk migration)
  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (existingByEmail) {
    // Link existing user to Clerk account — preserves all projects/conversations
    const updatedUser = await prisma.user.update({
      where: { id: existingByEmail.id },
      data: { clerkUserId },
    })
    return {
      id: updatedUser.id,
      clerkUserId,
      name: updatedUser.name,
      email: updatedUser.email,
    }
  }

  // Create brand new user
  const newUser = await prisma.user.create({
    data: { clerkUserId, name, email },
  })

  return {
    id: newUser.id,
    clerkUserId,
    name: newUser.name,
    email: newUser.email,
  }
}

/**
 * Authenticate the current request and return the Prisma user.
 * Returns [user, null] on success or [null, NextResponse] on failure.
 */
export async function requireAuth(): Promise<[AuthUser, null] | [null, NextResponse]> {
  try {
    const user = await getOrCreateUser()
    return [user, null]
  } catch {
    return [null, NextResponse.json({ error: 'Not authenticated' }, { status: 401 })]
  }
}

/**
 * Verify the authenticated user owns a project. Returns an error response if not, null if OK.
 */
export async function requireProjectOwner(
  projectId: string,
  userId: string
): Promise<NextResponse | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  if (project.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}
