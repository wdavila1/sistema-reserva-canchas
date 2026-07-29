import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type {
  Kpis,
  ReservasPorPeriodoItem,
  CanchaMasUsadaItem,
  Rango,
} from "@/features/reportes/types/Reporte";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatPeriodo(p: string): string {
  const [y, m] = p.split("-");
  return `${MESES[Number(m) - 1]} ${y}`;
}

interface ReportePdfArgs {
  kpis: Kpis;
  porPeriodo: ReservasPorPeriodoItem[];
  canchas: CanchaMasUsadaItem[];
  rango: Rango;
}

export function generarReportePdf({ kpis, porPeriodo, canchas, rango }: ReportePdfArgs) {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Reporte de Reservaciones", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Período: ${rango.fechaInicio}  →  ${rango.fechaFin}`, 14, 25);
  doc.setTextColor(0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Indicadores", 14, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Total de reservas: ${kpis.totalReservas}`, 14, 46);
  doc.text(`Ingresos brutos: ${formatCurrency(kpis.ingresosBrutos)}`, 110, 46);
  doc.text(`ISV recaudado: ${formatCurrency(kpis.isv)}`, 14, 53);
  doc.text(`Ingresos netos: ${formatCurrency(kpis.ingresosNetos)}`, 110, 53);

  autoTable(doc, {
    startY: 62,
    head: [["Mes", "Reservas", "Ingresos (L.)"]],
    body: porPeriodo.map((p) => [
      formatPeriodo(p.periodo),
      String(p.reservas),
      formatCurrency(p.ingresos),
    ]),
    headStyles: { fillColor: [13, 122, 62] },
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    head: [["Cancha", "Reservas", "Ingreso (L.)"]],
    body: canchas.map((c) => [
      c.cancha,
      String(c.reservas),
      formatCurrency(c.ingreso),
    ]),
    headStyles: { fillColor: [13, 122, 62] },
    styles: { fontSize: 9 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generado el ${new Date().toLocaleString("es-HN")} — Página ${i} de ${pageCount}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  doc.save(`reporte-${rango.fechaInicio}_a_${rango.fechaFin}.pdf`);
}