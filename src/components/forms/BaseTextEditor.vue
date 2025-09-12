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

defineEmits<{
  "update:modelValue": [value: string];
  "update:json": [value: any];
}>();

// Refs
const imageInputRef = ref<HTMLInputElement>();

// Editor instance
const editor = useEditor({
  content: props.modelValue || "",
  extensions: [
    StarterKit.configure({
      codeBlock: false,
      underline: false,
      strike: false,
    }),
    Underline,
    Strike,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    ...(props.enableImageUpload
      ? [
          Image.configure({
            HTMLAttributes: { class: "max-w-full h-auto rounded-lg" },
          }),
        ]
      : []),
    ...(props.enableTable ? [Table.configure({ resizable: true }), TableRow, TableHeader, TableCell] : []),
    ...(props.enableCodeBlock ? [CodeBlockLowlight.configure({ lowlight })] : []),
  ],
  // onUpdate: ({ editor }) => {
  //   const html = editor.getHTML();
  //   const json = editor.getJSON();

  //   emit("update:modelValue", html);
  //   emit("update:json", json);
  // },
  editorProps: {
    attributes: {
      class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
    },
  },
});

// Computed state
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

// Table operations
const insertTable = () => {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
};

// Image upload
const handleImageUpload = () => {
  // pakai RAF supaya fokus tetap di editor
  requestAnimationFrame(() => {
    imageInputRef.value?.click();
  });
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
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      editor.value?.chain().focus().setImage({ src: result }).run();
    };
    reader.readAsDataURL(file);
  }
};

const handleKeyUp = (onChange: (value: string) => void) => {
  onChange(editor.value?.getHTML() || "");
};

// Watch for external v-model changes
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
  <FormField :name="props.name" v-slot="{ componentField, meta, errorMessage }">
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
              <Button variant="ghost" size="sm" :class="{ 'bg-gray-200': isBold }" @click.stop.prevent="toggleBold">
                <Bold class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" :class="{ 'bg-gray-200': isItalic }" @click.stop.prevent="toggleItalic">
                <Italic class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isUnderline }"
                @click.stop.prevent="toggleUnderline"
              >
                <UnderlineIcon class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" :class="{ 'bg-gray-200': isStrike }" @click.stop.prevent="toggleStrike">
                <Strikethrough class="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" class="h-6" />

            <!-- Headings -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="sm"><Heading1 class="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="setHeading(1)"><Heading1 class="mr-2 h-4 w-4" /> Heading 1</DropdownMenuItem>
                <DropdownMenuItem @click="setHeading(2)"><Heading2 class="mr-2 h-4 w-4" /> Heading 2</DropdownMenuItem>
                <DropdownMenuItem @click="setHeading(3)"><Heading3 class="mr-2 h-4 w-4" /> Heading 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" class="h-6" />

            <!-- Alignment -->
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': currentAlignment === 'left' }"
                @click.stop.prevent="setTextAlign('left')"
                ><AlignLeft class="h-4 w-4"
              /></Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': currentAlignment === 'center' }"
                @click.stop.prevent="setTextAlign('center')"
                ><AlignCenter class="h-4 w-4"
              /></Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': currentAlignment === 'right' }"
                @click.stop.prevent="setTextAlign('right')"
                ><AlignRight class="h-4 w-4"
              /></Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': currentAlignment === 'justify' }"
                @click.stop.prevent="setTextAlign('justify')"
                ><AlignJustify class="h-4 w-4"
              /></Button>
            </div>

            <Separator orientation="vertical" class="h-6" />

            <!-- Lists -->
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isBulletList }"
                @click.stop.prevent="toggleBulletList"
                ><List class="h-4 w-4"
              /></Button>
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isOrderedList }"
                @click.stop.prevent="toggleOrderedList"
                ><ListOrdered class="h-4 w-4"
              /></Button>
            </div>

            <Separator orientation="vertical" class="h-6" />

            <!-- Block -->
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isBlockquote }"
                @click.stop.prevent="toggleBlockquote"
                ><Quote class="h-4 w-4"
              /></Button>
              <Button
                v-if="props.enableCodeBlock"
                variant="ghost"
                size="sm"
                :class="{ 'bg-gray-200': isCodeBlock }"
                @click.stop.prevent="toggleCodeBlock"
                ><Code class="h-4 w-4"
              /></Button>
            </div>

            <Separator orientation="vertical" class="h-6" />

            <!-- Media -->
            <div class="flex items-center gap-1">
              <Button v-if="props.enableImageUpload" variant="ghost" size="sm" @click.stop.prevent="handleImageUpload">
                <ImageIcon class="h-4 w-4" />
              </Button>
              <Button v-if="props.enableTable" variant="ghost" size="sm" @click.stop.prevent="insertTable">
                <TableIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- Editor -->
          <div
            class="border-ring/50 focus-within:border-ring focus-within:ring-ring/50 min-h-[200px] rounded-lg border transition-colors focus-within:ring-[3px]"
            :class="{
              '!border-destructive !ring-destructive/20 dark:!ring-destructive/40':
                meta.valid === false && errorMessage,
            }"
          >
            <EditorContent
              :editor="editor"
              :aria-label="props.label"
              @keyup="() => handleKeyUp(componentField.onChange)"
            />
          </div>

          <!-- Counter -->
          <div v-if="props.maxLength" class="text-right text-sm text-gray-500">
            {{ editor?.storage.characterCount?.characters() || 0 }}/{{ props.maxLength }}
          </div>

          <!-- Hidden File Input -->
          <input
            v-if="props.enableImageUpload"
            ref="imageInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            tabindex="-1"
            aria-hidden="true"
            @change="onImageSelect"
          />
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style>
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
}
.ProseMirror table td,
.ProseMirror table th {
  min-width: 1em;
  border: 1px solid #ced4da;
  padding: 3px 5px;
  vertical-align: top;
  position: relative;
}
.ProseMirror table th {
  font-weight: bold;
  background-color: #f1f3f4;
}
.ProseMirror table .selectedCell:after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}
.ProseMirror img {
  max-width: 100%;
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
</style>
