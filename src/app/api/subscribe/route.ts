import { NextResponse } from 'next/server'

import { appendJsonRecord, readJsonRecords } from '@/data/storage'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email } = body ?? {}

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const trimmedEmail = email.trim().toLowerCase()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(trimmedEmail)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
  }

  const existingSubscribers = await readJsonRecords<{ email?: string }>('subscribers.json')
  const alreadySubscribed = existingSubscribers.some(
    (subscriber) => subscriber.email?.toLowerCase() === trimmedEmail,
  )

  if (alreadySubscribed) {
    return NextResponse.json({ error: 'You are already subscribed.' }, { status: 409 })
  }

  await appendJsonRecord('subscribers.json', {
    name: typeof name === 'string' ? name : '',
    email: trimmedEmail,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
