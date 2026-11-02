/** Saves CSV text as a file. A BOM is added so Excel reads accents (é, ü) correctly. */
export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Today's date for file names, e.g. faresdream-bookings-2026-11-01.csv. */
export const fileDate = () => new Date().toISOString().slice(0, 10);
