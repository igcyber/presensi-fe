import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const ImageDeleteListener = Extension.create({
  name: "imageDeleteListener",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageDeleteListener"),
        appendTransaction: (transactions, oldState, newState) => {
          const oldDoc = oldState.doc;
          const newDoc = newState.doc;

          // Cari gambar yang dihapus
          const deletedImages: string[] = [];

          // Bandingkan node lama dan baru untuk menemukan gambar yang dihapus
          oldDoc.descendants((node, _pos) => {
            if (node.type.name === "image") {
              const imageSrc = node.attrs.src;
              if (imageSrc && !isImageStillPresent(newDoc, imageSrc)) {
                deletedImages.push(imageSrc);
              }
            }
          });

          // Panggil fungsi remove untuk setiap gambar yang dihapus
          deletedImages.forEach((imageSrc) => {
            removeImageFromServer(imageSrc);
          });

          return null;
        },
      }),
    ];
  },
});

// Helper functions
function isImageStillPresent(doc: any, imageSrc: string): boolean {
  let found = false;
  doc.descendants((node: any) => {
    if (node.type.name === "image" && node.attrs.src === imageSrc) {
      found = true;
      return false; // Stop searching
    }
  });
  return found;
}

function removeImageFromServer(imageUrl: string) {
  // Panggil fungsi global yang sudah di-expose di window
  if (typeof window !== "undefined" && (window as any).__echoRemoveImageFromServer) {
    (window as any).__echoRemoveImageFromServer(imageUrl);
  }
}
