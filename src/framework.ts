export type ExportFormat<TObject> = {
  name: string;
  seed: string;
  generated_on: string;
  guid: string;
  column_names: string[];
  flattened: string[][];
  objects: TObject[];
};

export type DisplayFormat = "ui" | "csv" | "json" | "flat";

export type Generator<TObject> = (seed: string) => ExportFormat<TObject>;
export type OutputRenderer<TObject> = (objects: TObject[]) => HTMLElement;

export type RandomRollPageConfig<TObject> = {
  generate: Generator<TObject>;
  outputRenderer: OutputRenderer<TObject>;
};

export function renderExportTextPage(app: HTMLElement, text: string): void {
  // No top bar on export pages.

  const pre = document.createElement("pre");
  pre.textContent = text;

  app.appendChild(pre);
}

export function getUrl(): URL {
  return new URL(window.location.href);
}

export function ensureSeedInUrl(): string {
  const url = getUrl();
  const existingSeed = url.searchParams.get("seed");

  if (existingSeed && existingSeed.trim() !== "") {
    return existingSeed;
  }

  const seed = randomSeed();
  url.searchParams.set("seed", seed);

  window.history.replaceState({}, "", url.toString());

  return seed;
}

export function getFormatFromUrl(): DisplayFormat {
  const url = getUrl();
  const format = url.searchParams.get("format");

  if (format === "csv") return "csv";
  if (format === "json") return "json";
  if (format === "flat") return "flat";

  return "ui";
}

export function setSeedInUrl(seed: string): void {
  const url = getUrl();

  url.searchParams.set("seed", seed);
  url.searchParams.delete("format");

  window.history.pushState({}, "", url.toString());
}

export function setFormatInUrl(format: DisplayFormat): void {
  const url = getUrl();

  if (format === "ui") {
    url.searchParams.delete("format");
  } else {
    url.searchParams.set("format", format);
  }

  window.history.pushState({}, "", url.toString());
}

export function randomSeed(length = 5): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let output = "";

  for (let i = 0; i < length; i++) {
    output += chars[Math.floor(Math.random() * chars.length)];
  }

  return output;
}

export function exportFullAsJson<TObject>(
  exportData: ExportFormat<TObject>,
): string {
  return JSON.stringify(exportData, null, 2);
}

export function exportFlat<TObject>(
  exportData: ExportFormat<TObject>,
): string {
  return exportData.flattened
    .map(row => row.join("\t"))
    .join("\n");
}

export function exportCsv<TObject>(
  exportData: ExportFormat<TObject>,
): string {
  const rows = [
    exportData.column_names,
    ...exportData.flattened,
  ];

  return rows
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\n");
}

export function escapeCsvCell(value: string): string {
  const mustQuote =
    value.includes(",") ||
    value.includes("\"") ||
    value.includes("\n") ||
    value.includes("\r");

  if (!mustQuote) {
    return value;
  }

  return `"${value.replaceAll("\"", "\"\"")}"`;
}

import seedrandom from "seedrandom";

export function buildExportFormat<TObject>(name: string, seed: string, col_names: string[], flattened_input: string[][], data_object: TObject[]) : ExportFormat<TObject> 
{
    return {
        name: name,
        seed: seed,
        generated_on: new Date().toString(),
        guid: crypto.randomUUID(),
        column_names: col_names,
        flattened: flattened_input,
        objects: data_object
    }
}

export function autoflatten<TObject extends Record<string, unknown>>(name: string, seed: string, data_objects: TObject[]) : ExportFormat<TObject> 
{
    let column_names = Object.keys(data_objects[0]);
    let flattened = data_objects.map(obj => column_names.map(col => String(obj[col] ?? "")));

    return buildExportFormat(name, seed, column_names, flattened, data_objects);
}

export type SingletonTable = {
  version: string;
  name: string;
  label?: string;
  table: {
    entries: string[];
  };
};

export type MultiColumnTable = {
  version: string;
  name: string;
  table: {
    columns: string[];
    rows: string[][];
  };
};

export function random_single(rng: seedrandom.PRNG, data:string[]) : string 
{
    let len = data.length;
    if (len == 0) { throw Error("No Data"); }
    let index = Math.floor(rng() * len);
    return data[index];
}

export function random_multi<TData>(rng: seedrandom.PRNG, data:TData[]) : TData
{
    let len = data.length;
    if (len == 0) { throw Error("No Data"); }
    let index = Math.floor(rng() * len);
    return data[index];
}