import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, FileText, CheckCircle } from 'lucide-react'
import { generateDraft } from '@/services/api'

export const Route = createFileRoute('/draft')({
  component: DraftPage,
})

const DOCUMENT_TYPES = [
  'Affidavit',
  'Rent Agreement',
  'Legal Notice',
  'Non-Disclosure Agreement',
  'Power of Attorney',
  'Last Will & Testament',
  'Court Petition',
  'Sale Deed',
  'Employment Contract',
  'Gift Deed',
]

function DraftPage() {
  const [documentType, setDocumentType] = useState('Affidavit')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; emailId?: string } | null>(null)
  const [error, setError] = useState('')

  // Affidavit fields
  const [deponentName, setDeponentName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [age, setAge] = useState('')
  const [address, setAddress] = useState('')
  const [purpose, setPurpose] = useState('')
  const [facts, setFacts] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  // Rent Agreement fields
  const [landlordName, setLandlordName] = useState('')
  const [landlordAddress, setLandlordAddress] = useState('')
  const [tenantName, setTenantName] = useState('')
  const [tenantAddress, setTenantAddress] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [rentAmount, setRentAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [duration, setDuration] = useState('')

  // Legal Notice fields
  const [senderName, setSenderName] = useState('')
  const [senderAddress, setSenderAddress] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [causeOfAction, setCauseOfAction] = useState('')
  const [reliefSought, setReliefSought] = useState('')

  // Generic
  const [additionalDetails, setAdditionalDetails] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setResult(null)

    try {
      const payload: any = {
        documentType,
        email,
        additionalDetails,
      }

      if (documentType === 'Affidavit') {
        payload.deponentName = deponentName
        payload.fatherName = fatherName
        payload.age = age
        payload.address = address
        payload.purpose = purpose
        payload.facts = facts
        payload.jurisdiction = jurisdiction
        payload.date = date
      } else if (documentType === 'Rent Agreement') {
        payload.landlordName = landlordName
        payload.landlordAddress = landlordAddress
        payload.tenantName = tenantName
        payload.tenantAddress = tenantAddress
        payload.propertyAddress = propertyAddress
        payload.rentAmount = rentAmount
        payload.depositAmount = depositAmount
        payload.duration = duration
      } else if (documentType === 'Legal Notice') {
        payload.senderName = senderName
        payload.senderAddress = senderAddress
        payload.recipientName = recipientName
        payload.recipientAddress = recipientAddress
        payload.causeOfAction = causeOfAction
        payload.reliefSought = reliefSought
      } else {
        // Generic document - use common fields
        payload.deponentName = deponentName || senderName || landlordName
        payload.address = address || senderAddress || landlordAddress
        payload.purpose = purpose || causeOfAction
        payload.facts = facts || additionalDetails
        payload.jurisdiction = jurisdiction
        payload.date = date
      }

      const response = await generateDraft(payload)
      setResult(response)
    } catch (err: any) {
      setError(err.message || 'Failed to generate draft. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Request a Legal Draft</h1>
          <p className="text-slate-600">
            Fill in the details and our AI will prepare a professional draft, delivered to your inbox.
          </p>
        </div>

        {result?.success ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 pb-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-800 mb-2">Draft Generated Successfully!</h2>
              <p className="text-green-700 mb-4">{result.message}</p>
              <p className="text-sm text-green-600">Email ID: {result.emailId}</p>
              <Button
                className="mt-4"
                onClick={() => {
                  setResult(null)
                  setEmail('')
                }}
              >
                Request Another Draft
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Details
              </CardTitle>
              <CardDescription>
                Select the document type and provide the necessary information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Document Type */}
                <div>
                  <Label htmlFor="docType">Document Type *</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger id="docType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Your Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="saqibakhlaq7@gmail.com"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Draft PDF will be emailed here. Use the Gmail associated with your Resend account.
                  </p>
                </div>

                {/* Affidavit Fields */}
                {documentType === 'Affidavit' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-slate-800">Affidavit Details</h3>
                    <div>
                      <Label>Deponent Full Name *</Label>
                      <Input value={deponentName} onChange={(e) => setDeponentName(e.target.value)} placeholder="Rahul Sharma" required />
                    </div>
                    <div>
                      <Label>Father's / Husband's Name *</Label>
                      <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Suresh Sharma" required />
                    </div>
                    <div>
                      <Label>Age *</Label>
                      <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="35" required />
                    </div>
                    <div>
                      <Label>Full Address *</Label>
                      <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="12 MG Road, Bengaluru, Karnataka, 560001" required />
                    </div>
                    <div>
                      <Label>Purpose of Affidavit *</Label>
                      <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="KYC address proof for bank" required />
                    </div>
                    <div>
                      <Label>Facts to be Sworn (numbered) *</Label>
                      <Textarea
                        value={facts}
                        onChange={(e) => setFacts(e.target.value)}
                        placeholder="1. That I am a citizen of India.&#10;2. That my name, father's name, age and address details are true and correct."
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <Label>Jurisdiction (City, State) *</Label>
                      <Input value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} placeholder="Bengaluru, Karnataka" required />
                    </div>
                    <div>
                      <Label>Date *</Label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                  </div>
                )}

                {/* Rent Agreement Fields */}
                {documentType === 'Rent Agreement' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-slate-800">Rent Agreement Details</h3>
                    <div>
                      <Label>Landlord Name *</Label>
                      <Input value={landlordName} onChange={(e) => setLandlordName(e.target.value)} placeholder="Rajesh Kumar" required />
                    </div>
                    <div>
                      <Label>Landlord Address *</Label>
                      <Textarea value={landlordAddress} onChange={(e) => setLandlordAddress(e.target.value)} placeholder="45 Park Street, Delhi" required />
                    </div>
                    <div>
                      <Label>Tenant Name *</Label>
                      <Input value={tenantName} onChange={(e) => setTenantName(e.target.value)} placeholder="Amit Verma" required />
                    </div>
                    <div>
                      <Label>Tenant Address *</Label>
                      <Textarea value={tenantAddress} onChange={(e) => setTenantAddress(e.target.value)} placeholder="12 MG Road, Bengaluru" required />
                    </div>
                    <div>
                      <Label>Property Address *</Label>
                      <Textarea value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} placeholder="Flat 301, Sunshine Apartments, Sector 12, Noida" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Monthly Rent (₹) *</Label>
                        <Input value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder="25000" required />
                      </div>
                      <div>
                        <Label>Security Deposit (₹) *</Label>
                        <Input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="50000" required />
                      </div>
                    </div>
                    <div>
                      <Label>Duration (e.g., 11 months, 1 year) *</Label>
                      <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="11 months" required />
                    </div>
                  </div>
                )}

                {/* Legal Notice Fields */}
                {documentType === 'Legal Notice' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-slate-800">Legal Notice Details</h3>
                    <div>
                      <Label>Sender Name *</Label>
                      <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" required />
                    </div>
                    <div>
                      <Label>Sender Address *</Label>
                      <Textarea value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} placeholder="Your address" required />
                    </div>
                    <div>
                      <Label>Recipient Name *</Label>
                      <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient name" required />
                    </div>
                    <div>
                      <Label>Recipient Address *</Label>
                      <Textarea value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="Recipient address" required />
                    </div>
                    <div>
                      <Label>Cause of Action / Issue *</Label>
                      <Textarea value={causeOfAction} onChange={(e) => setCauseOfAction(e.target.value)} placeholder="Describe the issue/cause of action" required />
                    </div>
                    <div>
                      <Label>Relief / Action Sought *</Label>
                      <Textarea value={reliefSought} onChange={(e) => setReliefSought(e.target.value)} placeholder="What action do you want the recipient to take?" required />
                    </div>
                  </div>
                )}

                {/* Other document types - generic fields */}
                {documentType !== 'Affidavit' && documentType !== 'Rent Agreement' && documentType !== 'Legal Notice' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-slate-800">Document Details</h3>
                    <div>
                      <Label>Party / Person Name *</Label>
                      <Input value={deponentName} onChange={(e) => setDeponentName(e.target.value)} placeholder="Full name" required />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
                    </div>
                    <div>
                      <Label>Purpose / Subject *</Label>
                      <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Purpose of document" required />
                    </div>
                    <div>
                      <Label>Details / Facts *</Label>
                      <Textarea value={facts} onChange={(e) => setFacts(e.target.value)} placeholder="Key details and facts" rows={4} required />
                    </div>
                    <div>
                      <Label>Jurisdiction (City, State)</Label>
                      <Input value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} placeholder="City, State" />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                  </div>
                )}

                {/* Additional Details (for all types) */}
                <div className="border-t pt-4">
                  <Label>Additional Details (Optional)</Label>
                  <Textarea
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Any other specific requirements or clauses you want included..."
                    rows={3}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Draft...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Generate & Email Draft
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-slate-500">
                  Drafts are AI-generated. Please review carefully and consult a lawyer before execution.
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
