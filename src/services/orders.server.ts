import { createServerFn } from '@tanstack/react-start'
import { supabase } from '@/lib/supabase'
import { mockDb } from '@/lib/mock-db'
import Razorpay from 'razorpay'
import { z } from 'zod'

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

// Schema for order creation
const CreateOrderSchema = z.object({
  documentType: z.string(),
  category: z.string(),
  state: z.string(),
  lawyerSigned: z.boolean(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  purpose: z.string(),
  details: z.string(),
  urgency: z.enum(['standard', 'express']),
  amount: z.number(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
})

export const createOrderFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => CreateOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const isMock = !process.env.VITE_SUPABASE_URL;
    const orderId = `LD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    if (isMock) {
      return mockDb.addOrder({
        id: orderId,
        ...data,
        status: 'pending',
        payment_status: data.razorpayPaymentId ? 'paid' : 'pending',
      });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          id: orderId,
          ...data,
          status: 'pending',
          payment_status: data.razorpayPaymentId ? 'paid' : 'pending',
        },
      ])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return order
  })

export const createRazorpayOrderFn = createServerFn({ method: 'POST' })
  .validator((amount: number) => z.number().parse(amount))
  .handler(async ({ data: amount }) => {
    try {
      const order = await razorpay.orders.create({
        amount: amount * 100, // amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      })
      return order
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const verifyPaymentFn = createServerFn({ method: 'POST' })
  .validator((data: any) => z.any().parse(data))
  .handler(async ({ data }) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data
    
    // Logic to verify Razorpay signature would go here
    // If verified, we mark the order as paid in the DB
    
    return { success: true }
  })

export const trackOrderFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string, email: string }) => z.object({ id: z.string(), email: z.string().email() }).parse(data))
  .handler(async ({ data }) => {
    const isMock = !process.env.VITE_SUPABASE_URL;
    
    if (isMock) {
      const order = mockDb.getOrder(data.id, data.email);
      if (!order) throw new Error('Order not found or email mismatch');
      return order;
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', data.id)
      .eq('email', data.email)
      .single()

    if (error || !order) throw new Error('Order not found or email mismatch')
    return order
  })

export const getAdminOrdersFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const isMock = !process.env.VITE_SUPABASE_URL;
    
    if (isMock) {
      return mockDb.getOrders();
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  })
