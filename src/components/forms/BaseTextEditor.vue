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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const lowlight = createLowlight();

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
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

// register field ke vee-validate
const { value, errorMessage } = useField<string>(props.name);

const imageInputRef = ref<HTMLInputElement>();

// init editor
const editor = useEditor({
  content: value.value || "",
  extensions: [
    StarterKit.configure({ codeBlock: false, underline: false, strike: false }),
    Underline,
    Strike,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    ...(props.enableImageUpload ? [Image] : []),
    ...(props.enableTable ? [Table, TableRow, TableHeader, TableCell] : []),
    ...(props.enableCodeBlock ? [CodeBlockLowlight.configure({ lowlight })] : []),
    ...(props.maxLength ? [CharacterCount.configure({ limit: props.maxLength })] : []),
  ],
  editorProps: {
    attributes: {
      class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-4 min-h-[200px] focus:outline-none",
      "data-placeholder": props.placeholder,
    },
  },
  onUpdate: ({ editor }) => {
    value.value = editor.getHTML(); // sync ke vee-validate
  },
});

// sync external value → editor
watch(
  () => value.value,
  (newVal) => {
    if (newVal !== editor.value?.getHTML()) {
      editor.value?.commands.setContent(newVal || "");
    }
  },
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

// toolbar states
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

// toolbar actions
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
const insertTable = () => editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

// image upload
const handleImageUpload = () => requestAnimationFrame(() => imageInputRef.value?.click());
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
    reader.onload = (e) =>
      editor.value
        ?.chain()
        .focus()
        .setImage({ src: e.target?.result as string })
        .run();
    reader.readAsDataURL(file);
  }
};
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
      v-if="props.showToolbar"
      class="bg-muted/50 dark:bg-muted/20 border-ring/50 flex flex-wrap items-center gap-1 rounded-lg border p-2"
    >
      <Button
        variant="ghost"
        size="sm"
        :class="{ 'bg-muted dark:bg-muted/60': isBold }"
        @click.stop.prevent="toggleBold"
        ><Bold class="h-4 w-4"
      /></Button>
      <Button
        variant="ghost"
        size="sm"
        :class="{ 'bg-muted dark:bg-muted/60': isItalic }"
        @click.stop.prevent="toggleItalic"
        ><Italic class="h-4 w-4"
      /></Button>
      <Button
        variant="ghost"
        size="sm"
        :class="{ 'bg-muted dark:bg-muted/60': isUnderline }"
        @click.stop.prevent="toggleUnderline"
        ><UnderlineIcon class="h-4 w-4"
      /></Button>
      <Button
        variant="ghost"
        size="sm"
        :class="{ 'bg-muted dark:bg-muted/60': isStrike }"
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
          :class="{ 'bg-muted dark:bg-muted/60': currentAlignment === 'left' }"
          @click.stop.prevent="setTextAlign('left')"
          ><AlignLeft class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="sm"
          :class="{ 'bg-muted dark:bg-muted/60': currentAlignment === 'center' }"
          @click.stop.prevent="setTextAlign('center')"
          ><AlignCenter class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="sm"
          :class="{ 'bg-muted dark:bg-muted/60': currentAlignment === 'right' }"
          @click.stop.prevent="setTextAlign('right')"
          ><AlignRight class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="sm"
          :class="{ 'bg-muted dark:bg-muted/60': currentAlignment === 'justify' }"
          @click.stop.prevent="setTextAlign('justify')"
          ><AlignJustify class="h-4 w-4"
        /></Button>
      </div>

      <Separator orientation="vertical" class="hidden h-6 sm:block" />

      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          :class="{ 'bg-muted dark:bg-muted/60': isBulletList }"
          @click.stop.prevent="toggleBulletList"
          ><List class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="sm"
          :class="{ 'bg-muted dark:bg-muted/60': isOrderedList }"
          @click.stop.prevent="toggleOrderedList"
          ><ListOrdered class="h-4 w-4"
        /></Button>
      </div>

      <Separator orientation="vertical" class="hidden h-6 sm:block" />

      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          :class="{ 'bg-muted dark:bg-muted/60': isBlockquote }"
          @click.stop.prevent="toggleBlockquote"
          ><Quote class="h-4 w-4"
        /></Button>
        <Button
          v-if="props.enableCodeBlock"
          variant="ghost"
          size="sm"
          :class="{ 'bg-muted dark:bg-muted/60': isCodeBlock }"
          @click.stop.prevent="toggleCodeBlock"
          ><Code class="h-4 w-4"
        /></Button>
      </div>

      <Separator orientation="vertical" class="hidden h-6 sm:block" />

      <div class="flex items-center gap-1">
        <Button v-if="props.enableImageUpload" variant="ghost" size="sm" @click.stop.prevent="handleImageUpload"
          ><ImageIcon class="h-4 w-4"
        /></Button>
        <Button v-if="props.enableTable" variant="ghost" size="sm" @click.stop.prevent="insertTable"
          ><TableIcon class="h-4 w-4"
        /></Button>
      </div>
    </div>

    <!-- Editor -->
    <div
      class="focus-within:ring-ring/50 border-ring/50 focus-within:border-ring bg-background dark:bg-background rounded-lg border transition-colors focus-within:ring-[3px]"
      :class="{ '!ring-destructive/20 dark:!ring-destructive/40 !border-destructive': errorMessage }"
    >
      <EditorContent :editor="editor" :aria-label="props.label" />
    </div>

    <!-- Counter -->
    <div v-if="props.maxLength" class="text-muted-foreground text-left text-sm">
      {{ editor?.storage.characterCount?.characters() || 0 }}/{{ props.maxLength }}
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
  min-height: 200px;
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
