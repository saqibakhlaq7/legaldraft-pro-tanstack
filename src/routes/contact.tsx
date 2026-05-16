import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { createFileRoute } from '@tanstack/react-router'
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Clock,
  Linkedin,
  Twitter,
  Instagram,
  CheckCircle2,
  Loader2,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { submitContact, type ContactPayload } from '@/services/api'
import { IS_MOCK_MODE } from '@/config/env'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Order Status',
  'Custom Document Request',
  'Pricing Question',
  'Technical Support',
  'Feedback',
  'Other',
]

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    orderId: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {}
    if (!formData.name.trim()) nextErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Invalid email address'
    }
    if (!formData.subject) nextErrors.subject = 'Subject is required'
    if (!formData.message.trim()) nextErrors.message = 'Message is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      if (IS_MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        toast.success('Message sent successfully (mock mode)')
        setIsSuccess(true)
        setIsSubmitting(false)
        return
      }

      const payload: ContactPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
        orderId: formData.orderId || undefined,
      }

      await submitContact(payload)
      toast.success('Message sent successfully! We will get back to you soon.')
      setIsSuccess(true)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to send message. Please try again.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      orderId: '',
    })
    setIsSuccess(false)
    setErrors({})
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <div className="min-h-[100dvh] bg-cream-50">
      <Toaster />

      {/* Header */}
      <div className="bg-navy-900 pt-[72px]">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.12em] mb-4">
              Get in Touch
            </p>
            <h1 className="font-display text-4xl lg:text-5xl text-white">
              We&apos;re Here to Help
            </h1>
            <p className="mt-5 text-slate-400 text-lg max-w-xl mx-auto">
              Have questions about a document? Need a custom quote? Reach out and we&apos;ll respond within a
              few hours.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left — Contact Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white border border-cream-200 rounded-2xl p-10 space-y-10 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-navy-900 mb-1">Email Us</h4>
                  <a href="mailto:support@legaldraft.pro" className="text-slate-600 hover:text-gold-600 transition-colors">
                    support@legaldraft.pro
                  </a>
                  <p className="text-slate-400 text-xs mt-2">Available 24/7 for your queries</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-navy-900 mb-1">Call Us</h4>
                  <a href="tel:+919876543210" className="text-slate-600 hover:text-gold-600 transition-colors">
                    +91 98765 43210
                  </a>
                  <p className="text-slate-400 text-xs mt-2">Mon–Sat, 10 AM – 7 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-navy-900 mb-1">Our Office</h4>
                  <p className="text-slate-600">
                    Suite 402, Rajendra Place, New Delhi – 110008
                  </p>
                  <p className="text-slate-400 text-xs mt-2">In-person visits by appointment</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-navy-900 mb-1">Response Time</h4>
                  <p className="text-slate-600">Within 2–4 hours</p>
                  <p className="text-slate-400 text-xs mt-2">During business hours</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="px-4">
              <p className="text-navy-900 text-xs uppercase tracking-widest font-bold mb-6">Follow Us</p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-slate-400 hover:text-gold-500 transition-colors"><Linkedin className="w-6 h-6" /></a>
                <a href="#" className="text-slate-400 hover:text-gold-500 transition-colors"><Twitter className="w-6 h-6" /></a>
                <a href="#" className="text-slate-400 hover:text-gold-500 transition-colors"><Instagram className="w-6 h-6" /></a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-cream-200 rounded-2xl p-8 sm:p-12 shadow-xl">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="font-display text-2xl text-navy-900 mb-4">Message Sent!</h3>
                  <p className="text-slate-600 mb-10 max-w-sm mx-auto">
                    Thank you for reaching out. We&apos;ve received your message and will get back to you within a few hours.
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-gold-600 hover:text-gold-700 font-bold uppercase tracking-wider text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-navy-900 font-semibold">Name <span className="text-error">*</span></Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="bg-cream-50/50"
                      />
                      {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-navy-900 font-semibold">Email <span className="text-error">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="bg-cream-50/50"
                      />
                      {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-navy-900 font-semibold">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="bg-cream-50/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-navy-900 font-semibold">Subject <span className="text-error">*</span></Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(val) => updateField('subject', val)}
                      >
                        <SelectTrigger id="subject" className="w-full bg-cream-50/50">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECT_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.subject && <p className="text-error text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-navy-900 font-semibold">Message <span className="text-error">*</span></Label>
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      className="bg-cream-50/50 resize-none"
                    />
                    {errors.message && <p className="text-error text-xs mt-1">{errors.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderId" className="text-navy-900 font-semibold">Order ID (if applicable)</Label>
                    <Input
                      id="orderId"
                      placeholder="LD-XXXXXX"
                      value={formData.orderId}
                      onChange={(e) => updateField('orderId', e.target.value)}
                      className="bg-cream-50/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-6 text-sm uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-3" /> Sending Message...</>
                    ) : (
                      <><Send className="w-5 h-5 mr-3" /> Send Message</>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
