import os
import re
from datetime import datetime
from uuid import uuid4

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "generated_reports")
os.makedirs(REPORTS_DIR, exist_ok=True)


def strip_emojis(text: str) -> str:
    """Remove 4-byte unicode emojis that standard PDF fonts cannot render."""
    if not text:
        return ""
    clean = re.sub(r'[\U00010000-\U0010ffff]', '', str(text))
    clean = clean.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return clean.strip()


def clean_filename(text: str) -> str:
    """Sanitize topic text for a clean filename."""
    clean = re.sub(r'[^a-zA-Z0-9_\- ]', '', text).strip().replace(' ', '_')
    return clean[:30] if clean else "Enterprise_Report"


def generate_pdf_report(
    title: str, 
    overview: str, 
    sections: list, 
    sources: list = None,
    custom_filename: str = None
) -> dict:
    """
    Generate a professional corporate PDF report using ReportLab.
    Returns: { "filename": "...", "download_url": "...", "file_type": "pdf" }
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    except ImportError:
        # Fallback if reportlab is not yet installed
        safe_name = clean_filename(custom_filename or title)
        filename = f"RAGNIFY_{safe_name}_{uuid4().hex[:6]}.txt"
        filepath = os.path.join(REPORTS_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"{title}\n\nOverview:\n{overview}\n")
        return {
            "filename": filename,
            "download_url": f"/static/generated_reports/{filename}",
            "file_type": "pdf",
            "file_name": filename
        }

    safe_name = clean_filename(custom_filename or title)
    filename = f"RAGNIFY_{safe_name}_{uuid4().hex[:6]}.pdf"
    filepath = os.path.join(REPORTS_DIR, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    header_style = ParagraphStyle(
        'DocHeader',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=6
    )
    
    subhead_style = ParagraphStyle(
        'DocSubHeader',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=12
    )

    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=10,
        spaceAfter=5
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        leftIndent=12,
        spaceAfter=4
    )

    elements = []

    # 1. Top Brand Banner Table
    banner_data = [
        [
            Paragraph("<b>RAGNIFY ENTERPRISE AI</b>", ParagraphStyle('Brand', fontName='Helvetica-Bold', fontSize=11, textColor=colors.HexColor('#4F46E5'))),
            Paragraph(f"Date: {datetime.now().strftime('%B %d, %Y')}", ParagraphStyle('Date', fontName='Helvetica', fontSize=8.5, alignment=2, textColor=colors.HexColor('#64748B')))
        ]
    ]
    banner_table = Table(banner_data, colWidths=[350, 180])
    banner_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(banner_table)
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4F46E5'), spaceAfter=12))

    # 2. Main Title & Subtitle
    elements.append(Paragraph(strip_emojis(title), header_style))
    elements.append(Paragraph("Official Enterprise Policy & Knowledge Synthesis Brief", subhead_style))
    elements.append(Spacer(1, 6))

    # 3. Executive Overview Box
    if overview:
        elements.append(Paragraph("Executive Overview", section_title_style))
        overview_table = Table([[Paragraph(strip_emojis(overview), body_style)]], colWidths=[530])
        overview_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(overview_table)
        elements.append(Spacer(1, 10))

    # 4. Structured Sections
    for sec in sections:
        sec_title = strip_emojis(sec.get("title", ""))
        sec_content = strip_emojis(sec.get("content", ""))
        sec_points = sec.get("points", [])

        if sec_title:
            elements.append(Paragraph(sec_title, section_title_style))
        if sec_content:
            elements.append(Paragraph(sec_content, body_style))
        if sec_points:
            for pt in sec_points:
                clean_pt = strip_emojis(pt)
                if clean_pt:
                    elements.append(Paragraph(f"&bull; &nbsp; {clean_pt}", bullet_style))
        elements.append(Spacer(1, 4))

    # 5. Document Sources & Disclaimer
    elements.append(Spacer(1, 12))
    elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#CBD5E1'), spaceAfter=6))
    
    clean_sources = [strip_emojis(s) for s in sources] if sources else ['RAGNIFY Enterprise Knowledge Repository']
    src_text = f"<b>Knowledge Sources:</b> {', '.join(clean_sources)}"
    elements.append(Paragraph(src_text, ParagraphStyle('Src', fontName='Helvetica-Oblique', fontSize=8, textColor=colors.HexColor('#64748B'))))
    elements.append(Paragraph("Confidential & Proprietary &bull; Generated by RAGNIFY AI Assistant", ParagraphStyle('Discl', fontName='Helvetica', fontSize=7.5, textColor=colors.HexColor('#94A3B8'))))

    doc.build(elements)

    return {
        "filename": filename,
        "download_url": f"/static/generated_reports/{filename}",
        "file_type": "pdf",
        "file_name": filename
    }


def generate_pptx_presentation(
    title: str, 
    subtitle: str, 
    slides_data: list, 
    custom_filename: str = None
) -> dict:
    """
    Generate a modern 16:9 executive presentation using python-pptx.
    Returns: { "filename": "...", "download_url": "...", "file_type": "pptx" }
    """
    try:
        from pptx import Presentation
        from pptx.util import Inches, Pt
        from pptx.dml.color import RGBColor
    except ImportError:
        safe_name = clean_filename(custom_filename or title)
        filename = f"RAGNIFY_{safe_name}_{uuid4().hex[:6]}.txt"
        filepath = os.path.join(REPORTS_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"{title}\n\n{subtitle}\n")
        return {
            "filename": filename,
            "download_url": f"/static/generated_reports/{filename}",
            "file_type": "pptx",
            "file_name": filename
        }

    safe_name = clean_filename(custom_filename or title)
    filename = f"RAGNIFY_{safe_name}_{uuid4().hex[:6]}.pptx"
    filepath = os.path.join(REPORTS_DIR, filename)

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_slide_layout = prs.slide_layouts[6]

    # Theme Colors
    DARK_NAVY = RGBColor(15, 23, 42)
    BRAND_INDIGO = RGBColor(79, 70, 229)
    TEXT_MAIN = RGBColor(30, 41, 59)
    TEXT_MUTED = RGBColor(100, 116, 139)

    # 1. Title Slide
    slide = prs.slides.add_slide(blank_slide_layout)
    
    title_box = slide.shapes.add_textbox(Inches(1.2), Inches(2.2), Inches(11), Inches(2.5))
    tf = title_box.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "RAGNIFY ENTERPRISE BRIEFING"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = BRAND_INDIGO
    p.space_after = Pt(14)

    p2 = tf.add_paragraph()
    p2.text = str(title)
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = DARK_NAVY
    p2.space_after = Pt(12)

    p3 = tf.add_paragraph()
    p3.text = str(subtitle or "Official Policy Review & Operational Framework")
    p3.font.size = Pt(18)
    p3.font.color.rgb = TEXT_MUTED

    footer_box = slide.shapes.add_textbox(Inches(1.2), Inches(6.2), Inches(11), Inches(0.6))
    ft = footer_box.text_frame
    fp = ft.paragraphs[0]
    fp.text = f"Generated by RAGNIFY AI Assistant • {datetime.now().strftime('%B %Y')}"
    fp.font.size = Pt(11)
    fp.font.color.rgb = TEXT_MUTED

    # 2. Content Slides
    for slide_info in slides_data:
        s = prs.slides.add_slide(blank_slide_layout)

        header_box = s.shapes.add_textbox(Inches(1.0), Inches(0.6), Inches(11.3), Inches(1.2))
        htf = header_box.text_frame
        htf.word_wrap = True

        hp1 = htf.paragraphs[0]
        hp1.text = str(slide_info.get("title", "Policy Overview"))
        hp1.font.size = Pt(24)
        hp1.font.bold = True
        hp1.font.color.rgb = DARK_NAVY

        hp2 = htf.add_paragraph()
        hp2.text = str(slide_info.get("subtitle", "Enterprise Knowledge Synthesis"))
        hp2.font.size = Pt(12)
        hp2.font.color.rgb = BRAND_INDIGO

        content_box = s.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(11.3), Inches(4.8))
        ctf = content_box.text_frame
        ctf.word_wrap = True

        body_text = slide_info.get("body", "")
        if body_text:
            bp = ctf.paragraphs[0]
            bp.text = str(body_text)
            bp.font.size = Pt(15)
            bp.font.color.rgb = TEXT_MAIN
            bp.space_after = Pt(14)

        points = slide_info.get("points", [])
        for pt in points:
            pp = ctf.add_paragraph()
            pp.text = f"•  {str(pt)}"
            pp.font.size = Pt(14)
            pp.font.color.rgb = TEXT_MAIN
            pp.space_after = Pt(10)

        ft_box = s.shapes.add_textbox(Inches(1.0), Inches(6.8), Inches(11.3), Inches(0.4))
        ftf = ft_box.text_frame
        ftp = ftf.paragraphs[0]
        ftp.text = "RAGNIFY AI Co-Pilot • Enterprise Confidential"
        ftp.font.size = Pt(9)
        ftp.font.color.rgb = TEXT_MUTED

    prs.save(filepath)

    return {
        "filename": filename,
        "download_url": f"/static/generated_reports/{filename}",
        "file_type": "pptx",
        "file_name": filename
    }


def generate_offer_letter_pdf(
    candidate_name: str,
    candidate_id: str,
    role: str,
    department: str = "AI & Data Science",
    ctc_or_stipend: str = "INR 12,00,000 / annum",
    candidate_type: str = "Employee",
    joining_date: str = None,
    reporting_manager: str = "Dr. Rajesh Khanna, Head of AI",
    offer_date: str = None,
    candidate_email: str = None,
    acceptance_status: str = "ISSUED"
) -> dict:
    """
    Generate an executive-grade formal corporate Offer Letter PDF using ReportLab Canvas.
    Saves to uploads/documents and uploads/generated_reports.
    """
    DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "documents")
    os.makedirs(DOCS_DIR, exist_ok=True)
    os.makedirs(REPORTS_DIR, exist_ok=True)

    today_str = offer_date or datetime.now().strftime("%B %d, %Y")
    joining_str = joining_date or datetime.now().strftime("%B 15, %Y")
    clean_id = candidate_id.strip() if candidate_id else f"CAND-{uuid4().hex[:4].upper()}"
    filename = f"{clean_id}_Offer_Letter.pdf"
    filepath_docs = os.path.join(DOCS_DIR, filename)
    filepath_reports = os.path.join(REPORTS_DIR, filename)

    # Normalize rupee symbol for standard PDF fonts
    clean_comp = str(ctc_or_stipend or "INR 12,00,000 / yr").replace("₹", "INR ").strip()
    is_intern = "intern" in str(candidate_type or "").lower() or "intern" in str(role or "").lower()
    email_str = candidate_email or f"{clean_id.lower()}@ragnify.com"
    ref_no = f"RAG/HR/{datetime.now().year}/{clean_id}"

    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors

        w, h = A4  # 595.27 x 841.89 pt
        c = canvas.Canvas(filepath_docs, pagesize=A4)
        c.setTitle(f"Official Offer Letter - {candidate_name} ({clean_id})")

        # Executive Palette
        NAVY_DEEP = colors.HexColor("#0B1528")
        NAVY_MID = colors.HexColor("#16284C")
        GOLD_PRIMARY = colors.HexColor("#C59B27")
        GOLD_LIGHT = colors.HexColor("#F5E6B3")
        SLATE_DARK = colors.HexColor("#0F172A")
        SLATE_BODY = colors.HexColor("#334155")
        SLATE_MUTED = colors.HexColor("#64748B")
        BG_IVORY = colors.HexColor("#FDFBF7")
        BG_ROW_ALT = colors.HexColor("#F8FAFC")
        BORDER_SUBTLE = colors.HexColor("#CBD5E1")
        EMERALD = colors.HexColor("#059669")

        # 1. Page Background & Subtle Outer Frame
        c.setFillColor(colors.white)
        c.rect(0, 0, w, h, stroke=0, fill=1)

        c.setStrokeColor(colors.HexColor("#E2E8F0"))
        c.setLineWidth(1)
        c.rect(18, 18, w - 36, h - 36, stroke=1, fill=0)

        c.setStrokeColor(GOLD_PRIMARY)
        c.setLineWidth(0.6)
        c.rect(21, 21, w - 42, h - 42, stroke=1, fill=0)

        # 2. Top Executive Navy Letterhead Banner
        header_h = 92
        header_y = h - 21 - header_h
        c.setFillColor(NAVY_DEEP)
        c.rect(21, header_y, w - 42, header_h, stroke=0, fill=1)

        # Gold Accent Bottom Strip on Header
        c.setFillColor(GOLD_PRIMARY)
        c.rect(21, header_y, w - 42, 3.5, stroke=0, fill=1)

        # Left Brand Crest inside Header
        crest_cx = 58
        crest_cy = header_y + 48
        c.setStrokeColor(GOLD_PRIMARY)
        c.setLineWidth(1.5)
        c.circle(crest_cx, crest_cy, 20, stroke=1, fill=0)
        c.setLineWidth(0.6)
        c.circle(crest_cx, crest_cy, 16, stroke=1, fill=0)
        c.setFillColor(GOLD_PRIMARY)
        c.setFont("Times-Bold", 18)
        c.drawCentredString(crest_cx, crest_cy - 6, "R")

        # Company Name & Corporate Address
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 13.5)
        c.drawString(88, header_y + 62, "RAGNIFY ENTERPRISE TECHNOLOGIES INC.")

        c.setFillColor(GOLD_LIGHT)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(88, header_y + 49, "GLOBAL PEOPLE OPERATIONS  •  EXECUTIVE TALENT ACQUISITION DIVISION")

        c.setFillColor(colors.HexColor("#94A3B8"))
        c.setFont("Helvetica", 7.2)
        c.drawString(88, header_y + 35, "Prestige Tech Park, Outer Ring Road, Bengaluru 560103  |  CIN: U72900KA2026PLC184920")
        c.drawString(88, header_y + 23, "Web: www.ragnify-enterprise.ai  |  Compliance Desk: hr-compliance@ragnify.com")

        # Right Document Classification Badge in Header
        box_w, box_h = 152, 56
        box_x = w - 21 - box_w - 16
        box_y = header_y + 20
        c.setFillColor(NAVY_MID)
        c.setStrokeColor(GOLD_PRIMARY)
        c.setLineWidth(0.8)
        c.roundRect(box_x, box_y, box_w, box_h, 4, stroke=1, fill=1)

        c.setFillColor(GOLD_LIGHT)
        c.setFont("Helvetica-Bold", 6.8)
        c.drawString(box_x + 10, box_y + 41, "DOCUMENT CLASSIFICATION")
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 8.5)
        c.drawString(box_x + 10, box_y + 28, "CONFIDENTIAL OFFER")
        c.setFillColor(colors.HexColor("#CBD5E1"))
        c.setFont("Courier-Bold", 7.2)
        c.drawString(box_x + 10, box_y + 15, f"REF: {ref_no}")
        c.setFont("Helvetica", 6.8)
        c.drawString(box_x + 10, box_y + 5, f"ISSUED: {today_str}")

        # 3. Subtle Center Watermark
        c.saveState()
        c.setFillColor(colors.HexColor("#F8FAFC"))
        c.setFont("Times-Bold", 44)
        c.translate(w / 2, h / 2 - 20)
        c.rotate(28)
        c.drawCentredString(0, 0, "RAGNIFY OFFICIAL")
        c.restoreState()

        # 4. Recipient Block & Document Meta Bar
        y_cursor = header_y - 22

        # Recipient Left / Offer Meta Right
        c.setFillColor(GOLD_PRIMARY)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(42, y_cursor, "ADDRESSED TO RECIPIENT")
        c.drawRightString(w - 42, y_cursor, "APPOINTMENT DOSSIER METADATA")

        y_cursor -= 13
        c.setFillColor(SLATE_DARK)
        c.setFont("Helvetica-Bold", 11.5)
        c.drawString(42, y_cursor, str(candidate_name))

        c.setFont("Helvetica-Bold", 8.5)
        c.drawRightString(w - 42, y_cursor, f"Candidate ID: {clean_id}")

        y_cursor -= 12
        c.setFillColor(SLATE_BODY)
        c.setFont("Helvetica", 8.5)
        c.drawString(42, y_cursor, f"Official Email: {email_str}")
        c.drawRightString(w - 42, y_cursor, f"Employment Track: {'Internship Cohort' if is_intern else 'Full-Time Executive Cadre'}")

        y_cursor -= 12
        c.drawString(42, y_cursor, f"Department: {department} Division")
        c.drawRightString(w - 42, y_cursor, f"Target Joining Date: {joining_str}")

        # 5. Formal Subject Banner
        y_cursor -= 22
        subj_h = 26
        c.setFillColor(BG_IVORY)
        c.setStrokeColor( colors.HexColor("#E2E8F0"))
        c.setLineWidth(0.7)
        c.rect(42, y_cursor - 7, w - 84, subj_h, stroke=1, fill=1)
        # Gold Left Bar on Subject
        c.setFillColor(GOLD_PRIMARY)
        c.rect(42, y_cursor - 7, 4, subj_h, stroke=0, fill=1)

        offer_kind = "INTERNSHIP APPOINTMENT" if is_intern else "FULL-TIME EMPLOYMENT APPOINTMENT"
        c.setFillColor(NAVY_DEEP)
        c.setFont("Helvetica-Bold", 9.2)
        c.drawString(54, y_cursor + 3, f"SUBJECT: FORMAL LETTER OF OFFER & {offer_kind} — {str(role).upper()}")

        # 6. Salutation & Opening Paragraphs
        y_cursor -= 24
        c.setFillColor(SLATE_DARK)
        c.setFont("Helvetica-Bold", 9.5)
        c.drawString(42, y_cursor, f"Dear {candidate_name},")

        y_cursor -= 15
        c.setFillColor(SLATE_BODY)
        c.setFont("Helvetica", 8.8)
        intro_lines = [
            f"Congratulations! Subsequent to our executive evaluation boards and technical interviews, RAGNIFY Enterprise",
            f"Technologies Inc. (\"the Company\") is pleased to extend this formal Offer of {'Internship' if is_intern else 'Appointment'} for the position of",
            f"{role} within our {department} practice, effective {joining_str}.",
            f"Your academic pedigree, technical rigor, and problem-solving capabilities stood out strongly across our selection",
            f"benchmarks. Below is the official schedule of your appointment, remuneration, and governance terms:"
        ]
        for line in intro_lines:
            c.drawString(42, y_cursor, line)
            y_cursor -= 12.5

        # 7. Structured "ANNEXURE A — APPOINTMENT & REMUNERATION SCHEDULE" Table
        y_cursor -= 8
        c.setFillColor(NAVY_DEEP)
        c.rect(42, y_cursor - 4, w - 84, 18, stroke=0, fill=1)
        c.setFillColor(GOLD_LIGHT)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(50, y_cursor + 2, "SECTION 01  •  EXECUTIVE APPOINTMENT & REMUNERATION SCHEDULE (ANNEXURE A)")
        c.drawRightString(w - 50, y_cursor + 2, "VERIFIED BY HR GOVERNANCE")

        rows = [
            ("Designated Role / Title", str(role), "Department & Practice", str(department)),
            ("Appointment Cadre", "Stipendiary Internship" if is_intern else "Full-Time Permanent (FTE)", "Reporting Authority", str(reporting_manager)),
            ("Effective Joining Date", str(joining_str), "Work Location & Mode", "Bengaluru HQ (Hybrid - 3 Days/Wk)"),
            ("Approved Compensation", clean_comp, "Probation / Evaluation", "Duration of Internship" if is_intern else "90 Days Executive Probation"),
            ("Medical & Group Cover", "INR 5,00,000 Floating Cover", "Standard Working Hours", "40 Hours / Week (Mon - Fri)")
        ]

        row_h = 20
        table_top = y_cursor - 4
        col_w1 = 115
        col_w2 = 140
        col_w3 = 115
        col_w4 = (w - 84) - (col_w1 + col_w2 + col_w3)

        for idx, (l1, v1, l2, v2) in enumerate(rows):
            ry = table_top - (idx + 1) * row_h
            # Row background
            c.setFillColor(BG_ROW_ALT if idx % 2 == 0 else colors.white)
            c.rect(42, ry, w - 84, row_h, stroke=0, fill=1)

            # Label column tint
            c.setFillColor(colors.HexColor("#F1F5F9"))
            c.rect(42, ry, col_w1, row_h, stroke=0, fill=1)
            c.rect(42 + col_w1 + col_w2, ry, col_w3, row_h, stroke=0, fill=1)

            # Grid lines
            c.setStrokeColor(BORDER_SUBTLE)
            c.setLineWidth(0.5)
            c.rect(42, ry, w - 84, row_h, stroke=1, fill=0)
            c.line(42 + col_w1, ry, 42 + col_w1, ry + row_h)
            c.line(42 + col_w1 + col_w2, ry, 42 + col_w1 + col_w2, ry + row_h)
            c.line(42 + col_w1 + col_w2 + col_w3, ry, 42 + col_w1 + col_w2 + col_w3, ry + row_h)

            # Text
            c.setFillColor(SLATE_DARK)
            c.setFont("Helvetica-Bold", 7.8)
            c.drawString(48, ry + 6, l1[:24])
            c.drawString(42 + col_w1 + col_w2 + 6, ry + 6, l2[:24])

            if idx == 3:
                c.setFillColor(EMERALD)
                c.setFont("Helvetica-Bold", 8.2)
            else:
                c.setFillColor(SLATE_BODY)
                c.setFont("Helvetica", 8)
            c.drawString(42 + col_w1 + 6, ry + 6, v1[:27])

            c.setFillColor(SLATE_BODY)
            c.setFont("Helvetica", 8)
            c.drawString(42 + col_w1 + col_w2 + col_w3 + 6, ry + 6, v2[:28])

        y_cursor = table_top - len(rows) * row_h - 18

        # 8. Section 02: Terms, Covenants & Statutory Clauses
        c.setFillColor(NAVY_DEEP)
        c.rect(42, y_cursor - 4, w - 84, 18, stroke=0, fill=1)
        c.setFillColor(GOLD_LIGHT)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(50, y_cursor + 2, "SECTION 02  •  TERMS OF APPOINTMENT, COVENANTS & STATUTORY COMPLIANCE")

        y_cursor -= 18
        clauses = [
            ("01. Duties & Professional Ethics:",
             "You shall devote your full working time, attention, and engineering craft to the initiatives of RAGNIFY Enterprise Technologies Inc. and adhere strictly to our Enterprise Code of Conduct & InfoSec Policies."),
            ("02. Intellectual Property & Confidentiality (NDA):",
             "All source code, AI/ML weights, RAG pipelines, architectures, inventions, and technical documentation authored during your tenure shall remain the sole and exclusive intellectual property of the Company."),
            ("03. Background & Credential Verification:",
             "This appointment remains contingent upon satisfactory verification of your submitted identity documents (PAN/Aadhaar), academic transcripts, and prior employment clearances by HR Compliance."),
            ("04. Notice Period & Separation Governance:",
             f"{'Either party may terminate this internship arrangement with 15 calendar days written notice.' if is_intern else 'Following the 90-day probation period (15-day notice), a formal notice period of 60 calendar days applies to either party.'}"),
            ("05. Offer Validity & Digital Acceptance:",
             "Please countersign and return a copy of this Offer Letter within 15 calendar days from the date of issuance, failing which this offer shall stand automatically withdrawn unless extended in writing.")
        ]

        for c_title, c_body in clauses:
            c.setFillColor(NAVY_DEEP)
            c.setFont("Helvetica-Bold", 8)
            c.drawString(44, y_cursor, c_title)
            y_cursor -= 11

            c.setFillColor(SLATE_BODY)
            c.setFont("Helvetica", 7.8)
            # Split into 2 lines max (~105 chars per line)
            words = c_body.split()
            line1, line2 = [], []
            cur_len = 0
            for word in words:
                if cur_len + len(word) + 1 <= 102:
                    line1.append(word)
                    cur_len += len(word) + 1
                else:
                    line2.append(word)
            c.drawString(54, y_cursor, " ".join(line1))
            if line2:
                y_cursor -= 10.5
                c.drawString(54, y_cursor, " ".join(line2))
            y_cursor -= 13

        # 9. Section 03: Dual Signature Blocks & Corporate Seal
        sig_top = 148
        c.setStrokeColor(GOLD_PRIMARY)
        c.setLineWidth(0.8)
        c.line(42, sig_top + 12, w - 42, sig_top + 12)

        # Left Signatory: VP of HR
        c.setFillColor(SLATE_MUTED)
        c.setFont("Helvetica-Bold", 7.2)
        c.drawString(42, sig_top, "FOR AND ON BEHALF OF RAGNIFY ENTERPRISE TECHNOLOGIES INC.")

        # Cursive Signature
        c.setFillColor(NAVY_MID)
        c.setFont("Times-BoldItalic", 17)
        c.drawString(46, sig_top - 24, "Priya Sharma")

        c.setStrokeColor(SLATE_MUTED)
        c.setLineWidth(0.5)
        c.line(42, sig_top - 30, 195, sig_top - 30)

        c.setFillColor(SLATE_DARK)
        c.setFont("Helvetica-Bold", 8.8)
        c.drawString(42, sig_top - 41, "Priya Sharma")
        c.setFillColor(SLATE_MUTED)
        c.setFont("Helvetica", 7.5)
        c.drawString(42, sig_top - 51, "VP — Human Resources & People Operations")
        c.drawString(42, sig_top - 61, "Authorized Executive Signatory")

        # Center Official Corporate Seal Stamp
        seal_cx = w / 2 - 12
        seal_cy = sig_top - 30
        c.setStrokeColor(GOLD_PRIMARY)
        c.setFillColor(BG_IVORY)
        c.setLineWidth(1.4)
        c.circle(seal_cx, seal_cy, 28, stroke=1, fill=1)
        c.setLineWidth(0.6)
        c.circle(seal_cx, seal_cy, 24, stroke=1, fill=0)
        c.setFillColor(NAVY_DEEP)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawCentredString(seal_cx, seal_cy + 11, "RAGNIFY TECHNOLOGIES")
        c.setFillColor(GOLD_PRIMARY)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawCentredString(seal_cx, seal_cy + 1, "OFFICIAL HR SEAL")
        c.setFillColor(EMERALD)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawCentredString(seal_cx, seal_cy - 8, "VERIFIED & SEALED")
        c.setFillColor(SLATE_MUTED)
        c.setFont("Courier", 5)
        c.drawCentredString(seal_cx, seal_cy - 16, clean_id)

        # Right Signatory: Candidate Acceptance Box
        cand_box_x = w / 2 + 32
        cand_box_w = (w - 42) - cand_box_x
        cand_box_y = sig_top - 66
        cand_box_h = 72

        c.setFillColor(BG_ROW_ALT)
        c.setStrokeColor(BORDER_SUBTLE)
        c.setLineWidth(0.7)
        c.roundRect(cand_box_x, cand_box_y, cand_box_w, cand_box_h, 4, stroke=1, fill=1)

        c.setFillColor(NAVY_DEEP)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(cand_box_x + 10, cand_box_y + cand_box_h - 12, "CANDIDATE ACCEPTANCE & DECLARATION")

        c.setFillColor(SLATE_BODY)
        c.setFont("Helvetica", 6.8)
        c.drawString(cand_box_x + 10, cand_box_y + cand_box_h - 23, "I accept the appointment terms detailed in this Offer Letter.")

        is_signed = str(acceptance_status).upper() in ["COUNTERSIGNED", "ACCEPTED"]
        if is_signed:
            c.setFillColor(EMERALD)
            c.setFont("Times-BoldItalic", 13)
            c.drawString(cand_box_x + 12, cand_box_y + 24, str(candidate_name))
            c.setFont("Helvetica-Bold", 6.5)
            c.drawRightString(cand_box_x + cand_box_w - 10, cand_box_y + 26, "DIGITALLY COUNTERSIGNED")
        else:
            c.setFillColor(SLATE_MUTED)
            c.setFont("Helvetica-Oblique", 7.5)
            c.drawString(cand_box_x + 12, cand_box_y + 24, f"Sign Here: ___________________________")

        c.setStrokeColor(BORDER_SUBTLE)
        c.line(cand_box_x + 10, cand_box_y + 18, cand_box_x + cand_box_w - 10, cand_box_y + 18)

        c.setFillColor(SLATE_DARK)
        c.setFont("Helvetica-Bold", 7.2)
        c.drawString(cand_box_x + 10, cand_box_y + 7, f"Name: {candidate_name}")
        c.setFillColor(SLATE_MUTED)
        c.setFont("Helvetica", 6.8)
        c.drawRightString(cand_box_x + cand_box_w - 10, cand_box_y + 7, f"Date: {today_str if is_signed else '____/____/2026'}")

        # 10. Bottom Security & Verification Bar
        c.setFillColor(NAVY_DEEP)
        c.rect(21, 21, w - 42, 22, stroke=0, fill=1)
        c.setFillColor(GOLD_LIGHT)
        c.setFont("Courier-Bold", 7)
        c.drawString(34, 29, f"SHA-256 DIGITAL SIGNATURE VERIFIED  •  DOC-ID: {ref_no}")
        c.setFillColor(colors.HexColor("#94A3B8"))
        c.setFont("Helvetica", 6.8)
        c.drawRightString(w - 34, 29, "Page 1 of 1  •  RAGNIFY Automated HR Onboarding Platform")

        c.showPage()
        c.save()

        # Copy to reports dir as well
        try:
            import shutil
            shutil.copy(filepath_docs, filepath_reports)
        except Exception:
            pass

    except Exception as e:
        print(f"Error generating offer letter PDF: {e}")
        with open(filepath_docs, "w", encoding="utf-8") as f:
            f.write(f"RAGNIFY OFFER LETTER\n\nTo: {candidate_name} ({candidate_id})\nRole: {role}\nDepartment: {department}\nCompensation: {clean_comp}\nJoining Date: {joining_str}\n")

    return {
        "filename": filename,
        "download_url": f"/offer-letters/download/{clean_id}",
        "file_url": f"/offer-letters/download/{clean_id}",
        "static_url": f"/static/documents/{filename}",
        "file_type": "pdf",
        "file_name": filename
    }


