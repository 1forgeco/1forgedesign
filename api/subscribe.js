const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const resendEmail = async (apiKey, payload) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Email delivery failed')
  return data
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' })

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body || {}
    const email = String(body.email || '').trim().toLowerCase()
    const source = String(body.source || 'website').slice(0, 80)
    const template = String(body.template || '').slice(0, 120)
    const name = String(body.name || '').trim().slice(0, 100)
    const projectUrl = String(body.projectUrl || '').trim().slice(0, 500)
    const message = String(body.message || '').trim().slice(0, 2000)

    if (body.website) return response.status(200).json({ success: true })
    if (!emailPattern.test(email) || email.length > 254) return response.status(400).json({ error: 'Please enter a valid email address.' })

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return response.status(503).json({ error: 'Email signup is being connected. Please email hello@1forge.in for now.' })

    const safeEmail = escapeHtml(email)
    const safeSource = escapeHtml(source)
    const safeTemplate = escapeHtml(template || 'General collection')
    const safeName = escapeHtml(name || 'Not provided')
    const safeProjectUrl = escapeHtml(projectUrl || 'Not provided')
    const safeMessage = escapeHtml(message || 'Not provided').replaceAll('\n', '<br>')
    const from = process.env.FROM_EMAIL || '1Forge Designs <contact@1forge.in>'
    const contactEmail = process.env.CONTACT_EMAIL || 'studio@1forge.in'

    await resendEmail(apiKey, {
      from,
      to: [contactEmail],
      reply_to: email,
      subject: `New 1Forge Designs ${source.includes('community') ? 'community action' : 'signup'} · ${template || source}`,
      html: `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px 24px;background:#0b0b0c;color:#f3efe8"><p style="color:#f06a2a;letter-spacing:.18em;font-size:11px">NEW DESIGNS ACTION</p><h1 style="font-family:Georgia,serif;font-weight:400">Someone entered the forge.</h1><table style="width:100%;border-collapse:collapse;margin-top:28px"><tr><td style="padding:14px 0;border-top:1px solid #333;color:#999">Email</td><td style="padding:14px 0;border-top:1px solid #333;text-align:right"><a style="color:#fff" href="mailto:${safeEmail}">${safeEmail}</a></td></tr><tr><td style="padding:14px 0;border-top:1px solid #333;color:#999">Source</td><td style="padding:14px 0;border-top:1px solid #333;text-align:right">${safeSource}</td></tr><tr><td style="padding:14px 0;border-top:1px solid #333;color:#999">Template / vote</td><td style="padding:14px 0;border-top:1px solid #333;text-align:right">${safeTemplate}</td></tr><tr><td style="padding:14px 0;border-top:1px solid #333;color:#999">Name</td><td style="padding:14px 0;border-top:1px solid #333;text-align:right">${safeName}</td></tr><tr><td style="padding:14px 0;border-top:1px solid #333;color:#999">Project</td><td style="padding:14px 0;border-top:1px solid #333;text-align:right">${safeProjectUrl}</td></tr><tr><td style="padding:14px 0;border-block:1px solid #333;color:#999;vertical-align:top">Message</td><td style="padding:14px 0;border-block:1px solid #333;text-align:right">${safeMessage}</td></tr></table></div>`,
    })

    const isFreeDrop = source === 'weekly-free'
    const isCommunity = source.startsWith('community-')
    const freeTemplateUrl = process.env.FREE_TEMPLATE_URL
    if (process.env.SEND_SIGNUP_CONFIRMATION !== 'false') {
      const action = isFreeDrop && freeTemplateUrl
        ? `<a href="${escapeHtml(freeTemplateUrl)}" style="display:inline-block;margin-top:22px;padding:14px 22px;border-radius:999px;background:#ef6a29;color:#fff;text-decoration:none">Open the free Figma drop</a>`
        : '<p style="margin-top:22px;color:#aaa">We’ll send the release link and details as soon as this drop opens.</p>'

      await resendEmail(apiKey, {
        from,
        to: [email],
        subject: isFreeDrop ? `${template || 'Your free Friday drop'} · 1Forge Designs` : isCommunity ? 'Your input reached 1Forge Designs' : 'You’re on the 1Forge Designs launch list',
        html: `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#0b0b0c;color:#f3efe8"><p style="color:#f06a2a;letter-spacing:.18em;font-size:11px">1FORGE DESIGNS</p><h1 style="font-family:Georgia,serif;font-size:42px;line-height:1;font-weight:400;margin:24px 0">${isCommunity ? 'Received. Thank you.' : 'Welcome to the forge.'}</h1><p style="color:#ccc;line-height:1.7">${isFreeDrop ? `You’re registered for <strong>${safeTemplate}</strong>, this week’s free Friday release.` : isCommunity ? `Your ${source === 'community-vote' ? 'vote' : 'remix submission'} reached the studio. Remix submissions are reviewed before anything is published.` : 'You’ll be among the first to receive launch files, founding pricing and genuinely useful design notes.'}</p>${isCommunity ? '' : action}<p style="margin-top:34px;color:#777;font-size:12px">If you didn’t request this, you can ignore this email.</p></div>`,
      })
    }

    return response.status(200).json({
      success: true,
      message: isFreeDrop ? 'You’re in. Check your inbox for this week’s drop.' : isCommunity ? 'Your input reached the studio. Check your inbox for confirmation.' : 'You’re on the list. Check your inbox for confirmation.',
    })
  } catch (error) {
    console.error('1Forge signup error:', error)
    return response.status(500).json({ error: 'We couldn’t add you right now. Please try again.' })
  }
}

