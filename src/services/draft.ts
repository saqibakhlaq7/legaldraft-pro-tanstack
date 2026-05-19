import { createServerFn } from '@tanstack/react-start'
import { Resend } from 'resend'
import { z } from 'zod'
import { PDFDocument, StandardFonts } from 'pdf-lib'

// ─── Configuration ─────────────────────────────────────────────

// Resend API Key - hardcoded for reliability (Production key)
const RESEND_API_KEY = 're_DMApmKv8_ER8YfgrXRkEKepoYgUDGts8u'
const resend = new Resend(RESEND_API_KEY)

// OpenRouter API (OpenAI-compatible)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

// ─── Types & Schemas ───────────────────────────────────────────

export const DraftRequestSchema = z.object({
  documentType: z.string(),
  email: z.string().email(),
  // Affidavit
  deponentName: z.string().optional(),
  fatherName: z.string().optional(),
  age: z.string().optional(),
  address: z.string().optional(),
  purpose: z.string().optional(),
  facts: z.string().optional(),
  jurisdiction: z.string().optional(),
  date: z.string().optional(),
  // Rent Agreement
  landlordName: z.string().optional(),
  landlordAddress: z.string().optional(),
  tenantName: z.string().optional(),
  tenantAddress: z.string().optional(),
  propertyAddress: z.string().optional(),
  rentAmount: z.string().optional(),
  depositAmount: z.string().optional(),
  duration: z.string().optional(),
  // Legal Notice
  senderName: z.string().optional(),
  senderAddress: z.string().optional(),
  recipientName: z.string().optional(),
  recipientAddress: z.string().optional(),
  causeOfAction: z.string().optional(),
  reliefSought: z.string().optional(),
  // Generic
  additionalDetails: z.string().optional(),
})

export type DraftRequest = z.infer<typeof DraftRequestSchema>

export interface DraftResult {
  success: boolean
  message: string
  emailId?: string
  emailStatus?: string
  draftPreview?: string
  pdfSize?: number
  error?: string
}

// ─── AI Draft Generation ───────────────────────────────────────

async function generateDraftWithAI(data: DraftRequest): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured. Add it in Lovable Environment Variables.')
  }

  const systemPrompt = `You are an expert Indian legal document drafter with 20+ years of experience in Indian civil and criminal law. You draft court-ready legal documents in formal Indian legal English.

CRITICAL RULES:
1. Use proper Indian legal terminology (Affiant, Deponent, Notary, Stamp Duty, etc.)
2. Include all necessary legal clauses, declarations, and boilerplate
3. Format with clear sections, paragraphs, and proper numbering
4. Use formal, respectful but assertive legal language
5. Include jurisdictional references where applicable (District Court, High Court, etc.)
6. Reference relevant Indian laws (IPC, CrPC, Contract Act, etc.) where appropriate
7. NEVER include any AI disclaimers or references to being an AI
8. The document must look like it was drafted by a senior advocate at a prestigious Indian law firm
9. Include proper attestation clauses, witness clauses, and execution formalities
10. For affidavits: include proper oath/affirmation language as per Indian law
11. For agreements: include proper consideration, terms, termination, jurisdiction clauses
12. For notices: include proper cause of action, legal basis, and demand/relief sections`

  let userPrompt = `Draft a professional ${data.documentType} under Indian law with the following details:\n\n`

  // Build document-specific prompts
  if (data.documentType === 'Affidavit') {
    userPrompt += `AFFIDAVIT DETAILS:\n`
    if (data.deponentName) userPrompt += `Deponent Name: ${data.deponentName}\n`
    if (data.fatherName) userPrompt += `Father's/Husband's Name: ${data.fatherName}\n`
    if (data.age) userPrompt += `Age: ${data.age}\n`
    if (data.address) userPrompt += `Address: ${data.address}\n`
    if (data.purpose) userPrompt += `Purpose: ${data.purpose}\n`
    if (data.facts) userPrompt += `Facts to be Sworn:\n${data.facts}\n`
    if (data.jurisdiction) userPrompt += `Jurisdiction: ${data.jurisdiction}\n`
    if (data.date) userPrompt += `Date: ${data.date}\n`
    userPrompt += `\nREQUIREMENTS:\n`
    userPrompt += `- Start with proper title "AFFIDAVIT"\n`
    userPrompt += `- Include deponent's declaration of truth\n`
    userPrompt += `- Numbered paragraphs for each fact\n`
    userPrompt += `- Proper oath/solemn affirmation language\n`
    userPrompt += `- Verification clause\n`
    userPrompt += `- Placeholder for Notary Public seal and signature\n`
    userPrompt += `- Court fee/stamp duty reference where applicable\n`
  } else if (data.documentType === 'Rent Agreement') {
    userPrompt += `RENT AGREEMENT DETAILS:\n`
    if (data.landlordName) userPrompt += `Landlord Name: ${data.landlordName}\n`
    if (data.landlordAddress) userPrompt += `Landlord Address: ${data.landlordAddress}\n`
    if (data.tenantName) userPrompt += `Tenant Name: ${data.tenantName}\n`
    if (data.tenantAddress) userPrompt += `Tenant Address: ${data.tenantAddress}\n`
    if (data.propertyAddress) userPrompt += `Property Address: ${data.propertyAddress}\n`
    if (data.rentAmount) userPrompt += `Monthly Rent: ₹${data.rentAmount}\n`
    if (data.depositAmount) userPrompt += `Security Deposit: ₹${data.depositAmount}\n`
    if (data.duration) userPrompt += `Duration: ${data.duration}\n`
    userPrompt += `\nREQUIREMENTS:\n`
    userPrompt += `- Proper "RENT AGREEMENT" title\n`
    userPrompt += `- Parties clause (Landlord and Tenant)\n`
    userPrompt += `- Property description\n`
    userPrompt += `- Term and renewal clauses\n`
    userPrompt += `- Rent, deposit, and payment terms\n`
    userPrompt += `- Maintenance and utility responsibilities\n`
    userPrompt += `- Termination and notice period clauses\n`
    userPrompt += `- Lock-in period if applicable\n`
    userPrompt += `- Dispute resolution and jurisdiction\n`
    userPrompt += `- Witness and execution clauses\n`
    userPrompt += `- Compliance with Rent Control Act where applicable\n`
  } else if (data.documentType === 'Legal Notice') {
    userPrompt += `LEGAL NOTICE DETAILS:\n`
    if (data.senderName) userPrompt += `Sender/Client Name: ${data.senderName}\n`
    if (data.senderAddress) userPrompt += `Sender Address: ${data.senderAddress}\n`
    if (data.recipientName) userPrompt += `Recipient Name: ${data.recipientName}\n`
    if (data.recipientAddress) userPrompt += `Recipient Address: ${data.recipientAddress}\n`
    if (data.causeOfAction) userPrompt += `Cause of Action:\n${data.causeOfAction}\n`
    if (data.reliefSought) userPrompt += `Relief/Action Sought:\n${data.reliefSought}\n`
    userPrompt += `\nREQUIREMENTS:\n`
    userPrompt += `- Proper "LEGAL NOTICE" title with Advocate reference\n`
    userPrompt += `- Sender and recipient details\n`
    userPrompt += `- Clear cause of action with legal basis\n`
    userPrompt += `- Specific relief/demands with time limit (usually 15-30 days)\n`
    userPrompt += `- Consequences of non-compliance (legal action warning)\n`
    userPrompt += `- Jurisdiction reference\n`
    userPrompt += `- Professional but firm tone\n`
    userPrompt += `- Placeholder for Advocate signature\n`
  } else {
    userPrompt += `DOCUMENT DETAILS:\n`
    if (data.deponentName || data.senderName || data.landlordName) {
      userPrompt += `Primary Party: ${data.deponentName || data.senderName || data.landlordName}\n`
    }
    if (data.address || data.senderAddress || data.landlordAddress) {
      userPrompt += `Address: ${data.address || data.senderAddress || data.landlordAddress}\n`
    }
    if (data.purpose || data.causeOfAction) {
      userPrompt += `Purpose/Cause: ${data.purpose || data.causeOfAction}\n`
    }
    if (data.facts || data.additionalDetails) {
      userPrompt += `Details:\n${data.facts || data.additionalDetails}\n`
    }
    if (data.jurisdiction) userPrompt += `Jurisdiction: ${data.jurisdiction}\n`
    if (data.date) userPrompt += `Date: ${data.date}\n`
  }

  if (data.additionalDetails) {
    userPrompt += `\nADDITIONAL REQUIREMENTS:\n${data.additionalDetails}\n`
  }

  userPrompt += `\nOUTPUT FORMAT:\n`
  userPrompt += `- Use formal Indian legal English\n`
  userPrompt += `- Include all standard clauses for this document type under Indian law\n`
  userPrompt += `- Format with proper legal numbering (1., 1.1, etc.)\n`
  userPrompt += `- Include signature/execution blocks\n`
  userPrompt += `- Add stamp duty/court fee references where applicable\n`
  userPrompt += `- Total length: comprehensive but concise (2-5 pages when printed)\n`

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://legaldraft-pro.vercel.app',
      'X-Title': 'LegalDraft Pro India',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 6000,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OpenRouter API error:', response.status, errorText)
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  const content = result.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('AI returned empty draft content')
  }

  return content
}

// ─── PDF Creation ──────────────────────────────────────────────

async function createPDF(draftText: string, documentType: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const regularFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  const margin = 60
  const lineHeight = 14
  const pageWidth = 612  // US Letter width
  const pageHeight = 792 // US Letter height
  const contentWidth = pageWidth - 2 * margin

  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  // Title
  const title = `LEGAL DRAFT: ${documentType.toUpperCase()}`
  const titleWidth = boldFont.widthOfTextAtSize(title, 16)
  page.drawText(title, {
    x: (pageWidth - titleWidth) / 2,
    y,
    size: 16,
    font: boldFont,
  })
  y -= 25

  // Horizontal line
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: { r: 0.2, g: 0.2, b: 0.2 },
  })
  y -= 20

  // Process content
  const paragraphs = draftText.split('\n')

  for (const paragraph of paragraphs) {
    if (y < margin + lineHeight * 2) {
      page = pdfDoc.addPage([pageWidth, pageHeight])
      y = pageHeight - margin
    }

    const trimmed = paragraph.trim()
    if (!trimmed) {
      y -= lineHeight * 0.8
      continue
    }

    // Detect headings
    const isHeading = /^[0-9]+[.)]\s/.test(trimmed) ||
                      /^[A-Z][A-Z\s]{3,}[A-Z]$/.test(trimmed) ||
                      trimmed.length < 50 && trimmed.endsWith(':')
    const isSubHeading = /^\s{2,}[0-9]+[.)]/.test(paragraph)

    const currentFont = isHeading ? boldFont : regularFont
    const currentSize = isHeading ? 12 : 11
    const currentLineHeight = isHeading ? 18 : lineHeight
    const indent = isSubHeading ? margin + 20 : margin

    // Word wrap
    const words = trimmed.split(' ')
    let currentLine = ''
    const lines: string[] = []

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = currentFont.widthOfTextAtSize(testLine, currentSize)

      if (testWidth > contentWidth - (isSubHeading ? 20 : 0) && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) lines.push(currentLine)

    for (const line of lines) {
      if (y < margin + currentLineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = pageHeight - margin
      }

      page.drawText(line, {
        x: indent,
        y,
        size: currentSize,
        font: currentFont,
        color: { r: 0.1, g: 0.1, b: 0.1 },
      })
      y -= currentLineHeight
    }

    y -= 4 // Paragraph spacing
  }

  // Footer on all pages
  const totalPages = pdfDoc.getPages().length
  pdfDoc.getPages().forEach((p, i) => {
    const footerText = `Page ${i + 1} of ${totalPages} | LegalDraft Pro India | Draft prepared on ${new Date().toLocaleDateString('en-IN')}`
    const footerWidth = regularFont.widthOfTextAtSize(footerText, 8)
    p.drawText(footerText, {
      x: (pageWidth - footerWidth) / 2,
      y: 15,
      size: 8,
      font: regularFont,
      color: { r: 0.5, g: 0.5, b: 0.5 },
    })

    // Top border line
    p.drawLine({
      start: { x: margin, y: pageHeight - 30 },
      end: { x: pageWidth - margin, y: pageHeight - 30 },
      thickness: 0.5,
      color: { r: 0.8, g: 0.8, b: 0.8 },
    })
  })

  return await pdfDoc.save()
}

// ─── Email Sender ──────────────────────────────────────────────

async function sendEmailWithPDF(
  to: string,
  documentType: string,
  pdfBytes: Uint8Array,
  draftPreview: string
): Promise<{ id: string; status: string }> {
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64')
  const pdfSizeKB = Math.round(pdfBytes.length / 1024)
  const fileName = `${documentType.replace(/\s+/g, '_').toLowerCase()}_draft.pdf`

  const { data: emailData, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: to,
    subject: `Your ${documentType} Draft is Ready - LegalDraft Pro India`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
          .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #1e3a5f; font-size: 24px; margin-bottom: 20px; border-bottom: 3px solid #c9a227; padding-bottom: 10px; }
          .highlight { background: #f5f5f5; padding: 15px; border-left: 4px solid #1e3a5f; margin: 20px 0; border-radius: 4px; }
          .warning { background: #fff8e1; padding: 12px; border-left: 4px solid #c9a227; margin: 15px 0; border-radius: 4px; font-size: 14px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center; }
          .btn { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .document-info { background: #e8f4f8; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .document-info p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your Legal Draft is Ready</h1>
          
          <p>Dear User,</p>
          
          <p>Thank you for using <strong>LegalDraft Pro India</strong>. Your legal document has been prepared by our AI legal assistant.</p>
          
          <div class="document-info">
            <p><strong>Document Type:</strong> ${documentType}</p>
            <p><strong>Date Prepared:</strong> ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>File:</strong> ${fileName} (${pdfSizeKB} KB)</p>
          </div>
          
          <p>Your draft is attached as a PDF file. Please download and review it carefully.</p>
          
          <div class="warning">
            <strong>⚠️ Important Disclaimers:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This draft is AI-generated and should be reviewed by a licensed advocate before execution</li>
              <li>Verify all facts, names, dates, and amounts before signing</li>
              <li>Ensure proper stamp duty and registration as per local laws</li>
              <li>For court filings, consult with a practicing advocate in your jurisdiction</li>
            </ul>
          </div>
          
          <div class="highlight">
            <strong>Next Steps:</strong>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Download and review the attached PDF</li>
              <li>Make any necessary corrections or additions</li>
              <li>Consult a lawyer for final verification (recommended)</li>
              <li>Print on appropriate stamp paper if required</li>
              <li>Execute with proper witnesses and notarization</li>
            </ol>
          </div>
          
          <div class="footer">
            <p><strong>LegalDraft Pro India</strong></p>
            <p>Court-ready legal documents powered by AI</p>
            <p style="margin-top: 10px; font-size: 11px; color: #999;">
              This is an automated email. Please do not reply directly.<br>
              For support, contact us through our website.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: fileName,
        content: pdfBase64,
      },
    ],
  })

  if (error) {
    console.error('Resend email error:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }

  // Validate email ID
  const emailId = emailData?.id
  if (!emailId || emailId === '0' || emailId === 0 || typeof emailId !== 'string') {
    console.warn('Resend returned invalid email ID:', emailId)
    console.log('Full response:', JSON.stringify(emailData))
    // Email might still have been sent - don't throw
    return { id: 'pending', status: 'unknown' }
  }

  // Verify it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(emailId)) {
    console.warn('Email ID is not a valid UUID format:', emailId)
    return { id: emailId, status: 'sent' }
  }

  console.log('Email sent successfully. ID:', emailId)
  return { id: emailId, status: 'sent' }
}

// ─── Main Server Function ──────────────────────────────────────

export const generateDraftFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => DraftRequestSchema.parse(data))
  .handler(async ({ data }): Promise<DraftResult> => {
    const startTime = Date.now()
    console.log(`[${new Date().toISOString()}] Draft request started:`, {
      type: data.documentType,
      email: data.email,
    })

    try {
      // Step 1: Generate draft with AI
      console.log('Step 1/3: Generating draft with AI...')
      const draftContent = await generateDraftWithAI(data)
      console.log(`Draft generated: ${draftContent.length} characters`)

      // Step 2: Create PDF
      console.log('Step 2/3: Creating PDF...')
      const pdfBytes = await createPDF(draftContent, data.documentType)
      const pdfSizeKB = Math.round(pdfBytes.length / 1024)
      console.log(`PDF created: ${pdfSizeKB} KB`)

      // Step 3: Send email
      console.log('Step 3/3: Sending email to:', data.email)
      const emailResult = await sendEmailWithPDF(
        data.email,
        data.documentType,
        pdfBytes,
        draftContent.substring(0, 500)
      )

      const duration = Date.now() - startTime
      console.log(`Draft request completed in ${duration}ms`)

      return {
        success: true,
        message: `Your ${data.documentType} draft has been generated and emailed to ${data.email}`,
        emailId: emailResult.id,
        emailStatus: emailResult.status,
        draftPreview: draftContent.substring(0, 300) + '...',
        pdfSize: pdfSizeKB,
      }
    } catch (error: any) {
      const duration = Date.now() - startTime
      console.error(`Draft request failed after ${duration}ms:`, error)

      // Return user-friendly error
      let userMessage = 'Failed to generate draft. Please try again.'

      if (error.message?.includes('OPENROUTER_API_KEY')) {
        userMessage = 'AI service is not configured. Please add OPENROUTER_API_KEY in environment variables.'
      } else if (error.message?.includes('Resend')) {
        userMessage = 'Email delivery failed. Please check your email address and try again.'
      } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        userMessage = 'Service is temporarily busy. Please try again in a few minutes.'
      }

      return {
        success: false,
        message: userMessage,
        error: error.message,
      }
    }
  })

// ─── Email Status Check ────────────────────────────────────────

export const checkEmailStatusFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ emailId: z.string() }).parse(data))
  .handler(async ({ data }) => {
    try {
      // Resend doesn't have a direct status endpoint, but we can fetch the email
      const response = await fetch(`https://api.resend.com/emails/${data.emailId}`, {
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
      })

      if (!response.ok) {
        return { status: 'unknown', error: `HTTP ${response.status}` }
      }

      const email = await response.json()
      return {
        status: email.status || 'unknown',
        sentAt: email.sent_at,
        to: email.to,
        subject: email.subject,
      }
    } catch (error: any) {
      console.error('Failed to check email status:', error)
      return { status: 'error', error: error.message }
    }
  })
