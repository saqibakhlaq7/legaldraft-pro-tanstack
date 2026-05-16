import { useState } from 'react'
import { motion } from 'framer-motion'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Scale, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Auth logic will go here
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-[100dvh] bg-cream-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 group">
          <Scale className="w-8 h-8 text-gold-500 transition-transform group-hover:scale-110" />
          <span className="font-display font-bold text-2xl text-navy-900">LegalDraft Pro</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-display font-bold text-navy-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Or{' '}
          <Link to="/request" className="font-medium text-gold-600 hover:text-gold-500 underline underline-offset-4">
            request a new document
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl border border-cream-200 sm:rounded-2xl sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-gold-600 hover:text-gold-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-6 uppercase tracking-widest text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                  Protected Area
                </span>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
              This login is for administrators and registered professionals. 
              Clients can track their orders using their Order ID and Email.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
