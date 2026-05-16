import { createOrderFn, createRazorpayOrderFn, verifyPaymentFn, trackOrderFn } from './orders.server'

export interface CreateOrderPayload {
  documentType: string;
  category: string;
  state: string;
  lawyerSigned: boolean;
  fullName: string;
  email: string;
  phone: string;
  purpose: string;
  details: string;
  urgency: 'standard' | 'express';
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  orderId?: string;
}

export async function createOrder(data: CreateOrderPayload) {
  return createOrderFn({ data })
}

export async function createRazorpayOrder(amount: number) {
  return createRazorpayOrderFn({ data: amount })
}

export async function verifyPayment(data: any) {
  return verifyPaymentFn({ data })
}

export async function trackOrder(id: string, email: string) {
  return trackOrderFn({ data: { id, email } })
}

export async function submitContact(data: ContactPayload) {
  // Placeholder for contact submission
  console.log('Contact submitted:', data)
  return { success: true, message: 'Message sent' }
}

export type { CreateOrderPayload as OrderResponse }
