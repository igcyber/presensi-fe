<script setup lang="ts">
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Strike from "@tiptap/extension-strike";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { createLowlight } from "lowlight";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon,
} from "lucide-vue-next";
import { useField } from "vee-validate";
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Inisialisasi lowlight
const lowlight = createLowlight();

// Interface untuk SetImageOptions yang diperluas
interface ExtendedSetImageOptions {
  src: string;
  alt?: string;
  title?: string;
  size?: "small" | "medium" | "large";
}

// Custom Image extension dengan resize dan delete
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
        parseHTML: (element) => element.getAttribute("width"),
      },
      height: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
        parseHTML: (element) => element.getAttribute("height"),
      },
      size: {
        default: "medium",
        renderHTML: (attributes) => {
          const sizeClasses: Record<string, string> = {
            small: "max-w-xs",
            medium: "max-w-md",
            large: "max-w-full",
          };
          return { class: sizeClasses[attributes.size] || sizeClasses.medium };
        },
        parseHTML: (element) => {
          if (element.classList.contains("max-w-xs")) return "small";
          if (element.classList.contains("max-w-full")) return "large";
          return "medium";
        },
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement("div");
      container.className = "relative inline-block group";

      // Prevent form submission when clicking on image container
      container.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.className = `rounded-lg ${node.attrs.size === "small" ? "max-w-xs" : node.attrs.size === "large" ? "max-w-full" : "max-w-md"}`;

      const controls = document.createElement("div");
      controls.className =
        "absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 p-1";

      // Prevent event bubbling from controls
      controls.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      // Tombol resize
      const smallBtn = document.createElement("button");
      smallBtn.type = "button";
      smallBtn.innerHTML =
        '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>';
      smallBtn.className = `p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${node.attrs.size === "small" ? "bg-blue-100 dark:bg-blue-900" : ""}`;
      smallBtn.title = "Kecil";
      smallBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          editor.chain().focus().updateAttributes("image", { size: "small" }).run();
        }
      };

      const mediumBtn = document.createElement("button");
      mediumBtn.type = "button";
      mediumBtn.innerHTML =
        '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>';
      mediumBtn.className = `p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${node.attrs.size === "medium" ? "bg-blue-100 dark:bg-blue-900" : ""}`;
      mediumBtn.title = "Sedang";
      mediumBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          editor.chain().focus().updateAttributes("image", { size: "medium" }).run();
        }
      };

      const largeBtn = document.createElement("button");
      largeBtn.type = "button";
      largeBtn.innerHTML =
        '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M2 2h10v10H2V2zm12 0h8v8h-8V2zM2 14h10v8H2v-8zm12 0h8v8h-8v-8z"/></svg>';
      largeBtn.className = `p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${node.attrs.size === "large" ? "bg-blue-100 dark:bg-blue-900" : ""}`;
      largeBtn.title = "Besar";
      largeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          editor.chain().focus().updateAttributes("image", { size: "large" }).run();
        }
      };

      // Tombol delete
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.innerHTML =
        '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/></svg>';
      deleteBtn.className = "p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600";
      deleteBtn.title = "Hapus";
      deleteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          const pos = getPos();
          if (pos !== undefined) {
            editor
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + node.nodeSize })
              .run();
          }
        }
      };

      controls.appendChild(smallBtn);
      controls.appendChild(mediumBtn);
      controls.appendChild(largeBtn);
      controls.appendChild(deleteBtn);

      container.appendChild(img);
      container.appendChild(controls);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "image") return false;
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || "";
          img.className = `rounded-lg ${updatedNode.attrs.size === "small" ? "max-w-xs" : updatedNode.attrs.size === "large" ? "max-w-full" : "max-w-md"}`;

          // Update button states
          smallBtn.className = `p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${updatedNode.attrs.size === "small" ? "bg-blue-100 dark:bg-blue-900" : ""}`;
          mediumBtn.className = `p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${updatedNode.attrs.size === "medium" ? "bg-blue-100 dark:bg-blue-900" : ""}`;
          largeBtn.className = `p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${updatedNode.attrs.size === "large" ? "bg-blue-100 dark:bg-blue-900" : ""}`;

          return true;
        },
      };
    };
  },
});

// Custom Table extension dengan kontrol dinamis
const CustomTable = Table.extend({
  addNodeView() {
    return ({ node: _node, getPos, editor }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "table-container relative group";

      const table = document.createElement("table");
      table.className = "border-collapse border border-gray-300 dark:border-gray-600";

      // Controls container
      const controls = document.createElement("div");
      controls.className =
        "absolute -top-10 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 p-1 z-10";

      // Add row button
      const addRowBtn = document.createElement("button");
      addRowBtn.type = "button";
      addRowBtn.innerHTML = "➕ Baris";
      addRowBtn.className = "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs";
      addRowBtn.title = "Tambah Baris";
      addRowBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          editor.chain().focus().addRowAfter().run();
        }
      };

      // Add column button
      const addColBtn = document.createElement("button");
      addColBtn.type = "button";
      addColBtn.innerHTML = "➕ Kolom";
      addColBtn.className = "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs";
      addColBtn.title = "Tambah Kolom";
      addColBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          editor.chain().focus().addColumnAfter().run();
        }
      };

      // Delete row button
      const delRowBtn = document.createElement("button");
      delRowBtn.type = "button";
      delRowBtn.innerHTML = "➖ Baris";
      delRowBtn.className = "p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 text-xs";
      delRowBtn.title = "Hapus Baris";
      delRowBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          editor.chain().focus().deleteRow().run();
        }
      };

      // Delete column button
      const delColBtn = document.createElement("button");
      delColBtn.type = "button";
      delColBtn.innerHTML = "➖ Kolom";
      delColBtn.className = "p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 text-xs";
      delColBtn.title = "Hapus Kolom";
      delColBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          editor.chain().focus().deleteColumn().run();
        }
      };

      // Delete table button
      const deleteTableBtn = document.createElement("button");
      deleteTableBtn.type = "button";
      deleteTableBtn.innerHTML =
        '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/></svg>';
      deleteTableBtn.className = "p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 text-xs";
      deleteTableBtn.title = "Hapus Table";
      deleteTableBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === "function") {
          editor.chain().focus().deleteTable().run();
        }
      };

      controls.appendChild(addRowBtn);
      controls.appendChild(addColBtn);
      controls.appendChild(delRowBtn);
      controls.appendChild(delColBtn);

      // Separator
      const separator = document.createElement("div");
      separator.className = "w-px bg-gray-300 dark:bg-gray-600 mx-1";
      controls.appendChild(separator);

      controls.appendChild(deleteTableBtn);

      wrapper.appendChild(controls);
      wrapper.appendChild(table);

      return {
        dom: wrapper,
        contentDOM: table,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "table") return false;
          return true;
        },
      };
    };
  },
});

// Interface untuk props
interface Props {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  showToolbar?: boolean;
  enableImageUpload?: boolean;
  enableTable?: boolean;
  enableCodeBlock?: boolean;
  imageUploadHandler?: (file: File) => Promise<string>;
  description?: string;
  minHeight?: number;
}

// Props dengan default values
const props = withDefaults(defineProps<Props>(), {
  placeholder: "Mulai menulis...",
  disabled: false,
  showToolbar: true,
  enableImageUpload: true,
  enableTable: true,
  enableCodeBlock: true,
  minHeight: 200,
});

// Registrasi field ke vee-validate
const { value, errorMessage } = useField<string>(props.name);

// Refs
const imageInputRef = ref<HTMLInputElement>();
const tableDialogOpen = ref(false);
const tableRows = ref(3);
const tableCols = ref(3);

// Inisialisasi editor
const editor = useEditor({
  content: value.value || "",
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({ codeBlock: false, underline: false, strike: false }),
    Underline,
    Strike,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    ...(props.enableImageUpload ? [CustomImage] : []),
    ...(props.enableTable ? [CustomTable, TableRow, TableHeader, TableCell] : []),
    ...(props.enableCodeBlock ? [CodeBlockLowlight.configure({ lowlight })] : []),
    ...(props.maxLength ? [CharacterCount.configure({ limit: props.maxLength })] : []),
  ],
  editorProps: {
    attributes: {
      class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-4 focus:outline-none ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`,
      "data-placeholder": props.placeholder,
      style: `min-height: ${props.minHeight}px`,
      "aria-label": props.label,
      "aria-describedby": props.description ? `${props.name}-description` : "",
    },
  },
  onUpdate: ({ editor }) => {
    if (!props.disabled) {
      value.value = editor.getHTML(); // sync ke vee-validate
    }
  },
});

// Computed properties untuk toolbar states
const isBold = computed(() => editor.value?.isActive("bold"));
const isItalic = computed(() => editor.value?.isActive("italic"));
const isUnderline = computed(() => editor.value?.isActive("underline"));
const isStrike = computed(() => editor.value?.isActive("strike"));
const isBulletList = computed(() => editor.value?.isActive("bulletList"));
const isOrderedList = computed(() => editor.value?.isActive("orderedList"));
const isBlockquote = computed(() => editor.value?.isActive("blockquote"));
const isCodeBlock = computed(() => editor.value?.isActive("codeBlock"));

const currentAlignment = computed(() => {
  if (editor.value?.isActive({ textAlign: "center" })) return "center";
  if (editor.value?.isActive({ textAlign: "right" })) return "right";
  if (editor.value?.isActive({ textAlign: "justify" })) return "justify";
  return "left";
});

// Toolbar actions
const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run();
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run();
const setHeading = (level: 1 | 2 | 3) => editor.value?.chain().focus().toggleHeading({ level }).run();
const setTextAlign = (align: "left" | "center" | "right" | "justify") =>
  editor.value?.chain().focus().setTextAlign(align).run();
const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run();
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run();
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run();
const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run();
const insertTable = () => {
  editor.value
    ?.chain()
    .focus()
    .insertTable({
      rows: tableRows.value,
      cols: tableCols.value,
      withHeaderRow: true,
    })
    .run();
  tableDialogOpen.value = false;
};

// Image upload handlers
const handleImageUpload = () => requestAnimationFrame(() => imageInputRef.value?.click());
const onImageSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (props.imageUploadHandler) {
    try {
      const url = await props.imageUploadHandler(file);
      editor.value
        ?.chain()
        .focus()
        .setImage({ src: url, size: "medium" } as ExtendedSetImageOptions)
        .run();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  } else {
    const reader = new FileReader();
    reader.onload = (e) =>
      editor.value
        ?.chain()
        .focus()
        .setImage({ src: e.target?.result as string, size: "medium" } as ExtendedSetImageOptions)
        .run();
    reader.readAsDataURL(file);
  }
};

// Watchers
// Sync external value → editor
watch(
  () => value.value,
  (newVal) => {
    if (newVal !== editor.value?.getHTML()) {
      editor.value?.commands.setContent(newVal || "");
    }
  },
);

// Watch disabled state changes
watch(
  () => props.disabled,
  (disabled) => {
    editor.value?.setEditable(!disabled);
  },
);

// Lifecycle hooks
onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="space-y-1">
    <!-- Label -->
    <label
      :for="props.name"
      class="flex items-center gap-2 text-sm leading-none font-medium select-none"
      :class="{ 'text-destructive': errorMessage }"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-destructive">*</span>
    </label>

    <!-- Toolbar -->
    <div
      v-if="props.showToolbar && !props.disabled"
      class="bg-muted/50 dark:bg-muted/20 border-ring/50 flex flex-wrap items-center gap-1 rounded-lg border p-2"
    >
      <Button
        variant="ghost"
        size="sm"
        :class="{
          'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
            isBold,
        }"
        @click.stop.prevent="toggleBold"
        ><Bold class="h-4 w-4"
      /></Button>
      <Button
        variant="ghost"
        size="sm"
        :class="{
          'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
            isItalic,
        }"
        @click.stop.prevent="toggleItalic"
        ><Italic class="h-4 w-4"
      /></Button>
      <Button
        variant="ghost"
        size="sm"
        :class="{
          'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
            isUnderline,
        }"
        @click.stop.prevent="toggleUnderline"
        ><UnderlineIcon class="h-4 w-4"
      /></Button>
      <Button
        variant="ghost"
        size="sm"
        :class="{
          'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
            isStrike,
        }"
        @click.stop.prevent="toggleStrike"
        ><Strikethrough class="h-4 w-4"
      /></Button>

      <Separator orientation="vertical" class="h-6" />

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm"><Heading1 class="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="setHeading(1)"><Heading1 class="mr-2 h-4 w-4" /> H1</DropdownMenuItem>
          <DropdownMenuItem @click="setHeading(2)"><Heading2 class="mr-2 h-4 w-4" /> H2</DropdownMenuItem>
          <DropdownMenuItem @click="setHeading(3)"><Heading3 class="mr-2 h-4 w-4" /> H3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" class="hidden h-6 sm:block" />

      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          :class="{
            'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
              currentAlignment === 'left',
          }"
          @click.stop.prevent="setTextAlign('left')"
          ><AlignLeft class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="sm"
          :class="{
            'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
              currentAlignment === 'center',
          }"
          @click.stop.prevent="setTextAlign('center')"
          ><AlignCenter class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="sm"
          :class="{
            'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
              currentAlignment === 'right',
          }"
          @click.stop.prevent="setTextAlign('right')"
          ><AlignRight class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="sm"
          :class="{
            'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
              currentAlignment === 'justify',
          }"
          @click.stop.prevent="setTextAlign('justify')"
          ><AlignJustify class="h-4 w-4"
        /></Button>
      </div>

      <Separator orientation="vertical" class="hidden h-6 sm:block" />

      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          :class="{
            'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
              isBulletList,
          }"
          @click.stop.prevent="toggleBulletList"
          ><List class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="sm"
          :class="{
            'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
              isOrderedList,
          }"
          @click.stop.prevent="toggleOrderedList"
          ><ListOrdered class="h-4 w-4"
        /></Button>
      </div>

      <Separator orientation="vertical" class="hidden h-6 sm:block" />

      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          :class="{
            'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
              isBlockquote,
          }"
          @click.stop.prevent="toggleBlockquote"
          ><Quote class="h-4 w-4"
        /></Button>
        <Button
          v-if="props.enableCodeBlock"
          variant="ghost"
          size="sm"
          :class="{
            'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300':
              isCodeBlock,
          }"
          @click.stop.prevent="toggleCodeBlock"
          ><Code class="h-4 w-4"
        /></Button>
      </div>

      <Separator orientation="vertical" class="hidden h-6 sm:block" />

      <div class="flex items-center gap-1">
        <Button v-if="props.enableImageUpload" variant="ghost" size="sm" @click.stop.prevent="handleImageUpload"
          ><ImageIcon class="h-4 w-4"
        /></Button>

        <Dialog v-if="props.enableTable" v-model:open="tableDialogOpen">
          <DialogTrigger as-child>
            <Button variant="ghost" size="sm" @click.stop.prevent="tableDialogOpen = true">
              <TableIcon class="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Buat Tabel</DialogTitle>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="table-rows" class="text-right">Baris</Label>
                <Input id="table-rows" v-model.number="tableRows" type="number" min="1" max="20" class="col-span-3" />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="table-cols" class="text-right">Kolom</Label>
                <Input id="table-cols" v-model.number="tableCols" type="number" min="1" max="10" class="col-span-3" />
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <Button variant="outline" @click="tableDialogOpen = false">Batal</Button>
              <Button @click="insertTable">Buat Tabel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Editor -->
    <div
      class="focus-within:ring-ring/50 border-ring/50 focus-within:border-ring bg-background dark:bg-background rounded-lg border transition-colors focus-within:ring-[3px]"
      :class="{
        '!ring-destructive/20 dark:!ring-destructive/40 !border-destructive': errorMessage,
        'opacity-50': props.disabled,
      }"
    >
      <EditorContent :editor="editor" />
    </div>

    <!-- Description -->
    <p v-if="props.description" :id="`${props.name}-description`" class="text-muted-foreground text-sm">
      {{ props.description }}
    </p>

    <!-- Counter -->
    <div v-if="props.maxLength" class="flex items-center justify-between text-sm">
      <span class="text-muted-foreground">
        {{ editor?.storage.characterCount?.characters() || 0 }}/{{ props.maxLength }}
      </span>
      <span
        v-if="props.maxLength && (editor?.storage.characterCount?.characters() || 0) > props.maxLength * 0.9"
        class="text-warning"
      >
        Mendekati batas maksimal
      </span>
    </div>

    <!-- Error -->
    <p v-if="errorMessage" class="text-destructive text-sm">{{ errorMessage }}</p>

    <!-- Hidden File Input -->
    <input
      v-if="props.enableImageUpload"
      ref="imageInputRef"
      type="file"
      accept="image/*"
      :id="props.name"
      class="hidden"
      @change="onImageSelect"
    />
  </div>
</template>

<style>
.ProseMirror {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #adb5bd;
  pointer-events: none;
  height: 0;
  float: left;
  width: 100%;
}

/* Improve focus styles */
.ProseMirror:focus {
  outline: none;
}

/* Better table styles */
.ProseMirror table {
  border-collapse: collapse;
  margin: 0;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;
}

.ProseMirror table td,
.ProseMirror table th {
  border: 2px solid #ced4da;
  box-sizing: border-box;
  min-width: 1em;
  padding: 3px 5px;
  position: relative;
  vertical-align: top;
}

.ProseMirror table th {
  font-weight: bold;
  text-align: left;
  background-color: #f1f3f4;
}

/* Code block improvements */
.ProseMirror pre {
  background: #0d1117;
  color: #c9d1d9;
  font-family: "JetBrainsMono", "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.ProseMirror code {
  background-color: #f6f8fa;
  border-radius: 6px;
  font-size: 85%;
  margin: 0;
  padding: 0.2em 0.4em;
}

.ProseMirror blockquote {
  border-left: 3px solid #d0d7de;
  margin: 0;
  padding-left: 1rem;
}

/* Image styles with size variants */
.ProseMirror img {
  display: block;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  max-width: 100%;
  height: auto;
}

.ProseMirror img.max-w-xs {
  max-width: 20rem; /* 320px */
}

.ProseMirror img.max-w-md {
  max-width: 28rem; /* 448px */
}

.ProseMirror img.max-w-full {
  max-width: 100%;
}

/* Image container hover effects */
.ProseMirror .image-container {
  position: relative;
  display: inline-block;
}

.ProseMirror .image-container:hover .image-controls {
  opacity: 1;
}

/* Table container styles */
.ProseMirror .table-container {
  position: relative;
  display: block;
  margin: 1rem 0;
}

/* Enhanced table styles */
.ProseMirror .table-container table {
  border-collapse: collapse;
  margin: 0;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;
  min-width: 200px;
  background: white;
}

.dark .ProseMirror .table-container table {
  background: #1f2937;
}

.ProseMirror .table-container table td,
.ProseMirror .table-container table th {
  border: 2px solid #e5e7eb;
  box-sizing: border-box;
  min-width: 1em;
  padding: 8px 12px;
  position: relative;
  vertical-align: top;
  word-wrap: break-word;
}

.dark .ProseMirror .table-container table td,
.dark .ProseMirror .table-container table th {
  border: 2px solid #374151;
}

.ProseMirror .table-container table th {
  font-weight: bold;
  text-align: left;
  background-color: #f9fafb;
}

.dark .ProseMirror .table-container table th {
  background-color: #374151;
}

.ProseMirror .table-container table .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.1);
  pointer-events: none;
}

/* Table hover controls */
.ProseMirror .table-container:hover .table-controls {
  opacity: 1;
}
</style>
