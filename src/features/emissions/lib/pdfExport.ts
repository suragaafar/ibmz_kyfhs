import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ReportData } from '@/shared/types';

// ─── Brand colours (forest green palette) ────────────────────────────────────
const DARK_GREEN  = [27,  67,  50]  as [number, number, number]; // #1b4332
const MID_GREEN   = [45, 106,  79]  as [number, number, number]; // #2d6a4f
const LIGHT_GREEN = [116, 198, 157] as [number, number, number]; // #74c69d
const BG_TINT     = [240, 250, 243] as [number, number, number]; // #f0faf3
const TEXT_DARK   = [15,  40,  28]  as [number, number, number]; // near-black
const TEXT_MUTED  = [108, 158, 132] as [number, number, number]; // #6c9e84

const MARGIN = 18; // mm left/right margin

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pageWidth(doc: jsPDF): number {
  return doc.internal.pageSize.getWidth();
}

function addPageBackground(doc: jsPDF): void {
  doc.setFillColor(...BG_TINT);
  doc.rect(0, 0, pageWidth(doc), doc.internal.pageSize.getHeight(), 'F');
}

/** Wraps text at maxWidth and returns y position after the last line. */
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 6,
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

/** Draw a left-border accent block. Returns y after the block. */
function addAccentBlock(
  doc: jsPDF,
  text: string,
  y: number,
  maxWidth: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth - 8) as string[];
  const blockH = lines.length * 6 + 8;

  doc.setFillColor(240, 250, 243);
  doc.roundedRect(MARGIN, y, maxWidth, blockH, 2, 2, 'F');
  doc.setFillColor(...LIGHT_GREEN);
  doc.rect(MARGIN, y, 3, blockH, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...TEXT_DARK);
  doc.text(lines, MARGIN + 8, y + 6);

  return y + blockH + 4;
}

// ─── Category breakdown bar chart (simple horizontal bars) ───────────────────

function addBarChart(
  doc: jsPDF,
  breakdown: Record<string, number>,
  y: number,
): number {
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0) || 1;
  const chartW = pageWidth(doc) - MARGIN * 2;
  const barH = 7;
  const gap = 4;
  const labelW = 34;
  const barAreaW = chartW - labelW - 24;

  let cy = y;
  Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, kg]) => {
      const ratio = kg / total;
      const filled = barAreaW * ratio;

      // Label
      doc.setFontSize(9);
      doc.setTextColor(...TEXT_MUTED);
      doc.text(cat.charAt(0).toUpperCase() + cat.slice(1), MARGIN, cy + barH - 1);

      // Background bar
      doc.setFillColor(220, 240, 228);
      doc.roundedRect(MARGIN + labelW, cy, barAreaW, barH, 2, 2, 'F');

      // Filled bar
      if (filled > 0) {
        doc.setFillColor(...MID_GREEN);
        doc.roundedRect(MARGIN + labelW, cy, filled, barH, 2, 2, 'F');
      }

      // Value
      doc.setFontSize(8);
      doc.setTextColor(...TEXT_DARK);
      doc.text(`${kg} kg`, MARGIN + labelW + barAreaW + 4, cy + barH - 1);

      cy += barH + gap;
    });

  return cy + 4;
}

// ─── Header / Footer ─────────────────────────────────────────────────────────

function addHeader(doc: jsPDF, generatedAt: string): void {
  // Green banner
  doc.setFillColor(...DARK_GREEN);
  doc.rect(0, 0, pageWidth(doc), 28, 'F');

  // Leaf emoji workaround — use a unicode text block
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('EcoSense', MARGIN, 17);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...LIGHT_GREEN);
  doc.text('Carbon Emissions Report', MARGIN, 24);

  // Date top-right
  doc.setFontSize(8);
  doc.setTextColor(180, 220, 196);
  doc.text(`Generated: ${generatedAt}`, pageWidth(doc) - MARGIN, 24, { align: 'right' });
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number): void {
  const y = doc.internal.pageSize.getHeight() - 10;
  doc.setFillColor(...DARK_GREEN);
  doc.rect(0, y - 4, pageWidth(doc), 14, 'F');

  doc.setFontSize(8);
  doc.setTextColor(...LIGHT_GREEN);
  doc.text('EcoSense — Track, understand, and reduce your carbon footprint', MARGIN, y + 2);
  doc.text(`Page ${pageNum} / ${totalPages}`, pageWidth(doc) - MARGIN, y + 2, { align: 'right' });
}

// ─── Stat boxes ──────────────────────────────────────────────────────────────

function addStatBoxes(doc: jsPDF, report: ReportData, y: number): number {
  const { stats } = report;
  const boxW = (pageWidth(doc) - MARGIN * 2 - 9) / 4;

  const boxes = [
    { label: 'Total Emissions', value: `${stats.totalEmissions} kg`, unit: 'CO\u2082e' },
    { label: 'Daily Average',   value: `${stats.monthlyAverage} kg`, unit: 'CO\u2082e / day' },
    {
      label: 'Top Category',
      value: stats.topCategory.charAt(0).toUpperCase() + stats.topCategory.slice(1),
      unit: 'Highest emitter',
    },
    {
      label: 'vs. Last Period',
      value: `${stats.percentageChange > 0 ? '+' : ''}${stats.percentageChange}%`,
      unit: stats.percentageChange < 0 ? 'Improvement' : 'Needs work',
    },
  ];

  boxes.forEach((box, i) => {
    const x = MARGIN + i * (boxW + 3);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, boxW, 22, 2, 2, 'F');
    doc.setDrawColor(...LIGHT_GREEN);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, boxW, 22, 2, 2, 'S');

    doc.setFontSize(7);
    doc.setTextColor(...TEXT_MUTED);
    doc.setFont('helvetica', 'normal');
    doc.text(box.label.toUpperCase(), x + boxW / 2, y + 5.5, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK_GREEN);
    doc.text(box.value, x + boxW / 2, y + 13, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_MUTED);
    doc.text(box.unit, x + boxW / 2, y + 19, { align: 'center' });
  });

  return y + 28;
}

// ─── Section title ────────────────────────────────────────────────────────────

function sectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(...MID_GREEN);
  doc.rect(MARGIN, y, pageWidth(doc) - MARGIN * 2, 0.6, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_GREEN);
  doc.text(title, MARGIN, y - 2);

  return y + 6;
}

// ─── Main export function ─────────────────────────────────────────────────────

export function exportReportPDF(report: ReportData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const contentW = pageWidth(doc) - MARGIN * 2;
  let y = 0;

  // ── Page 1 ──────────────────────────────────────────────────────────────────
  addPageBackground(doc);
  addHeader(doc, new Date(report.generatedAt).toLocaleString());
  y = 36;

  // Stat boxes
  y = addStatBoxes(doc, report, y);
  y += 4;

  // Summary section
  y = sectionTitle(doc, 'Emissions Summary', y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  y = addWrappedText(doc, report.aiSummary, MARGIN, y, contentW) + 6;

  // Category breakdown chart
  y = sectionTitle(doc, 'Breakdown by Category', y);

  const breakdown = report.entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = Number(((acc[e.category] ?? 0) + e.amount).toFixed(2));
    return acc;
  }, {});

  y = addBarChart(doc, breakdown, y) + 4;

  // AI Advice
  y = sectionTitle(doc, 'AI-Powered Recommendations', y);
  y = addAccentBlock(doc, report.aiAdvice, y, contentW) + 4;

  // ── Emission Log table (auto page-break) ────────────────────────────────────
  y = sectionTitle(doc, 'Full Emission Log', y);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Date', 'Category', 'Description', 'CO\u2082e (kg)']],
    body: report.entries.map((e) => [
      e.date,
      e.category.charAt(0).toUpperCase() + e.category.slice(1),
      e.description,
      e.amount.toFixed(2),
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: TEXT_DARK,
      lineColor: [210, 235, 218],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: DARK_GREEN,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: BG_TINT },
    columnStyles: { 3: { halign: 'right' } },
    didDrawPage: (data) => {
      addPageBackground(doc);
      if (data.pageNumber > 1) {
        addHeader(doc, new Date(report.generatedAt).toLocaleString());
      }
    },
  });

  // ── Footers on every page ────────────────────────────────────────────────────
  const totalPages = (doc.internal as unknown as { getNumberOfPages(): number }).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addFooter(doc, p, totalPages);
  }

  const filename = `ecosense-report-${new Date(report.generatedAt).toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
