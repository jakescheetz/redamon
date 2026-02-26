import { NextResponse } from 'next/server'
import { getOrCreateUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getOrCreateUser()
    return NextResponse.json(user)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/me] Error:', message, err)
    const status = message === 'Not authenticated' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
