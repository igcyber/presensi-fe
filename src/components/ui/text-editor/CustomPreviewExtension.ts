import { Extension } from "@tiptap/core";

export interface CustomPreviewOptions {
  onPreview: () => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customPreview: {
      openPreview: () => ReturnType;
    };
  }
}

let globalPreviewCallback: (() => void) | null = null;

function addPreviewButtonToToolbar() {
  // Cari toolbar dengan lebih spesifik
  const editorElement = document.querySelector(".echo-editor");
  if (!editorElement) return;

  const toolbar = editorElement.querySelector(".echo-toolbar, .toolbar, [class*='toolbar']");
  if (!toolbar) return;

  // Cek apakah tombol sudah ada
  if (toolbar.querySelector(".preview-btn")) return;

  const previewButton = document.createElement("button");
  previewButton.type = "button";
  previewButton.className = "toolbar-btn preview-btn";
  previewButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
    </svg>
    <span>Preview</span>
  `;
  previewButton.title = "Preview (Ctrl+Shift+P)";

  previewButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (globalPreviewCallback) {
      globalPreviewCallback();
    }
  });

  // Cari posisi yang tepat untuk tombol
  const printerBtn = toolbar.querySelector(".printer-btn, [title*='Print'], [class*='print']");
  if (printerBtn && printerBtn.parentNode) {
    printerBtn.parentNode.insertBefore(previewButton, printerBtn.nextSibling);
  } else {
    // Jika tidak ada tombol printer, tambahkan di akhir
    toolbar.appendChild(previewButton);
  }
}

export const CustomPreviewExtension = Extension.create<CustomPreviewOptions>({
  name: "customPreview",

  addOptions() {
    return {
      onPreview: () => {},
    };
  },

  addCommands() {
    return {
      openPreview: () => () => {
        this.options.onPreview();
        return true;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-p": () => this.editor.commands.openPreview(),
    };
  },

  onCreate() {
    // Set global callback
    globalPreviewCallback = this.options.onPreview;

    // Tunggu DOM ready, lalu tambahkan tombol pratinjau
    setTimeout(() => {
      addPreviewButtonToToolbar();
    }, 500);
  },

  onDestroy() {
    globalPreviewCallback = null;
  },
});

export default CustomPreviewExtension;
