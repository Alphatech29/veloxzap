import jsPDF from 'jspdf'

const PAGE = { width: 210, height: 297 }
const MARGIN = { left: 20, right: 18 }
const HEADER_RULE_Y = 34
const CONTENT_START_Y = 42
const CONTENT_BOTTOM_LIMIT = 271
const FOOTER_RULE_Y = 277

const COLOR = {
  navy: [10, 31, 68],
  navyMid: [20, 42, 92],
  gold: [201, 162, 39],
  goldSoft: [232, 197, 71],
  textDark: [33, 39, 51],
  textMuted: [108, 117, 132],
  border: [223, 227, 234],
  bandFill: [250, 246, 233],
}

const CHAR_MAP = {
  '₦': 'NGN ',
  '′': "'",
  '″': '"',
}

function sanitize(text) {
  return String(text).replace(/[₦′″]/g, (ch) => CHAR_MAP[ch] || ch)
}

function loadImageAsDataUrl(src) {
  return fetch(src)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
    )
    .catch(() => null)
}

function drawHeader(doc, logoDataUrl, docTitle) {
  const contentRight = PAGE.width - MARGIN.right

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', MARGIN.left, 13, 34, 11.6)
    } catch {
      /* image failed to embed, skip silently */
    }
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...COLOR.navy)
  doc.text('VeloxZap Technologies Limited', contentRight, 16.5, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.4)
  doc.setTextColor(...COLOR.textMuted)
  doc.text('Digital Financial Services Platform', contentRight, 20.6, { align: 'right' })
  doc.text('www.veloxzap.com   /   support@veloxzap.com', contentRight, 24.6, { align: 'right' })

  doc.setDrawColor(...COLOR.gold)
  doc.setLineWidth(0.7)
  doc.line(MARGIN.left, HEADER_RULE_Y, contentRight, HEADER_RULE_Y)

  doc.setDrawColor(...COLOR.goldSoft)
  doc.setLineWidth(0.3)
  doc.setLineDashPattern([0.4, 1], 0)
  doc.line(MARGIN.left, HEADER_RULE_Y + 0.9, contentRight, HEADER_RULE_Y + 0.9)
  doc.setLineDashPattern([], 0)

  doc.setDrawColor(...COLOR.gold)
  doc.setLineWidth(0.5)
  doc.line(11, HEADER_RULE_Y + 3, 11, FOOTER_RULE_Y - 3)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(...COLOR.textMuted)
  doc.text(sanitize(docTitle), MARGIN.left, 11)
}

function drawArcText(doc, text, cx, cy, radius, startAngle, endAngle, { flip = false, tilt = 0 } = {}) {
  const chars = text.split('')
  const n = chars.length
  for (let i = 0; i < n; i += 1) {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const angle = startAngle + t * (endAngle - startAngle) + tilt
    const rad = (angle * Math.PI) / 180
    const x = cx + radius * Math.sin(rad)
    const y = cy - radius * Math.cos(rad)
    const rotation = flip ? 180 - angle : -angle
    doc.text(chars[i], x, y, { align: 'center', angle: rotation })
  }
}

function drawSeal(doc, cx, cy, radius, tiltDeg) {
  doc.setGState(new doc.GState({ opacity: 0.86 }))

  doc.setDrawColor(...COLOR.gold)
  doc.setLineWidth(0.85)
  doc.circle(cx, cy, radius, 'S')

  doc.setLineWidth(0.35)
  doc.circle(cx, cy, radius - 2.6, 'S')

  doc.setDrawColor(...COLOR.goldSoft)
  doc.setLineWidth(0.25)
  doc.setLineDashPattern([0.5, 0.9], 0)
  doc.circle(cx, cy, radius - 3.4, 'S')
  doc.setLineDashPattern([], 0)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(5.6)
  doc.setTextColor(...COLOR.navy)
  drawArcText(doc, 'VELOXZAP TECHNOLOGIES LIMITED', cx, cy, radius - 5.6, -76, 76, { tilt: tiltDeg })

  doc.setFontSize(5.4)
  drawArcText(doc, 'OFFICIAL DOCUMENT  *  LAGOS, NIGERIA', cx, cy, radius - 5.6, 256, 104, {
    flip: true,
    tilt: tiltDeg,
  })

  ;[90, -90].forEach((sideAngle) => {
    const rad = ((sideAngle + tiltDeg) * Math.PI) / 180
    const x = cx + (radius - 5.6) * Math.sin(rad)
    const y = cy - (radius - 5.6) * Math.cos(rad)
    doc.setFillColor(...COLOR.gold)
    doc.circle(x, y, 0.5, 'F')
  })

  doc.setDrawColor(...COLOR.gold)
  doc.setLineWidth(0.45)
  const lineHalf = radius - 9.4
  doc.line(
    cx - lineHalf * Math.cos((tiltDeg * Math.PI) / 180),
    cy - lineHalf * Math.sin((tiltDeg * Math.PI) / 180),
    cx + lineHalf * Math.cos((tiltDeg * Math.PI) / 180),
    cy + lineHalf * Math.sin((tiltDeg * Math.PI) / 180)
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14.5)
  doc.setTextColor(...COLOR.navy)
  doc.text('VZ', cx, cy - 1.6, { align: 'center', angle: tiltDeg })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5.1)
  doc.setTextColor(...COLOR.gold)
  doc.text('OFFICIAL SEAL', cx, cy + 5.4, { align: 'center', angle: tiltDeg })

  doc.setGState(new doc.GState({ opacity: 1 }))
}

function drawFooter(doc, pageNumber, pageCount, docTitle) {
  const contentRight = PAGE.width - MARGIN.right

  doc.setDrawColor(...COLOR.border)
  doc.setLineWidth(0.3)
  doc.line(MARGIN.left, FOOTER_RULE_Y, contentRight, FOOTER_RULE_Y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.4)
  doc.setTextColor(...COLOR.textMuted)
  doc.text(
    `© ${new Date().getFullYear()} VeloxZap Technologies Limited. All rights reserved.`,
    MARGIN.left,
    FOOTER_RULE_Y + 5.5
  )
  doc.text(sanitize(docTitle), PAGE.width / 2, FOOTER_RULE_Y + 5.5, { align: 'center' })
  doc.text(`Page ${pageNumber} of ${pageCount}`, contentRight, FOOTER_RULE_Y + 5.5, { align: 'right' })

  doc.setFontSize(6.6)
  doc.setTextColor(...COLOR.textMuted)
  doc.text(
    'This is an electronically generated document and is valid without a signature.',
    PAGE.width / 2,
    FOOTER_RULE_Y + 9.5,
    { align: 'center' }
  )
}

export async function generateLegalDocumentPdf({ title, lastUpdated, intro, sections, fileName }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  doc.setProperties({
    title,
    subject: title,
    author: 'VeloxZap Technologies Limited',
    creator: 'VeloxZap',
    keywords: 'veloxzap, legal, terms, fintech',
  })

  const logoDataUrl = await loadImageAsDataUrl('/logo-1.png')

  const contentLeft = MARGIN.left
  const contentRight = PAGE.width - MARGIN.right
  const contentWidth = contentRight - contentLeft

  let y = CONTENT_START_Y
  drawHeader(doc, logoDataUrl, title)

  function newPage() {
    doc.addPage()
    drawHeader(doc, logoDataUrl, title)
    y = CONTENT_START_Y
  }

  function ensureSpace(height) {
    if (y + height > CONTENT_BOTTOM_LIMIT) newPage()
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.4)
  doc.setTextColor(...COLOR.gold)
  doc.text('LEGAL DOCUMENT', contentLeft, y)
  y += 9

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(25)
  doc.setTextColor(...COLOR.navy)
  doc.text(sanitize(title), contentLeft, y)
  y += 6.5

  doc.setDrawColor(...COLOR.gold)
  doc.setLineWidth(1.3)
  doc.line(contentLeft, y, contentLeft + 28, y)
  y += 7.5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR.textMuted)
  doc.text(`Last updated ${sanitize(lastUpdated)}`, contentLeft, y)
  y += 10

  if (intro) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9.6)
    doc.setTextColor(...COLOR.textDark)
    const introLines = doc.splitTextToSize(sanitize(intro), contentWidth)
    introLines.forEach((line) => {
      ensureSpace(5.2)
      doc.text(line, contentLeft, y)
      y += 5.2
    })
    y += 5
  }

  sections.forEach(({ title: sectionTitle, body }) => {
    ensureSpace(14)
    y += 4

    const pageNumber = doc.internal.getCurrentPageInfo().pageNumber
    doc.outline.add(null, sanitize(sectionTitle), { pageNumber })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11.5)
    doc.setTextColor(...COLOR.navy)
    doc.text(sanitize(sectionTitle), contentLeft, y)
    y += 6.6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.6)
    doc.setTextColor(...COLOR.textDark)

    body.forEach((para) => {
      const lines = doc.splitTextToSize(sanitize(para), contentWidth)
      lines.forEach((line) => {
        ensureSpace(5)
        doc.text(line, contentLeft, y)
        y += 4.9
      })
      y += 3
    })
  })

  ensureSpace(70)
  const blockTop = y + 4
  doc.setDrawColor(...COLOR.border)
  doc.setLineWidth(0.3)
  doc.line(contentLeft, blockTop, contentRight, blockTop)

  const sealRadius = 21
  const sealCenterX = contentRight - sealRadius - 4
  const sealCenterY = blockTop + 8 + sealRadius
  const leftColWidth = contentWidth - sealRadius * 2 - 18

  let leftY = blockTop + 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(...COLOR.navy)
  doc.text('Certification', contentLeft, leftY)
  leftY += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR.textDark)
  const certLines = doc.splitTextToSize(
    sanitize(
      `This document is issued and certified by VeloxZap Technologies Limited as a true, current, and complete statement of its ${title} as of the date stated above. This copy bears the Company's official seal and is valid for verification and compliance purposes.`
    ),
    leftColWidth
  )
  certLines.forEach((line) => {
    doc.text(line, contentLeft, leftY)
    leftY += 4.9
  })
  leftY += 7

  doc.setDrawColor(...COLOR.textMuted)
  doc.setLineWidth(0.25)
  doc.line(contentLeft, leftY, contentLeft + 58, leftY)
  leftY += 4.2
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(...COLOR.textMuted)
  doc.text('Authorized Signatory — VeloxZap Technologies Limited', contentLeft, leftY)

  drawSeal(doc, sealCenterX, sealCenterY, sealRadius, -9)

  y = Math.max(leftY + 6, sealCenterY + sealRadius + 6)

  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i)
    drawFooter(doc, i, pageCount, title)
  }

  doc.save(fileName || `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
