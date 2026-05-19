import { createServerFn } from '@tanstack/react-start'
import { Resend } from 'resend'
import { z } from 'zod'
import { PDFDocument, StandardFonts } from 'pdf-lib'

// Initialize Resend with API key
const resend = new Resend('re_DMApmKv8_ER8YfgrXRkEKepoYgUDGts8u')

// OpenRouter API configuration (OpenAI-compatible)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

// Schema for draft request
const DraftRequestSchema = z.object({
  documentType: z.string(),
  email: z.string().email(),
  deponentName: z.string().optional(),
  fatherName: z.string().optional(),
  age: z.string().optional(),
  address: z.string().optional(),
  purpose: z.string().optional(),
  facts: z.string().optional(),
  jurisdiction: z.string().optional(),
  date: z.string().optional(),
  // Rent Agreement fields
  landlordName: z.string().optional(),
  landlordAddress: z.string().optional(),
  tenantName: z.string().optional(),
  tenantAddress: z.string().optional(),
  propertyAddress: z.string().optional(),
  rentAmount: z.string().optional(),
  depositAmount: z.string().optional(),
  duration: z.string().optional(),
  // Legal Notice fields
  senderName: z.string().optional(),
  senderAddress: z.string().optional(),
  recipientName: z.string().optional(),
  recipientAddress: z.string().optional(),
  causeOfAction: z.string().optional(),
  reliefSought: z.string().optional(),
  // Generic
  additionalDetails: z.string().optional(),
})

async function generateDraftWithAI(data: z.infer<typeof DraftRequestSchema>): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const systemPrompt = `You are an expert Indian legal document drafter with 20+ years of experience. 
You draft court-ready legal documents in formal Indian legal English.
Follow these rules strictly:
1. Use proper Indian legal terminology and format
2. Include all necessary clauses and legal boilerplate
3. Format with clear sections, paragraphs, and numbering
4. Use formal, respectful but assertive language
5. Include jurisdictional references where applicable
6. Do not include any AI disclaimers or references to being an AI
7. The document should look like it was drafted by a senior advocate`

  let userPrompt = `Draft a ${data.documentType} with the following details:\n\n`

  // Build prompt based on document type
  if (data.deponentName) userPrompt += `Deponent/Party Name: ${data.deponentName}\n`
  if (data.fatherName) userPrompt += `Father's/Husband's Name: ${data.fatherName}\n`
  if (data.age) userPrompt += `Age: ${data.age}\n`
  if (data.address) userPrompt += `Address: ${data.address}\n`
  if (data.purpose) userPrompt += `Purpose: ${data.purpose}\n`
  if (data.facts) userPrompt += `Facts/Statements: ${data.facts}\n`
  if (data.jurisdiction) userPrompt += `Jurisdiction: ${data.jurisdiction}\n`
  if (data.date) userPrompt += `Date: ${data.date}\n`
  
  // Rent agreement specific
  if (data.landlordName) userPrompt += `Landlord Name: ${data.landlordName}\n`
  if (data.landlordAddress) userPrompt += `Landlord Address: ${data.landlordAddress}\n`
  if (data.tenantName) userPrompt += `Tenant Name: ${data.tenantName}\n`
  if (data.tenantAddress) userPrompt += `Tenant Address: ${data.tenantAddress}\n`
  if (data.propertyAddress) userPrompt += `Property Address: ${data.propertyAddress}\n`
  if (data.rentAmount) userPrompt += `Monthly Rent: ₹${data.rentAmount}\n`
  if (data.depositAmount) userPrompt += `Security Deposit: ₹${data.depositAmount}\n`
  if (data.duration) userPrompt += `Duration: ${data.duration}\n`
  
  // Legal notice specific
  if (data.senderName) userPrompt += `Sender Name: ${data.senderName}\n`
  if (data.senderAddress) userPrompt += `Sender Address: ${data.senderAddress}\n`
  if (data.recipientName) userPrompt += `Recipient Name: ${data.recipientName}\n`
  if (data.recipientAddress) userPrompt += `Recipient Address: ${data.recipientAddress}\n`
  if (data.causeOfAction) userPrompt += `Cause of Action: ${data.causeOfAction}\n`
  if (data.reliefSought) userPrompt += `Relief Sought: ${data.reliefSought}\n`
  
  if (data.additionalDetails) userPrompt += `Additional Details: ${data.additionalDetails}\n`

  userPrompt += `\nPlease draft a complete, professional ${data.documentType} ready for execution in India.`

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
      temperature: 0.3,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  return result.choices?.[0]?.message?.content || ''
}

async function createPDF(draftText: string, documentType: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  
  let page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const margin = 50
  const maxWidth = width - 2 * margin
  const lineHeight = 16
  let y = height - margin
  
  // Title
  const title = `LEGAL DRAFT: ${documentType.toUpperCase()}`
  const titleWidth = boldFont.widthOfTextAtSize(title, 18)
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y,
    size: 18,
    font: boldFont,
  })
  y -= 30

  // Horizontal line
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
  })
  y -= 20

  // Content
  const paragraphs = draftText.split('\n')
  
  for (const paragraph of paragraphs) {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage()
      y = height - margin
    }

    const trimmed = paragraph.trim()
    if (!trimmed) {
      y -= lineHeight
      continue
    }

    // Check if it's a heading (all caps or starts with numbers like "1.")
    const isHeading = /^[0-9]+[.)]/.test(trimmed) || trimmed === trimmed.toUpperCase()
    const useBold = isHeading || trimmed.length < 50
    const currentFont = useBold ? boldFont : font
    const currentSize = isHeading ? 13 : 12
    const currentLineHeight = isHeading ? 20 : lineHeight

    // Word wrap
    const words = trimmed.split(' ')
    let currentLine = ''
    const lines: string[] = []

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = currentFont.widthOfTextAtSize(testLine, currentSize)
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) lines.push(currentLine)

    for (const line of lines) {
      if (y < margin + currentLineHeight) {
        page = pdfDoc.addPage()
        y = height - margin
      }
      
      page.drawText(line, {
        x: margin,
        y,
        size: currentSize,
        font: currentFont,
      })
      y -= currentLineHeight
    }
    
    y -= 5 // Paragraph spacing
  }

  // Footer
  const pages = pdfDoc.getPages()
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i]
    const footerText = `Page ${i + 1} of ${pages.length} | Draft prepared by LegalDraft Pro India`
    const footerWidth = font.widthOfTextAtSize(footerText, 9)
    p.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 20,
      size: 9,
      font,
    })
  }

  return await pdfDoc.save()
}

export const generateDraftFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => DraftRequestSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      // Step 1: Generate draft with DeepSeek
      console.log('Generating draft for:', data.documentType)
      const draftContent = await generateDraftWithAI(data)
      
      if (!draftContent) {
        throw new Error('Failed to generate draft content')
      }

      // Step 2: Create PDF
      console.log('Creating PDF...')
      const pdfBytes = await createPDF(draftContent, data.documentType)
      
      // Step 3: Send email via Resend
      console.log('Sending email to:', data.email)
      
      // Convert to base64 for attachment
      const pdfBase64 = Buffer.from(pdfBytes).toString('base64')
      
      const { data: emailData, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: data.email,
        subject: `Your ${data.documentType} Draft - LegalDraft Pro India`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a5f;">Your Legal Draft is Ready</h2>
            <p>Dear User,</p>
            <p>Thank you for using <strong>LegalDraft Pro India</strong>.</p>
            <p>Your <strong>${data.documentType}</strong> draft has been prepared by our AI legal assistant and is attached as a PDF.</p>
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #1e3a5f; margin: 20px 0;">
              <p style="margin: 0;"><strong>Important:</strong></p>
              <ul>
                <li>Please review the draft carefully before execution</li>
                <li>Consult a licensed advocate for complex matters</li>
                <li>This draft is AI-generated and should be verified</li>
              </ul>
            </div>
            <p>Document Type: ${data.documentType}</p>
            <p>Date: ${new Date().toLocaleDateString('en-IN')}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              LegalDraft Pro India | Court-ready legal documents<br>
              This is an automated email. Please do not reply.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: `${data.documentType.replace(/\s+/g, '_').toLowerCase()}_draft.pdf`,
            content: pdfBase64,
          },
        ],
      })

      if (error) {
        throw new Error(`Resend error: ${error.message}`)
      }

      // Validate email ID - must be a valid UUID
      const emailId = emailData?.id
      if (!emailId || emailId === '0' || emailId === 0) {
        console.warn('Warning: Resend did not return a valid email ID. Email may have been sent but ID is missing.')
        console.log('Full Resend response:', JSON.stringify(emailData))
      }

      console.log('Email sent successfully:', emailId)

      return {
        success: true,
        message: `Draft generated and emailed to ${data.email}`,
        emailId: emailId || 'pending',
        draftPreview: draftContent.substring(0, 500) + '...',
      }
    } catch (error: any) {
      console.error('Draft generation failed:', error)
      throw new Error(`Failed to generate draft: ${error.message}`)
    }
  })
