"use client";

import { Button } from "@/design-system";
import type { Lead } from "@/lib/leads";

interface CsvDownloadButtonProps {
  leads: Lead[];
}

/** Flattens every lead's `data` object into one shared column set (a lead of one type simply leaves the other types' columns blank) so the whole history opens as one sheet in Excel/Sheets, no per-type export needed. */
export function CsvDownloadButton({ leads }: CsvDownloadButtonProps) {
  function handleDownload() {
    const dataKeys = Array.from(new Set(leads.flatMap((l) => Object.keys(l.data)))).sort();
    const columns = ["at", "type", ...dataKeys];

    function escape(value: string): string {
      const v = value.replace(/"/g, '""');
      return /[",\n]/.test(v) ? `"${v}"` : v;
    }

    const lines = [
      columns.join(","),
      ...leads.map((l) => columns.map((c) => escape(c === "at" ? l.at : c === "type" ? l.type : l.data[c] ?? "")).join(",")),
    ];

    // A UTF-8 BOM prefix is what makes Excel render Persian text correctly
    // instead of guessing the wrong encoding and showing mojibake.
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hammasir-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="md" onClick={handleDownload} disabled={leads.length === 0}>
      دانلود CSV
    </Button>
  );
}
