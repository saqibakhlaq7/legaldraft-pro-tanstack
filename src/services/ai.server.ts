import { createServerFn } from '@tanstack/react-start'
import { supabase } from '@/lib/supabase'

// System prompt for the Legal AI
const SYSTEM_PROMPT = `
You are an expert Indian Legal Drafting Assistant. Your goal is to draft high-quality, court-ready legal documents based on user inputs.
Adhere to the following rules:
1. Use formal, professional legal language (Indian standard).
2. Ensure proper formatting with headings, sections, and clear clauses.
3. Include placeholders like [Date], [Place], [Signature] where appropriate.
4. Adhere to the specific requirements and state laws provided.
5. Do not include conversational text, only the document content.
`

export const generateDocumentDraftFn = createServerFn({ method: 'POST' })
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error || !order) throw new Error('Order not found')

    // Here we would call Gemini/OpenAI
    // For now, we simulate the prompt construction
    const categoryPrompts: Record<string, string> = {
      'Affidavits': `Draft a formal Affidavit for ${order.state}. Subject: ${order.documentType}. Details: ${order.details}`,
      'Agreements': `Draft a comprehensive Agreement/Contract for ${order.state}. Type: ${order.documentType}. Parties: ${order.full_name} and others mentioned in: ${order.details}`,
      'Notices': `Draft a formal Legal Notice. Type: ${order.documentType}. Facts: ${order.details}`,
    }

    const userPrompt = categoryPrompts[order.category] || `Draft a ${order.documentType} for ${order.state}. Details: ${order.details}`

    console.log('Final AI Prompt:', SYSTEM_PROMPT + "\n" + userPrompt)

    // Simulation of AI result
    const draftContent = `
# ${order.documentType.toUpperCase()}

THIS ${order.documentType.toUpperCase()} is made at ${order.state} on this [Date] day of [Month], [Year].

BY:
${order.full_name}, residing at [Address from details or placeholder], hereinafter referred to as the "DEPONENT/PARTY".

WHEREAS:
1. ${order.purpose}
2. ${order.details}

NOW THIS DOCUMENT WITNESSETH AS FOLLOWS:
... [Detailed Clauses based on AI Generation] ...

VERIFICATION:
I, the above named deponent, do hereby solemnly affirm and declare that the contents of this document are true and correct to the best of my knowledge and belief.

[Signature]
DEPONENT
    `

    // Update order status and save draft metadata
    await supabase
      .from('orders')
      .update({ status: 'quality_check' })
      .eq('id', orderId)

    return { content: draftContent }
  })
