import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Stripe kräver rå body för signaturverifiering
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')
  let event

  try {
    const rawBody = await request.arrayBuffer()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig!,
      webhookSecret
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    console.log('Stripe webhook: userId from metadata:', userId)
    if (!userId) {
      console.error('No user_id in session metadata')
      return NextResponse.json({ error: 'No user_id in metadata' }, { status: 400 })
    }
    try {
      // Använd service_role-nyckeln för server-to-server
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'unlimited' })
        .eq('id', userId)
      if (error) {
        console.error('Failed to update user plan:', error)
        return NextResponse.json({ error: 'Failed to update user plan' }, { status: 500 })
      }
      console.log('Supabase update succeeded for user:', userId)
      return NextResponse.json({ received: true })
    } catch (err) {
      console.error('Supabase error:', err)
      return NextResponse.json({ error: 'Supabase error' }, { status: 500 })
    }
  }

  // Hantera andra event om du vill
  return NextResponse.json({ received: true })
} 