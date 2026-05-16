import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Loader2, FileText, CheckCircle2, Clock, ShieldCheck, Mail, Hash, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trackOrder } from '@/services/api'

export const Route = createFileRoute('/track')({
  component: TrackOrder,
})

function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [order, setOrder] = useState<any>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    try {
      const data = await trackOrder(orderId, email)
      setOrder(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Order not found')
      setOrder(null)
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: 'pending', label: 'Order Received', icon: FileText },
      { key: 'processing', label: 'Drafting Document', icon: Clock },
      { key: 'quality_check', label: 'Quality Assurance', icon: ShieldCheck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ]

    const statusOrder = ['pending', 'processing', 'quality_check', 'delivered']
    const currentIndex = statusOrder.indexOf(currentStatus)

    return steps.map((step, idx) => ({
      ...step,
      completed: idx < currentIndex,
      current: idx === currentIndex,
    }))
  }

  const statusSteps = order ? getStatusSteps(order.status) : []

  return (
    <div className="min-h-[100dvh] bg-cream-50 pt-[72px]">
      <div className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Search className="w-12 h-12 text-gold-500 mx-auto mb-6" />
          <h1 className="font-display text-4xl lg:text-5xl text-white">Track Your Order</h1>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto text-lg">
            Check the status of your document and estimated delivery time.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        {!order ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-cream-200 rounded-2xl p-8 sm:p-12 shadow-xl"
          >
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="orderId"
                      placeholder="LD-XXXXXX"
                      required
                      className="pl-10"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSearching}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-6 uppercase tracking-widest text-sm"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Track Order Status</>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-white border border-cream-200 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-1">Order Details</p>
                  <h2 className="text-2xl font-display text-navy-900">{order.documentType}</h2>
                  <p className="text-sm text-slate-500 mt-1">Order #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Delivery</p>
                  <p className="text-sm font-bold text-navy-900">
                    {order.urgency === 'express' ? 'Within 12 hours' : 'Within 24 hours'}
                  </p>
                </div>
              </div>

              <div className="relative px-4">
                {/* Progress line */}
                <div className="absolute top-5 left-8 right-8 h-0.5 bg-cream-100 hidden sm:block">
                    <div className="h-full bg-gold-500 w-1/3" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-8 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const Icon = step.icon
                    return (
                      <div key={step.key} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          step.completed ? 'bg-success text-white' : 
                          step.current ? 'bg-gold-500 text-navy-900 shadow-gold' : 
                          'bg-white border-2 border-cream-100 text-slate-300'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${
                          step.completed || step.current ? 'text-navy-900' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-navy-900 rounded-2xl p-8 text-white flex items-center justify-between">
              <div>
                <h4 className="font-display text-xl mb-1">Need to add details?</h4>
                <p className="text-slate-400 text-sm">If you forgot something, you can still send us more info.</p>
              </div>
              <Link to="/contact" className="text-gold-500 font-bold uppercase tracking-widest text-xs hover:text-gold-400">
                Contact Support
              </Link>
            </div>

            <button 
              onClick={() => setOrder(null)}
              className="w-full text-center text-slate-500 hover:text-navy-900 transition-colors text-sm font-medium"
            >
              Track another order
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
