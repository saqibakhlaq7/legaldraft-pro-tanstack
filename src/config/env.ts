export const API_URL = typeof window !== 'undefined' ? (window as any).ENV?.VITE_API_URL || '' : process.env.VITE_API_URL || '';
export const RAZORPAY_KEY_ID = typeof window !== 'undefined' ? (window as any).ENV?.VITE_RAZORPAY_KEY_ID || '' : process.env.VITE_RAZORPAY_KEY_ID || '';
export const IS_MOCK_MODE = !API_URL || API_URL === '';
