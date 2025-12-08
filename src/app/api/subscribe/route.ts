import { NextResponse } from 'next/server'

import { appendJsonRecord } from '@/data/storage'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email } = body ?? {}

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  await appendJsonRecord('subscribers.json', {
    name: typeof name === 'string' ? name : '',
    email,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
