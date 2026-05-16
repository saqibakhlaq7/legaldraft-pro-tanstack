import { useState, useCallback, useEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createFileRoute } from '@tanstack/react-router'
import {
  ClipboardList,
  Check,
  ChevronRight,
  Upload,
  X,
  Info,
  Lock,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Loader2,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  createOrder,
  verifyPayment,
  createRazorpayOrder,
  type CreateOrderPayload,
} from '@/services/api'
import { API_URL, RAZORPAY_KEY_ID, IS_MOCK_MODE } from '@/config/env'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/request')({
  component: Request,
})

/* ------------------------------------------------------------------ */
/*  Document data                                                     */
/* ------------------------------------------------------------------ */

const DOCUMENT_CATEGORIES: Record<string, string[]> = {
  Affidavits: [
    'General Affidavit',
    'Name Change Affidavit',
    'Address Proof Affidavit',
    'Date of Birth Affidavit',
    'Income Affidavit',
  ],
  Agreements: [
    'Rental Agreement',
    'Leave & License Agreement',
    'Partnership Deed',
    'Service Agreement',
    'Non-Disclosure Agreement',
    'Employment Contract',
  ],
  Property: [
    'Sale Deed Draft',
    'Gift Deed',
    'Power of Attorney',
    'Will / Testament',
    'Relinquishment Deed',
  ],
  Notices: [
    'Legal Notice',
    ' eviction Notice',
    'Cheque Bounce Notice (Section 138)',
    'Consumer Complaint Notice',
  ],
  Court: [
    'Civil Suit Draft',
    'Writ Petition',
    'Bail Application',
    'Caveat Petition',
  ],
  Corporate: [
    'Company Registration Drafts',
    'MOA / AOA',
    'Board Resolution',
    'Shareholders Agreement',
  ],
  Family: [
    'Marriage Registration',
    'Divorce Petition Draft',
    'Maintenance Application',
    'Custody Petition',
  ],
  Employment: [
    'Appointment Letter',
    'Termination Letter',
    'Experience Certificate',
    'Relieving Letter',
  ],
  'GST & Tax': [
    'GST Registration Application',
    'Reply to GST Notice',
    'Income Tax Appeal Draft',
  ],
  Other: ['Custom Document Request'],
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
  'Andaman & Nicobar',
  'Dadra & Nagar Haveli',
  'Daman & Diu',
  'Lakshadweep',
]

const BASE_PRICES: Record<string, number> = {
  'General Affidavit': 299,
  'Name Change Affidavit': 399,
  'Address Proof Affidavit': 349,
  'Date of Birth Affidavit': 349,
  'Income Affidavit': 399,
  'Rental Agreement': 499,
  'Leave & License Agreement': 599,
  'Partnership Deed': 799,
  'Service Agreement': 699,
  'Non-Disclosure Agreement': 499,
  'Employment Contract': 599,
  'Sale Deed Draft': 899,
  'Gift Deed': 799,
  'Power of Attorney': 599,
  'Will / Testament': 999,
  'Relinquishment Deed': 899,
  'Legal Notice': 699,
  ' eviction Notice': 599,
  'Cheque Bounce Notice (Section 138)': 799,
  'Consumer Complaint Notice': 699,
  'Civil Suit Draft': 1299,
  'Writ Petition': 1499,
  'Bail Application': 1199,
  'Caveat Petition': 899,
  'Company Registration Drafts': 1499,
  'MOA / AOA': 1199,
  'Board Resolution': 499,
  'Shareholders Agreement': 1499,
  'Marriage Registration': 599,
  'Divorce Petition Draft': 1299,
  'Maintenance Application': 999,
  'Custody Petition': 1199,
  'Appointment Letter': 349,
  'Termination Letter': 449,
  'Experience Certificate': 249,
  'Relieving Letter': 249,
  'GST Registration Application': 799,
  'Reply to GST Notice': 999,
  'Income Tax Appeal Draft': 1199,
  'Custom Document Request': 0,
}

const LAWYER_SIGN_FEE = 999
const EXPRESS_FEE = 299

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface FormData {
  category: string
  documentType: string
  lawyerSigned: boolean
  state: string
  fullName: string
  email: string
  phone: string
  purpose: string
  details: string
  urgency: 'standard' | 'express'
  files: File[]
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

/* ------------------------------------------------------------------ */
/*  Razorpay script loader                                            */
/* ------------------------------------------------------------------ */

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
        resolve(false);
        return;
    }
    if (document.getElementById('razorpay-script')) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function calculatePrice(formData: FormData): number {
  const base = BASE_PRICES[formData.documentType] || 499
  let total = base
  if (formData.lawyerSigned) total += LAWYER_SIGN_FEE
  if (formData.urgency === 'express') total += EXPRESS_FEE
  return total
}

function generateMockOrderId(): string {
  return `LD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

/* ------------------------------------------------------------------ */
/*  Stepper component                                                 */
/* ------------------------------------------------------------------ */

function Stepper({ currentStep }: { currentStep: number }) {
  const steps = ['Document', 'Details', 'Review', 'Payment']
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((label, index) => {
        const stepNum = index + 1
        const isCompleted = currentStep > stepNum
        const isActive = currentStep === stepNum

        return (
          <div key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  isCompleted
                    ? 'bg-success text-white'
                    : isActive
                      ? 'bg-gold-500 text-navy-900'
                      : 'border-2 border-navy-600 text-slate-300'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : stepNum}
              </div>
              <span
                className={cn(
                  'hidden sm:block text-xs mt-2 font-medium transition-colors',
                  isCompleted || isActive ? 'text-white' : 'text-slate-500'
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-8 sm:w-16 h-0.5 transition-colors duration-300',
                  isCompleted ? 'bg-success' : 'bg-navy-600'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Document Selection                                       */
/* ------------------------------------------------------------------ */

function StepDocument({
  formData,
  onChange,
  onContinue,
}: {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  onContinue: () => void
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const isValid =
    formData.category && formData.documentType && formData.state

  const availableDocs = DOCUMENT_CATEGORIES[formData.category] || []

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="category" className="text-slate-800 mb-2 block">
          Select Category <span className="text-error">*</span>
        </Label>
        <Select
          value={formData.category}
          onValueChange={(val) => {
            onChange({ category: val, documentType: '' })
          }}
        >
          <SelectTrigger
            id="category"
            className="w-full"
            onBlur={() => setTouched((p) => ({ ...p, category: true }))}
          >
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(DOCUMENT_CATEGORIES).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.category && !formData.category && (
          <p className="text-error text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <Label htmlFor="documentType" className="text-slate-800 mb-2 block">
          Select Document <span className="text-error">*</span>
        </Label>
        <Select
          value={formData.documentType}
          onValueChange={(val) => onChange({ documentType: val })}
          disabled={!formData.category}
        >
          <SelectTrigger
            id="documentType"
            className="w-full"
            onBlur={() => setTouched((p) => ({ ...p, documentType: true }))}
          >
            <SelectValue placeholder="Choose a document type" />
          </SelectTrigger>
          <SelectContent>
            {availableDocs.map((doc) => (
              <SelectItem key={doc} value={doc}>
                {doc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.documentType && !formData.documentType && (
          <p className="text-error text-sm mt-1">This field is required</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="lawyerSigned"
          checked={formData.lawyerSigned}
          onCheckedChange={(checked) =>
            onChange({ lawyerSigned: checked === true })
          }
        />
        <div>
          <Label htmlFor="lawyerSigned" className="text-slate-800 cursor-pointer">
            Lawyer Sign Required?
          </Label>
          <p className="text-slate-500 text-sm">
            Add ₹{LAWYER_SIGN_FEE} for lawyer review and signature
          </p>
        </div>
      </div>

      {formData.lawyerSigned && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4"
        >
          <p className="text-gold-500 text-sm font-medium">
            Your document will be reviewed and signed by our partnered Delhi
            Court lawyer.
          </p>
        </motion.div>
      )}

      <div>
        <Label htmlFor="state" className="text-slate-800 mb-2 block">
          Which state do you need this for? <span className="text-error">*</span>
        </Label>
        <Select
          value={formData.state}
          onValueChange={(val) => onChange({ state: val })}
        >
          <SelectTrigger
            id="state"
            className="w-full"
            onBlur={() => setTouched((p) => ({ ...p, state: true }))}
          >
            <SelectValue placeholder="Select state / UT" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {INDIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.state && !formData.state && (
          <p className="text-error text-sm mt-1">This field is required</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={onContinue}
          disabled={!isValid}
          className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-medium px-8"
        >
          Continue to Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Details                                                 */
/* ------------------------------------------------------------------ */

function StepDetails({
  formData,
  onChange,
  onBack,
  onContinue,
}: {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  onBack: () => void
  onContinue: () => void
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const isValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.phone.trim() &&
    formData.purpose.trim() &&
    formData.details.trim()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected) return
    const newFiles = Array.from(selected).filter(
      (f) => f.size <= 10 * 1024 * 1024
    )
    if (newFiles.length < selected.length) {
      toast.error('Some files exceeded 10MB limit')
    }
    onChange({ files: [...formData.files, ...newFiles] })
  }

  const removeFile = (index: number) => {
    const updated = [...formData.files]
    updated.splice(index, 1)
    onChange({ files: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="fullName" className="text-slate-800 mb-2 block">
          Your Full Name <span className="text-error">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="As it should appear on the document"
          value={formData.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
        />
        {touched.fullName && !formData.fullName.trim() && (
          <p className="text-error text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="text-slate-800 mb-2 block">
          Email Address <span className="text-error">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="document will be sent here"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
        />
        {touched.email && !formData.email.trim() && (
          <p className="text-error text-sm mt-1">This field is required</p>
        )}
        {touched.email &&
          formData.email.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
            <p className="text-error text-sm mt-1">Invalid email address</p>
          )}
      </div>

      <div>
        <Label htmlFor="phone" className="text-slate-800 mb-2 block">
          Phone Number <span className="text-error">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
        />
        <p className="text-slate-500 text-xs mt-1">
          We&apos;ll only contact you regarding this request
        </p>
        {touched.phone && !formData.phone.trim() && (
          <p className="text-error text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <Label htmlFor="purpose" className="text-slate-800 mb-2 block">
          What is this document for? <span className="text-error">*</span>
        </Label>
        <Textarea
          id="purpose"
          rows={4}
          maxLength={500}
          placeholder="e.g., Filing a property dispute in Delhi District Court..."
          value={formData.purpose}
          onChange={(e) => onChange({ purpose: e.target.value })}
          onBlur={() => setTouched((p) => ({ ...p, purpose: true }))}
        />
        <div className="text-right text-slate-500 text-xs mt-1">
          {formData.purpose.length}/500
        </div>
        {touched.purpose && !formData.purpose.trim() && (
          <p className="text-error text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <Label htmlFor="details" className="text-slate-800 mb-2 block">
          Specific Details & Requirements <span className="text-error">*</span>
        </Label>
        <Textarea
          id="details"
          rows={6}
          maxLength={2000}
          placeholder="Include all relevant details: names, addresses, dates, amounts, property details, parties involved, terms, conditions, special clauses..."
          value={formData.details}
          onChange={(e) => onChange({ details: e.target.value })}
          onBlur={() => setTouched((p) => ({ ...p, details: true }))}
        />
        <div className="text-right text-slate-500 text-xs mt-1">
          {formData.details.length}/2000
        </div>
        {touched.details && !formData.details.trim() && (
          <p className="text-error text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <Label className="text-slate-800 mb-2 block">
          Upload Supporting Documents (Optional)
        </Label>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cream-200 rounded-lg cursor-pointer hover:border-gold-500 hover:bg-gold-500/5 transition-colors"
        >
          <Upload className="w-8 h-8 text-slate-500 mb-2" />
          <p className="text-slate-500 text-sm">
            Drag & drop files here or click to browse
          </p>
          <p className="text-slate-400 text-xs mt-1">
            PDF, JPG, PNG up to 10MB each
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {formData.files.length > 0 && (
          <div className="mt-3 space-y-2">
            {formData.files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between bg-cream-100 rounded px-3 py-2"
              >
                <span className="text-sm text-slate-800 truncate max-w-[200px]">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-slate-500 hover:text-error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label className="text-slate-800 mb-2 block">How urgent is this?</Label>
        <RadioGroup
          value={formData.urgency}
          onValueChange={(val) =>
            onChange({ urgency: val as 'standard' | 'express' })
          }
          className="gap-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="text-slate-800 cursor-pointer">
              Standard (24 hours)
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="express" id="express" />
            <Label htmlFor="express" className="text-slate-800 cursor-pointer">
              Express (12 hours)
            </Label>
            {formData.urgency === 'express' && (
              <span className="bg-gold-500/10 text-gold-500 text-xs font-medium px-2 py-0.5 rounded">
                +₹{EXPRESS_FEE}
              </span>
            )}
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-navy-700 text-navy-900 hover:bg-navy-700/10"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={!isValid}
          className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-medium px-8"
        >
          Continue to Review
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Review                                                   */
/* ------------------------------------------------------------------ */

function StepReview({
  formData,
  onBack,
  onContinue,
}: {
  formData: FormData
  onBack: () => void
  onContinue: () => void
}) {
  const total = calculatePrice(formData)
  const base = BASE_PRICES[formData.documentType] || 499

  return (
    <div className="space-y-6">
      <div className="bg-cream-100 border border-cream-200 rounded-lg p-5">
        <h4 className="font-body font-semibold text-slate-800 mb-3">
          Document Info
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Document Type</span>
            <span className="text-slate-800 font-medium">
              {formData.documentType}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Category</span>
            <span className="text-slate-800 font-medium">
              {formData.category}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">State</span>
            <span className="text-slate-800 font-medium">{formData.state}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Lawyer Signed</span>
            <span className="text-slate-800 font-medium">
              {formData.lawyerSigned ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-cream-100 border border-cream-200 rounded-lg p-5">
        <h4 className="font-body font-semibold text-slate-800 mb-3">
          Your Details
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Name</span>
            <span className="text-slate-800 font-medium">
              {formData.fullName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span className="text-slate-800 font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Phone</span>
            <span className="text-slate-800 font-medium">{formData.phone}</span>
          </div>
        </div>
      </div>

      <div className="bg-cream-100 border border-cream-200 rounded-lg p-5">
        <h4 className="font-body font-semibold text-slate-800 mb-3">
          Requirements
        </h4>
        <p className="text-slate-800 text-sm">{formData.purpose}</p>
        <p className="text-slate-500 text-sm mt-2">{formData.details}</p>
        {formData.files.length > 0 && (
          <div className="mt-2">
            <span className="text-slate-500 text-sm">Files: </span>
            {formData.files.map((f) => f.name).join(', ')}
          </div>
        )}
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-lg p-6">
        <h4 className="font-body font-semibold text-white mb-4">
          Pricing Summary
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">{formData.documentType}</span>
            <span className="text-white font-medium">₹{base}</span>
          </div>
          {formData.lawyerSigned && (
            <div className="flex justify-between">
              <span className="text-slate-300">Lawyer Verification</span>
              <span className="text-gold-500 font-medium">₹{LAWYER_SIGN_FEE}</span>
            </div>
          )}
          {formData.urgency === 'express' && (
            <div className="flex justify-between">
              <span className="text-slate-300">Express Delivery (12h)</span>
              <span className="text-gold-500 font-medium">₹{EXPRESS_FEE}</span>
            </div>
          )}
        </div>
        <div className="border-t border-navy-700 my-3" />
        <div className="flex justify-between items-center">
          <span className="text-white font-semibold">Total Amount</span>
          <span className="text-gold-500 text-xl font-display">₹{total}</span>
        </div>
        <p className="text-slate-500 text-xs text-center mt-2">
          Inclusive of all taxes
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-navy-700 text-navy-900 hover:bg-navy-700/10"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onContinue}
          className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-medium px-8"
        >
          Proceed to Payment
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 4 — Payment                                                 */
/* ------------------------------------------------------------------ */

function StepPayment({
  formData,
  onBack,
  onSuccess,
}: {
  formData: FormData
  onBack: () => void
  onSuccess: (orderId: string) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const total = calculatePrice(formData)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      if (IS_MOCK_MODE) {
        // Mock flow: simulate payment delay
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const mockOrderId = generateMockOrderId()
        toast.success('Payment successful (mock mode)')
        onSuccess(mockOrderId)
        return
      }

      // Real Razorpay flow
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay checkout script')
      }

      // Step 1: Create Razorpay order on backend
      const razorpayOrder = await createRazorpayOrder(total)

      // Step 2: Open Razorpay checkout
      const razorpayKey = RAZORPAY_KEY_ID
      if (!razorpayKey) {
        throw new Error('Razorpay key ID is not configured')
      }

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'LegalDraft Pro',
        description: `${formData.documentType} - ${formData.category}`,
        order_id: razorpayOrder.id,
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // Step 3: Verify payment
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })

            // Step 4: Create order in backend
            const payload: CreateOrderPayload = {
              documentType: formData.documentType,
              category: formData.category,
              state: formData.state,
              lawyerSigned: formData.lawyerSigned,
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              purpose: formData.purpose,
              details: formData.details,
              urgency: formData.urgency,
              amount: total,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            }

            const order = await createOrder(payload)
            toast.success('Payment successful! Your order has been placed.')
            onSuccess(order.id)
          } catch (err) {
            const msg =
              err instanceof Error ? err.message : 'Payment verification failed'
            toast.error(msg)
            setIsLoading(false)
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#C9A84C',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          },
        },
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Payment initialization failed'
      toast.error(msg)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-navy-800/5 border border-navy-700/20 rounded-lg p-4">
        <Info className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
        <p className="text-slate-600 text-sm">
          You will be redirected to Razorpay&apos;s secure payment gateway to
          complete your transaction. Your document will be prepared immediately
          after payment confirmation.
        </p>
      </div>

      <div className="bg-cream-100 border border-cream-200 rounded-lg p-5">
        <h4 className="font-body font-semibold text-slate-800 mb-3">
          Order Summary
        </h4>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-slate-600">{formData.documentType}</span>
          <span className="text-slate-800 font-semibold">₹{total}</span>
        </div>
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-medium py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>Pay ₹{total}</>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          SSL Secure
        </span>
        <span className="flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          Razorpay
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          PCI-DSS Compliant
        </span>
      </div>

      <p className="text-xs text-slate-400 text-center">
        By proceeding, you agree to our Terms of Service and acknowledge that
        work begins after payment confirmation.
      </p>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="border-navy-700 text-navy-900 hover:bg-navy-700/10"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Review
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Success State                                                     */
/* ------------------------------------------------------------------ */

function SuccessState({ orderId, email, formData }: { orderId: string; email: string; formData: FormData }) {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <motion.path
            d="M10 20 L17 27 L30 13"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        </motion.svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="font-display text-h2 text-slate-800"
      >
        Payment Successful!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-slate-500 text-sm mt-2"
      >
        Order #{orderId}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-slate-500 text-body-l max-w-lg mx-auto mt-4"
      >
        Thank you for your request. We&apos;ve received your payment and our
        legal team has begun preparing your document. You&apos;ll receive it at{' '}
        {email} within 24 hours.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="bg-cream-100 border border-cream-200 rounded-lg p-6 max-w-md mx-auto mt-8 text-left"
      >
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">Document</span>
          <span className="text-slate-800 font-semibold">
            {formData?.documentType}
          </span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">Amount Paid</span>
          <span className="text-slate-800 font-semibold">
            ₹{formData ? calculatePrice(formData) : 0}
          </span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">Delivery</span>
          <span className="text-slate-800 font-semibold">
            {formData?.urgency === 'express'
              ? 'Within 12 hours'
              : 'Within 24 hours'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Sent to</span>
          <span className="text-slate-800 font-semibold">{email}</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="text-slate-500 text-xs mt-6"
      >
        Need help? Contact us at support@legaldraft.pro
      </motion.p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Request Page                                                 */
/* ------------------------------------------------------------------ */

function Request() {
  const [step, setStep] = useState(1)
  const [orderId, setOrderId] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    category: '',
    documentType: '',
    lawyerSigned: false,
    state: '',
    fullName: '',
    email: '',
    phone: '',
    purpose: '',
    details: '',
    urgency: 'standard',
    files: [],
  })

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  const handleSuccess = useCallback(
    (id: string) => {
      setOrderId(id)
      setIsSuccess(true)
      setStep(5)
    },
    []
  )

  // Show API mode info toast on mount
  useEffect(() => {
    if (IS_MOCK_MODE) {
      toast.info('Running in mock mode — no real payments will be processed', {
        duration: 5000,
      })
    } else if (!RAZORPAY_KEY_ID) {
      toast.warning('Razorpay key not configured. Payments may fail.', {
        duration: 5000,
      })
    }
  }, [])

  return (
    <div className="min-h-[100dvh] bg-cream-50">
      <Toaster />

      {/* Header */}
      <div className="bg-navy-900 pt-[72px]">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <ClipboardList className="w-12 h-12 text-gold-500 mx-auto mb-6" />
            <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.12em] mb-4">
              Document Request
            </p>
            <h1 className="font-display text-display-l text-white">
              Request Your Legal Document
            </h1>
            <p className="mt-5 text-slate-400 text-body-l max-w-xl mx-auto">
              Complete the form below with your requirements. We&apos;ll prepare
              your document and deliver it within 24 hours.
            </p>
          </motion.div>

          {!isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-10"
            >
              <Stepper currentStep={step} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-cream-200 rounded-lg shadow-[0_4px_24px_rgba(7,11,26,0.06)] p-8 sm:p-12"
            >
              <SuccessState orderId={orderId} email={formData.email} formData={formData} />
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-cream-200 rounded-lg shadow-[0_4px_24px_rgba(7,11,26,0.06)] p-8 sm:p-12"
            >
              {step === 1 && (
                <StepDocument
                  formData={formData}
                  onChange={updateFormData}
                  onContinue={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <StepDetails
                  formData={formData}
                  onChange={updateFormData}
                  onBack={() => setStep(1)}
                  onContinue={() => setStep(3)}
                />
              )}
              {step === 3 && (
                <StepReview
                  formData={formData}
                  onBack={() => setStep(2)}
                  onContinue={() => setStep(4)}
                />
              )}
              {step === 4 && (
                <StepPayment
                  formData={formData}
                  onBack={() => setStep(3)}
                  onSuccess={handleSuccess}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {IS_MOCK_MODE && (
          <div className="mt-6 text-center">
            <span className="inline-flex items-center gap-1.5 bg-navy-800/5 text-slate-500 text-xs px-3 py-1.5 rounded-full">
              <Info className="w-3 h-3" />
              Mock mode — API URL not configured ({API_URL || 'empty'})
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
