// src/lib/utils/exportWord.ts
import {
  AlignmentType,
  BorderStyle,
  Document,
  Header,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

import type { RekapAbsenResponse } from "@/lib/api/types/presensi.types";

export const generateRekapWord = async (data: RekapAbsenResponse, periodeLabel: string) => {
  if (!data) return;

  // Konversi detail object ke array & urutkan tanggal
  const details = Object.values(data.detail).sort(
    (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime(),
  );

  // 1. Buat Header Tabel (Judul Kolom)
  const tableHeader = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        children: [new Paragraph({ text: "No", alignment: AlignmentType.CENTER, style: "TableHeader" })],
        width: { size: 5, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "Tanggal", alignment: AlignmentType.CENTER, style: "TableHeader" })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "Jam Masuk", alignment: AlignmentType.CENTER, style: "TableHeader" })],
        width: { size: 15, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "Jam Pulang", alignment: AlignmentType.CENTER, style: "TableHeader" })],
        width: { size: 15, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "Status", alignment: AlignmentType.CENTER, style: "TableHeader" })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "Keterangan", alignment: AlignmentType.CENTER, style: "TableHeader" })],
        width: { size: 25, type: WidthType.PERCENTAGE },
      }),
    ],
  });

  // 2. Buat Baris Data
  const tableRows = details.map((item, index) => {
    // Helper ambil jam
    const masuk = item.data_absen.find((a) => a.tipe.includes("MASUK"))?.jam || "-";
    const pulang = item.data_absen.find((a) => a.tipe.includes("PULANG"))?.jam || "-";

    // Format Tanggal
    const tgl = new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: String(index + 1), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph(tgl)] }),
        new TableCell({ children: [new Paragraph({ text: masuk, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: pulang, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: item.status, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "", alignment: AlignmentType.CENTER })] }), // Kolom keterangan kosong/manual
      ],
    });
  });

  // 3. Susun Dokumen
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "TableHeader",
          name: "Table Header",
          basedOn: "Normal",
          next: "Normal",
          run: {
            bold: true,
            size: 24, // 12pt
          },
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: [
          // JUDUL
          new Paragraph({
            text: "REKAPITULASI PRESENSI PEGAWAI",
            heading: "Heading1",
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // INFO PEGAWAI
          new Paragraph({ text: `Nama Pegawai : ${data.pegawai.nama}`, spacing: { after: 50 } }),
          new Paragraph({ text: `Jabatan/Tipe : ${data.pegawai.tipe_pegawai}`, spacing: { after: 50 } }),
          new Paragraph({ text: `Periode      : ${periodeLabel}`, spacing: { after: 200 } }),

          // TABEL
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [tableHeader, ...tableRows],
          }),

          // TANDA TANGAN (Opsional)
          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Paragraph({
            text: `Kutai Kartanegara, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: "Mengetahui,",
            alignment: AlignmentType.RIGHT,
            spacing: { after: 600 }, // Spasi untuk tanda tangan
          }),
          new Paragraph({
            text: "( ..................................... )",
            alignment: AlignmentType.RIGHT,
          }),
        ],
      },
    ],
  });

  // 4. Generate & Download
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Rekap_Presensi_${data.pegawai.nama}_${periodeLabel}.docx`);
};
