<script setup lang="ts">
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
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const lowlight = createLowlight();

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  modelValue?: string;
  maxLength?: number;
  showToolbar?: boolean;
  enableImageUpload?: boolean;
  enableTable?: boolean;
  enableCodeBlock?: boolean;
  imageUploadHandler?: (file: File) => Promise<string>;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Mulai menulis...",
  showToolbar: true,
  enableImageUpload: true,
  enableTable: true,
  enableCodeBlock: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:json": [value: any];
}>();

// Editor instance
const editor = useEditor({
  content: props.modelValue || "",
  extensions: [
    StarterKit.configure({
      codeBlock: false, // We'll use CodeBlockLowlight instead
      underline: false, // We'll add Underline separately
      strike: false, // We'll add Strike separately
    }),
    Underline,
    Strike,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    ...(props.enableImageUpload
      ? [
          Image.configure({
            HTMLAttributes: {
              class: "max-w-full h-auto rounded-lg",
            },
          }),
        ]
      : []),
    ...(props.enableTable
      ? [
          Table.configure({
            resizable: true,
          }),
          TableRow,
          TableHeader,
          TableCell,
        ]
      : []),
    ...(props.enableCodeBlock
      ? [
          CodeBlockLowlight.configure({
            lowlight,
          }),
        ]
      : []),
  ],
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    const json = editor.getJSON();
    emit("update:modelValue", html);
    emit("update:json", json);
  },
  editorProps: {
    attributes: {
      class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
    },
  },
});

// Toolbar actions
const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run();
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run();

const setHeading = (level: 1 | 2 | 3) => {
  editor.value?.chain().focus().toggleHeading({ level }).run();
};

const setTextAlign = (alignment: "left" | "center" | "right" | "justify") => {
  editor.value?.chain().focus().setTextAlign(alignment).run();
};

const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run();
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run();
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run();
const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run();

// Image upload
const imageInputRef = ref<HTMLInputElement>();
const handleImageUpload = () => {
  imageInputRef.value?.click();
};

const onImageSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (props.imageUploadHandler) {
    try {
      const url = await props.imageUploadHandler(file);
      editor.value?.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  } else {
    // Fallback to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      editor.value?.chain().focus().setImage({ src: result }).run();
    };
    reader.readAsDataURL(file);
  }
};

// Table operations
const insertTable = () => {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
};

// Table operations (available for future use)
// const addColumnBefore = () => editor.value?.chain().focus().addColumnBefore().run();
// const addColumnAfter = () => editor.value?.chain().focus().addColumnAfter().run();
// const deleteColumn = () => editor.value?.chain().focus().deleteColumn().run();
// const addRowBefore = () => editor.value?.chain().focus().addRowBefore().run();
// const addRowAfter = () => editor.value?.chain().focus().addRowAfter().run();
// const deleteRow = () => editor.value?.chain().focus().deleteRow().run();
// const deleteTable = () => editor.value?.chain().focus().deleteTable().run();

// Computed properties for toolbar state
const isBold = computed(() => editor.value?.isActive("bold"));
const isItalic = computed(() => editor.value?.isActive("italic"));
const isUnderline = computed(() => editor.value?.isActive("underline"));
const isStrike = computed(() => editor.value?.isActive("strike"));
const isBulletList = computed(() => editor.value?.isActive("bulletList"));
const isOrderedList = computed(() => editor.value?.isActive("orderedList"));
const isBlockquote = computed(() => editor.value?.isActive("blockquote"));
const isCodeBlock = computed(() => editor.value?.isActive("codeBlock"));

const currentAlignment = computed(() => {
  if (editor.value?.isActive({ textAlign: "left" })) return "left";
  if (editor.value?.isActive({ textAlign: "center" })) return "center";
  if (editor.value?.isActive({ textAlign: "right" })) return "right";
  if (editor.value?.isActive({ textAlign: "justify" })) return "justify";
  return "left";
});

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== editor.value?.getHTML()) {
      editor.value?.commands.setContent(newValue || "");
    }
  },
);

// Cleanup
onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <FormField :name="props.name" v-slot="{}">
    <FormItem>
      <FormLabel :custom-for="props.name">
        {{ props.label }}
        <span v-if="props.required" class="text-red-500">*</span>
      </FormLabel>

      <FormControl>
        <div class="space-y-2">
          <!-- Toolbar -->
          <div v-if="props.showToolbar" class="flex flex-wrap items-center gap-1 rounded-lg border bg-gray-50 p-2">
            <!-- Text Formatting -->
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isBold }"
                @click="toggleBold"
                :aria-label="'Bold'"
              >
                <Bold class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isItalic }"
                @click="toggleItalic"
                :aria-label="'Italic'"
              >
                <Italic class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isUnderline }"
                @click="toggleUnderline"
                :aria-label="'Underline'"
              >
                <UnderlineIcon class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isStrike }"
                @click="toggleStrike"
                :aria-label="'Strikethrough'"
              >
                <Strikethrough class="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" class="h-6" />

            <!-- Headings -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="sm" :aria-label="'Headings'">
                  <Heading1 class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="setHeading(1)">
                  <Heading1 class="mr-2 h-4 w-4" />
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem @click="setHeading(2)">
                  <Heading2 class="mr-2 h-4 w-4" />
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem @click="setHeading(3)">
                  <Heading3 class="mr-2 h-4 w-4" />
                  Heading 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" class="h-6" />

            <!-- Text Alignment -->
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': currentAlignment === 'left' }"
                @click="setTextAlign('left')"
                :aria-label="'Align Left'"
              >
                <AlignLeft class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': currentAlignment === 'center' }"
                @click="setTextAlign('center')"
                :aria-label="'Align Center'"
              >
                <AlignCenter class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': currentAlignment === 'right' }"
                @click="setTextAlign('right')"
                :aria-label="'Align Right'"
              >
                <AlignRight class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': currentAlignment === 'justify' }"
                @click="setTextAlign('justify')"
                :aria-label="'Justify'"
              >
                <AlignJustify class="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" class="h-6" />

            <!-- Lists -->
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isBulletList }"
                @click="toggleBulletList"
                :aria-label="'Bullet List'"
              >
                <List class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isOrderedList }"
                @click="toggleOrderedList"
                :aria-label="'Numbered List'"
              >
                <ListOrdered class="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" class="h-6" />

            <!-- Block Elements -->
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isBlockquote }"
                @click="toggleBlockquote"
                :aria-label="'Quote'"
              >
                <Quote class="h-4 w-4" />
              </Button>
              <Button
                v-if="props.enableCodeBlock"
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isCodeBlock }"
                @click="toggleCodeBlock"
                :aria-label="'Code Block'"
              >
                <Code class="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" class="h-6" />

            <!-- Media & Tables -->
            <div class="flex items-center gap-1">
              <Button
                v-if="props.enableImageUpload"
                variant="ghost"
                size="sm"
                @click="handleImageUpload"
                :aria-label="'Insert Image'"
              >
                <ImageIcon class="h-4 w-4" />
              </Button>
              <Button
                v-if="props.enableTable"
                variant="ghost"
                size="sm"
                @click="insertTable"
                :aria-label="'Insert Table'"
              >
                <TableIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- Editor Content -->
          <div
            class="border-ring/50 focus-within:border-ring focus-within:ring-ring/50 min-h-[200px] rounded-lg border transition-colors focus-within:ring-[3px]"
          >
            <EditorContent :editor="editor" />
          </div>

          <!-- Character Counter -->
          <div v-if="props.maxLength" class="text-right text-sm text-gray-500">
            {{ editor?.storage.characterCount?.characters() || 0 }}/{{ props.maxLength }}
          </div>

          <!-- Hidden file input for image upload -->
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
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style>
/* Tiptap Editor Styles */
.ProseMirror {
  outline: none;
  padding: 1rem;
  min-height: 200px;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden;
}

.ProseMirror table td,
.ProseMirror table th {
  min-width: 1em;
  border: 1px solid #ced4da;
  padding: 3px 5px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

.ProseMirror table th {
  font-weight: bold;
  text-align: left;
  background-color: #f1f3f4;
}

.ProseMirror table .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}

.ProseMirror table .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: #adf;
  pointer-events: none;
}

.ProseMirror table p {
  margin: 0;
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.ProseMirror blockquote {
  border-left: 3px solid #ced4da;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

.ProseMirror code {
  background-color: #f1f3f4;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-family: "Courier New", monospace;
}

.ProseMirror pre {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

.ProseMirror pre code {
  background: none;
  padding: 0;
  border-radius: 0;
}
</style>
