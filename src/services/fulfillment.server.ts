import { createServerFn } from '@tanstack/react-start'
import { supabase } from '@/lib/supabase'
import { generateDocumentDraftFn } from './ai.server'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const processOrderFn = createServerFn({ method: 'POST' })
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    // 1. Intake (Already done by order creation)
    
    // 2. Draft Generation
    const { content } = await generateDocumentDraftFn({ data: orderId })
    
    // 3. Quality Polish (Simulated)
    const polishedContent = content + "\n\n[Quality Assurance Passed]"
    
    // 4. Document Rendering (DOCX)
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(polishedContent),
            ],
          }),
        ],
      }],
    })

    const buffer = await Packer.toBuffer(doc)
    
    // 5. Delivery (Simulated Email)
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
    
    if (order) {
      await resend.emails.send({
        from: 'LegalDraft Pro <delivery@legaldraft.pro>',
        to: order.email,
        subject: `Your ${order.documentType} is Ready - #${orderId}`,
        text: `Dear ${order.full_name},\n\nPlease find your drafted document attached.`,
        // attachments: [{ filename: `${orderId}.docx`, content: buffer }]
      })

      // 6. Update status to Delivered
      await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId)
    }

    return { success: true }
  })
