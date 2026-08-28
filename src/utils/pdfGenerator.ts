import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member, Expense, TripSettings, FinancialSummary } from '../types';
import { formatINR } from './currency';

/**
 * Generates a complete Financial & Settlement Report PDF statement for Ujjain Trip
 */
export function generateTripFinancialReportPDF(
  members: Member[],
  expenses: Expense[],
  summary: FinancialSummary,
  settings: TripSettings
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Top Header Banner
  doc.setFillColor(17, 24, 39); // Deep Slate / Black
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`${settings.trip_name.toUpperCase()} • ${settings.subtitle.toUpperCase()}`, 105, 13, {
    align: 'center',
  });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Destination: ${settings.destination}  |  Dates: ${settings.start_date} to ${settings.end_date}`,
    105,
    22,
    { align: 'center' }
  );

  let y = 40;
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(9);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`, 14, y);

  // Financial Summary Cards Table
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [['EXPECTED FUND', 'ACTUAL COLLECTED', 'TRIP FUND SPENT', 'AVAILABLE BALANCE']],
    body: [
      [
        formatINR(summary.expectedFund, 'Rs.'),
        formatINR(summary.totalCollected, 'Rs.'),
        formatINR(summary.totalTripFundExpenses, 'Rs.'),
        formatINR(summary.availableBalance, 'Rs.'),
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 10, fontStyle: 'bold', halign: 'center' },
  });

  let currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // Key Fund Statistics Table
  autoTable(doc, {
    startY: currentY,
    head: [['METRIC', 'DETAILS / VALUE']],
    body: [
      ['Contribution Per Person', `${formatINR(summary.contributionPerPerson, 'Rs.')} per confirmed person`],
      ['Confirmed Group Members', `${summary.confirmedMembersCount} confirmed out of ${summary.totalMembersCount} total members`],
      ['Online / UPI Pool Balance', `${formatINR(summary.balanceOnline, 'Rs.')} (Collected: ${formatINR(summary.collectedOnline, 'Rs.')}, Spent: ${formatINR(summary.expensesOnline, 'Rs.')})`],
      ['Cash in Hand Pool Balance', `${formatINR(summary.balanceCash, 'Rs.')} (Collected: ${formatINR(summary.collectedCash, 'Rs.')}, Spent: ${formatINR(summary.expensesCash, 'Rs.')})`],
      ['Member Payment Status', `${summary.paidMembersCount} Paid in Full, ${summary.partialMembersCount} Partial, ${summary.unpaidMembersCount} Pending`],
      ['Collection Progress', `${summary.collectionProgressPercent}% (${formatINR(summary.totalCollected, 'Rs.')} of ${formatINR(summary.expectedFund, 'Rs.')})`],
      ['Personal Expenses (Reimbursements Due)', `${formatINR(summary.totalReimbursementsDue, 'Rs.')} due to members`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [184, 150, 12] },
    bodyStyles: { fontSize: 9 },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Section 1: Members & Contributions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text('MEMBERS & FUND CONTRIBUTIONS', 14, currentY);

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Member Name', 'Status', 'Expected', 'Paid', 'Pending Due', 'Payment Mode', 'Status']],
    body: members.map((m) => {
      const isPaid = m.amount_paid >= m.expected_contribution;
      const isPartial = m.amount_paid > 0 && m.amount_paid < m.expected_contribution;
      const pendingDue = Math.max(0, m.expected_contribution - m.amount_paid);
      const payStatus = isPaid ? 'PAID' : isPartial ? 'PARTIAL' : 'PENDING';
      return [
        m.name,
        m.status,
        formatINR(m.expected_contribution, 'Rs.'),
        formatINR(m.amount_paid, 'Rs.'),
        formatINR(pendingDue, 'Rs.'),
        m.payment_mode,
        payStatus,
      ];
    }),
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
    bodyStyles: { fontSize: 8.5 },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Page break check
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  // Section 2: Trip Expenses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text('TRIP EXPENSES LEDGER', 14, currentY);

  autoTable(doc, {
    startY: currentY + 4,
    head: [['No', 'Title', 'Category', 'Paid By', 'Source', 'Mode', 'Date', 'Amount']],
    body: expenses.map((e) => [
      e.expense_number,
      e.title,
      e.category,
      e.paid_by_name || 'N/A',
      e.source === 'trip_fund' ? 'Trip Fund' : 'Personal',
      e.payment_mode,
      e.date,
      formatINR(e.amount, 'Rs.'),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [239, 68, 68] },
    bodyStyles: { fontSize: 8 },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Section 3: Personal Expense Reimbursements
  if (summary.reimbursements.length > 0) {
    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text('PERSONAL EXPENSE REIMBURSEMENTS DUE', 14, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Member Name', 'Total Personal Spent', 'Settled / Reimbursed', 'Pending Due']],
      body: summary.reimbursements.map((r) => [
        r.member_name,
        formatINR(r.total_personal_spent, 'Rs.'),
        formatINR(r.total_reimbursed, 'Rs.'),
        formatINR(r.pending_reimbursement, 'Rs.'),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11] },
      bodyStyles: { fontSize: 8.5, fontStyle: 'bold' },
    });
  }

  return doc;
}
