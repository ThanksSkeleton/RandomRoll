import {
  ensureSeedInUrl,
  randomSeed,
  setSeedInUrl,
} from "../../../framework";
import { buildXccSheet } from "../populate_xcc_template";
import { default_build } from "../xcc_impl";
import { captureXccSheet } from "./capture_xcc_sheet";
import {
  WebGlSheetRenderer,
  WebGlUnavailableError,
} from "./webgl_sheet_renderer";

const sourceHost = requiredElement<HTMLElement>("source-host");
const outputHost = requiredElement<HTMLElement>("output-host");
const outputCanvas = requiredElement<HTMLCanvasElement>("shader-output");
const rerollButton = requiredElement<HTMLButtonElement>("reroll");
const recaptureButton = requiredElement<HTMLButtonElement>("recapture");
const seedLabel = requiredElement<HTMLElement>("seed-label");
const status = requiredElement<HTMLElement>("pipeline-status");
const fallbackMessage = requiredElement<HTMLElement>("fallback-message");

let renderer: WebGlSheetRenderer | null = null;
let currentSheet: HTMLElement | null = null;
let renderVersion = 0;
let captureCount = 0;

try {
  renderer = new WebGlSheetRenderer(outputCanvas);
} catch (error) {
  if (!(error instanceof WebGlUnavailableError)) {
    throw error;
  }
}

rerollButton.addEventListener("click", () => {
  setSeedInUrl(randomSeed());
  void renderCharacter();
});

recaptureButton.addEventListener("click", () => {
  if (currentSheet) {
    void captureAndUpload(currentSheet, renderVersion);
  }
});

window.addEventListener("popstate", () => {
  void renderCharacter();
});

window.addEventListener("beforeunload", () => {
  renderer?.destroy();
});

void renderCharacter();

async function renderCharacter(): Promise<void> {
  const version = ++renderVersion;
  const seed = ensureSeedInUrl();
  const generated = default_build(seed);
  const sheet = buildXccSheet(generated.objects);

  currentSheet = sheet;
  sourceHost.replaceChildren(sheet);
  seedLabel.textContent = `Seed: ${seed}`;

  await captureAndUpload(sheet, version);
}

async function captureAndUpload(
  sheet: HTMLElement,
  version: number,
): Promise<void> {
  setBusy(true);
  setStatus("Capturing source DOM…", "working");

  try {
    const capture = await captureXccSheet(sheet);
    if (version !== renderVersion || sheet !== currentSheet) {
      return;
    }

    captureCount++;
    if (renderer) {
      renderer.updateTexture(capture);
      renderer.start();
      setStatus(
        `Ready — ${capture.width}×${capture.height}, capture ${captureCount}, texture upload ${renderer.textureUploadCount}`,
        "ready",
      );
      return;
    }

    showFallback(capture);
    setStatus(
      `DOM capture passed (${capture.width}×${capture.height}); WebGL2 unavailable`,
      "ready",
    );
  } catch (error) {
    console.error("XCC WebGL spike failed", error);
    setStatus(describeError(error), "error");
  } finally {
    if (version === renderVersion) {
      setBusy(false);
    }
  }
}

function showFallback(capture: HTMLCanvasElement): void {
  capture.className = "fallback-capture";
  capture.setAttribute("aria-label", "Unfiltered fallback capture of the XCC character sheet");
  outputHost.replaceChildren(capture);
  fallbackMessage.hidden = false;
  fallbackMessage.textContent =
    "The HTML-to-canvas capture succeeded, but this browser did not provide WebGL2. The unfiltered capture is shown instead.";
}

function setBusy(busy: boolean): void {
  rerollButton.disabled = busy;
  recaptureButton.disabled = busy;
}

function setStatus(message: string, state: "working" | "ready" | "error"): void {
  status.textContent = message;
  status.dataset.state = state;
}

function describeError(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

function requiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required element #${id}.`);
  }
  return element as T;
}
