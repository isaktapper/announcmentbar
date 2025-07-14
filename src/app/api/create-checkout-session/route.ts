import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function POST(request: NextRequest) {
  try {
    // Hämta användaren från Supabase-sessionen
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Skapa Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email || undefined,
      line_items: [
        {
          price: process.env.STRIPE_UNLIMITED_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?upgrade=cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe Checkout error:', error)
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 })
  }
} 