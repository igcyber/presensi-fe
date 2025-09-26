# 📝 Shadcn Vue Form Components Documentation

## 🎯 Overview

Sistem form components ini dibangun di atas **Shadcn Vue** primitives untuk memberikan konsistensi, reusability, dan integrasi yang seamless dengan ekosistem Shadcn UI. Setiap component dirancang sebagai wrapper yang mengabstraksi kompleksitas form handling sambil mempertahankan fleksibilitas Shadcn.

### 🏗️ Mengapa Base Components di atas Shadcn Primitives?

#### ✅ **Benefits:**

- **Consistency**: Semua form components menggunakan pola yang sama untuk props, events, dan styling
- **Reusability**: Component yang dapat digunakan kembali di seluruh aplikasi dengan konfigurasi minimal
- **Shadcn Styling**: Mempertahankan design system Shadcn yang konsisten dan modern
- **Validation Integration**: Integrasi seamless dengan VeeValidate + Zod untuk type-safe validation
- **Accessibility**: Built-in a11y support dari Shadcn primitives
- **Developer Experience**: API yang sederhana namun powerful untuk developer

#### 🔧 **Arsitektur:**

```
Base Components (Our Layer)
    ↓
Shadcn Vue Primitives (FormField, FormItem, FormLabel, FormMessage)
    ↓
VeeValidate + Zod (Validation Layer)
    ↓
Reka UI (Base UI Components)
```

### 🛠️ **Teknologi Stack:**

- **Vue 3** dengan Composition API dan `<script setup>`
- **TypeScript** untuk type safety
- **Shadcn Vue** untuk UI primitives dan styling
- **VeeValidate** untuk form validation dan state management
- **Zod** untuk schema validation
- **Lucide Vue Next** untuk icons
- **Tailwind CSS** untuk utility classes

---

## 📦 Components

## BaseForm.vue

### 📖 Description

Component wrapper yang menyediakan konteks form untuk semua form fields. Mengintegrasikan VeeValidate dengan Zod schema dan Shadcn Form primitives untuk validasi yang type-safe dan UI yang konsisten.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { z } from "zod";

import { BaseForm, BaseInput, BaseInputFile, BaseSelect } from "@/components/forms";

const userSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  role: z.string().min(1, "Role wajib dipilih"),
  avatar: z.instanceof(File).optional(),
});

const initialValues = {
  name: "",
  email: "",
  role: "",
  avatar: undefined,
};

async function handleSubmit(values: z.infer<typeof userSchema>) {
  console.log("Form data:", values);
  // Kirim ke API
}
</script>

<template>
  <BaseForm :schema="userSchema" :initial-values="initialValues" @submit="handleSubmit">
    <BaseInput name="name" label="Nama Lengkap" required />
    <BaseInput name="email" label="Email" type="email" required />
    <BaseSelect name="role" label="Role" :options="roleOptions" required />
    <BaseInputFile name="avatar" label="Foto Profil" accept="image/*" />

    <Button type="submit" class="w-full">Simpan</Button>
  </BaseForm>
</template>
```

### 🛠 Best Practices

- **Schema Definition**: Selalu definisikan Zod schema yang sesuai dengan struktur data
- **Initial Values**: Berikan initial values yang sesuai dengan schema untuk menghindari hydration mismatch
- **Error Handling**: Implementasikan proper error handling di `onSubmit` function
- **Loading States**: Tambahkan loading state untuk UX yang lebih baik
- **Type Safety**: Gunakan `z.infer<typeof schema>` untuk type inference

### 🔗 Integration Notes

- **Shadcn Form**: Menggunakan `Form` component dari Shadcn sebagai wrapper
- **VeeValidate**: Otomatis terintegrasi dengan `toTypedSchema()`
- **Zod**: Schema validation berjalan real-time
- **Form Context**: Akses form state melalui `useFormContext()` di child components

---

## BaseInput.vue

### 📖 Description

Component input text yang terintegrasi dengan Shadcn FormField system. Mendukung berbagai tipe input, validasi real-time, dan fitur toggle show/hide untuk password fields menggunakan Lucide icons.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { BaseInput } from "@/components/forms";
</script>

<template>
  <!-- Input text biasa -->
  <BaseInput name="username" label="Username" placeholder="Masukkan username" required />

  <!-- Input email -->
  <BaseInput name="email" label="Email" type="email" placeholder="user@example.com" required />

  <!-- Input password dengan toggle show/hide -->
  <BaseInput name="password" label="Password" type="password" required />

  <!-- Input number -->
  <BaseInput name="age" label="Umur" type="number" placeholder="25" />
</template>
```

### 🛠 Best Practices

- **Validation**: Gunakan `validate-on-blur` untuk UX yang lebih baik
- **Accessibility**: Label otomatis terhubung dengan input melalui Shadcn FormLabel
- **Required Fields**: Gunakan prop `required` untuk menampilkan asterisk merah
- **Placeholders**: Berikan placeholder yang informatif
- **Type Safety**: Gunakan tipe input yang sesuai (email, password, number, dll)
- **Password Toggle**: Toggle show/hide otomatis muncul untuk `type="password"`
- **Icon Accessibility**: Icon toggle memiliki proper ARIA labels untuk screen readers
- **Lucide Icons**: Menggunakan Eye dan EyeOff icons dari Lucide untuk konsistensi

### 🔗 Integration Notes

- **Shadcn FormField**: Terintegrasi dengan FormField, FormItem, FormLabel, FormMessage
- **VeeValidate**: Otomatis terintegrasi dengan form context
- **Validation**: Error messages ditampilkan otomatis melalui FormMessage
- **Form State**: Menggunakan `isFieldDirty` untuk optimasi validasi
- **Password Toggle**: Menggunakan computed property untuk dynamic input type
- **Icon System**: Menggunakan Lucide icons untuk konsistensi visual dan performa

---

## BaseInputFile.vue

### 📖 Description

Component file input yang mendukung drag & drop, built-in image preview, dan validasi file. Terintegrasi dengan Shadcn FormField system untuk konsistensi UI dan validation handling.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { BaseInputFile } from "@/components/forms";

const fileSchema = z.object({
  avatar: z.instanceof(File).optional(),
  documents: z.array(z.instanceof(File)).optional(),
});
</script>

<template>
  <!-- Single image upload dengan preview -->
  <BaseInputFile
    name="avatar"
    label="Foto Profil"
    accept="image/*"
    :max-size="5"
    :show-preview="true"
    preview-type="image"
  />

  <!-- Multiple file upload -->
  <BaseInputFile
    name="documents"
    label="Dokumen"
    :multiple="true"
    accept=".pdf,.doc,.docx"
    :max-size="10"
    preview-type="file"
  />

  <!-- Drag & drop dengan custom styling -->
  <BaseInputFile
    name="gallery"
    label="Galeri Foto"
    accept="image/*"
    :multiple="true"
    :max-size="2"
    preview-type="image"
  />
</template>
```

### 🛠 Best Practices

- **File Validation**: Selalu validasi tipe file dan ukuran maksimal
- **User Feedback**: Berikan feedback yang jelas untuk drag & drop states
- **Preview Functionality**: Gunakan preview untuk meningkatkan UX
- **Error Handling**: Handle error untuk file yang tidak valid
- **Accessibility**: Pastikan drag & drop area accessible dengan keyboard
- **File Size Limits**: Set batas ukuran file yang reasonable
- **Accept Types**: Gunakan accept prop untuk membatasi tipe file

### 🔗 Integration Notes

- **Shadcn FormField**: Terintegrasi dengan FormField system untuk validation
- **Drag & Drop**: Native HTML5 drag & drop API dengan visual feedback
- **File Preview**: Built-in preview untuk images dan file metadata
- **Validation**: File size dan type validation dengan error messages
- **Lucide Icons**: Menggunakan Upload, X, dan ImageIcon untuk UI consistency

---

## BaseSelect.vue

### 📖 Description

Component select dropdown yang mendukung single dan multiple selection, pencarian lokal, dan pencarian server-side (AJAX). Terintegrasi dengan Shadcn Select primitives dan mendukung konversi tipe data, validasi yang comprehensive, serta UX yang smooth dengan loading states dan debounced search.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { BaseSelect, type SelectOption } from "@/components/forms";

import { userService } from "@/lib/api";

const roleOptions = [
  { label: "Administrator", value: "admin" },
  { label: "User", value: "user" },
  { label: "Moderator", value: "moderator" },
];

const categoryOptions = [
  { label: "Teknologi", value: 1 },
  { label: "Bisnis", value: 2 },
  { label: "Pendidikan", value: 3 },
];

const productOptions = [
  { label: "Laptop Dell XPS 13", value: "dell-xps-13" },
  { label: "MacBook Pro M3", value: "macbook-pro-m3" },
  { label: "ThinkPad X1 Carbon", value: "thinkpad-x1" },
  { label: "Surface Laptop Studio", value: "surface-studio" },
];

// Server-side search function
const searchUsers = async (query: string): Promise<SelectOption[]> => {
  try {
    const response = await userService.search({
      q: query,
      limit: 20,
    });

    return response.data.map((user) => ({
      label: `${user.name} (${user.email})`,
      value: user.id,
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
</script>

<template>
  <!-- Single select -->
  <BaseSelect name="role" label="Role" :options="roleOptions" placeholder="Pilih role" required />

  <!-- Multiple select -->
  <BaseSelect
    name="categories"
    label="Kategori"
    :options="categoryOptions"
    :multiple="true"
    placeholder="Pilih kategori"
  />

  <!-- Select dengan value as number -->
  <BaseSelect name="categoryId" label="Kategori" :options="categoryOptions" :value-as-number="true" required />

  <!-- Searchable select (pencarian lokal) -->
  <BaseSelect
    name="product"
    label="Produk"
    :options="productOptions"
    searchable
    search-placeholder="Cari produk..."
    placeholder="Pilih produk..."
  />

  <!-- Remote search select (pencarian server-side) -->
  <BaseSelect
    name="user"
    label="Pilih User"
    :options="[]"
    remote
    searchable
    :on-search="searchUsers"
    search-placeholder="Ketik nama user..."
    loading-text="Mencari user..."
    empty-text="User tidak ditemukan"
    :min-search-length="2"
  />

  <!-- Multiple searchable select -->
  <BaseSelect
    name="tags"
    label="Tag"
    :options="tagOptions"
    multiple
    searchable
    search-placeholder="Cari tag..."
    placeholder="Pilih tag..."
  />
</template>
```

### 🛠 Best Practices

#### **Basic Usage**

- **Options Structure**: Gunakan struktur `{ label, value, disabled?, group? }` untuk options
- **Multiple Selection**: Gunakan `multiple` prop untuk multi-select
- **Type Conversion**: Gunakan `valueAsNumber` untuk konversi string ke number
- **Disabled Options**: Gunakan `disabled` property pada option untuk disable item tertentu
- **Placeholder**: Berikan placeholder yang jelas dan informatif
- **Accessibility**: Select otomatis terhubung dengan label melalui Shadcn FormLabel

#### **Search Features**

- **Local Search**: Gunakan `searchable` untuk pencarian data statis
- **Remote Search**: Gunakan `remote` + `onSearch` untuk pencarian server-side
- **Search Optimization**: Set `minSearchLength` yang sesuai untuk remote search (minimal 2-3 karakter)
- **Debouncing**: Built-in debouncing 300ms untuk optimasi performa API calls
- **Error Handling**: Selalu handle error dalam `onSearch` callback
- **UX Feedback**: Customize `loadingText` dan `emptyText` sesuai konteks aplikasi

#### **Performance & UX**

- **Loading States**: Tampilkan loading indicator saat fetch data remote
- **Empty States**: Berikan feedback yang jelas saat tidak ada data
- **Auto Focus**: Search input otomatis focus saat dropdown dibuka
- **Keyboard Navigation**: Support ESC untuk clear search
- **Memory Management**: Search query dan remote data otomatis clear saat dropdown ditutup

### 🔗 Integration Notes

#### **UI Components**

- **Shadcn Select**: Menggunakan Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
- **Shadcn Button**: Untuk clear search button dengan proper styling
- **Lucide Icons**: Search, Loader2, X icons untuk UI consistency
- **Reka UI**: Base Select components dari Reka UI

#### **Functionality**

- **Type Safety**: Mendukung konversi tipe data otomatis dengan TypeScript
- **Multiple Values**: Handle array values untuk multiple selection
- **VueUse Integration**: useDebounceFn untuk debounced search
- **Vue 3 Features**: Composition API, computed, ref, watch, nextTick

#### **Search Implementation**

- **Local Filtering**: Client-side filtering berdasarkan label option
- **Remote Search**: Server-side search dengan Promise-based callback
- **Debounced Requests**: 300ms delay untuk optimasi API calls
- **Loading States**: Built-in loading dan empty states dengan proper UX
- **Error Handling**: Graceful error handling untuk failed API requests

#### **Accessibility & UX**

- **ARIA Support**: Proper ARIA attributes dan keyboard navigation dari Shadcn
- **Focus Management**: Auto-focus search input saat dropdown dibuka
- **Keyboard Support**: ESC key untuk clear search
- **Screen Reader**: Compatible dengan screen readers
- **Visual Feedback**: Loading spinner dan empty state messages

### 📋 Props

#### **Basic Props**

| Prop            | Type             | Default           | Description                    |
| --------------- | ---------------- | ----------------- | ------------------------------ |
| `name`          | `string`         | -                 | Field name untuk form binding  |
| `label`         | `string`         | -                 | Label yang ditampilkan         |
| `options`       | `SelectOption[]` | -                 | Array options untuk select     |
| `placeholder`   | `string`         | `"Pilih opsi..."` | Placeholder text               |
| `disabled`      | `boolean`        | `false`           | Disable select                 |
| `required`      | `boolean`        | `false`           | Required field dengan asterisk |
| `multiple`      | `boolean`        | `false`           | Multiple selection             |
| `valueAsNumber` | `boolean`        | `false`           | Konversi value ke number       |
| `emptyOption`   | `string`         | -                 | Empty option text              |
| `description`   | `string`         | -                 | Help text di bawah select      |

#### **Search Props**

| Prop                | Type                                         | Default            | Description                        |
| ------------------- | -------------------------------------------- | ------------------ | ---------------------------------- |
| `searchable`        | `boolean`                                    | `false`            | Enable pencarian lokal             |
| `remote`            | `boolean`                                    | `false`            | Enable pencarian server-side       |
| `onSearch`          | `(query: string) => Promise<SelectOption[]>` | -                  | Callback untuk remote search       |
| `searchPlaceholder` | `string`                                     | `"Cari..."`        | Placeholder untuk search input     |
| `loadingText`       | `string`                                     | `"Memuat..."`      | Text saat loading                  |
| `emptyText`         | `string`                                     | `"Tidak ada data"` | Text saat tidak ada data           |
| `minSearchLength`   | `number`                                     | `1`                | Minimum length untuk remote search |

#### **SelectOption Interface**

```typescript
interface SelectOption {
  label: string; // Text yang ditampilkan
  value: string | number; // Value untuk form
  disabled?: boolean; // Disable option
  group?: string; // Group name untuk grouped options
}
```

---

## BaseTextarea.vue

### 📖 Description

Component textarea yang mendukung auto-resize, character counter, dan validasi. Terintegrasi dengan Shadcn FormField system dan ideal untuk input teks panjang dengan UX yang optimal.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { BaseTextarea } from "@/components/forms";
</script>

<template>
  <!-- Textarea biasa -->
  <BaseTextarea name="description" label="Deskripsi" placeholder="Masukkan deskripsi..." :rows="4" />

  <!-- Textarea dengan auto-resize -->
  <BaseTextarea name="content" label="Konten" :auto-resize="true" placeholder="Tulis konten di sini..." />

  <!-- Textarea dengan character counter -->
  <BaseTextarea
    name="bio"
    label="Biografi"
    :maxlength="500"
    :show-counter="true"
    placeholder="Ceritakan tentang diri Anda..."
  />

  <!-- Textarea required -->
  <BaseTextarea name="feedback" label="Feedback" placeholder="Berikan feedback Anda..." required />
</template>
```

### 🛠 Best Practices

- **Auto-resize**: Gunakan untuk konten yang panjang dan dinamis
- **Character Counter**: Tampilkan counter untuk input dengan batas karakter
- **Rows**: Set jumlah rows awal yang sesuai dengan konten expected
- **Maxlength**: Gunakan untuk membatasi panjang input
- **Placeholder**: Berikan placeholder yang informatif dan helpful
- **Validation**: Integrasikan dengan Zod schema untuk validation rules

### 🔗 Integration Notes

- **Shadcn FormField**: Terintegrasi dengan FormField, FormItem, FormLabel, FormMessage
- **Auto-resize**: Implementasi custom untuk dynamic height adjustment
- **Character Counter**: Real-time counter dengan maxlength validation
- **Validation**: Terintegrasi dengan VeeValidate untuk error handling
- **Accessibility**: Proper label association dan ARIA attributes dari Shadcn

---

## BaseCheckbox.vue

### 📖 Description

Component checkbox yang terintegrasi dengan Shadcn FormField system. Ideal untuk boolean values, agreement checkboxes, dan form consent dengan styling yang konsisten.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { BaseCheckbox } from "@/components/forms";
</script>

<template>
  <!-- Checkbox boolean -->
  <BaseCheckbox name="isActive" label="Akun Aktif" />

  <!-- Checkbox required -->
  <BaseCheckbox name="agreeTerms" label="Saya menyetujui syarat dan ketentuan" required />

  <!-- Checkbox disabled -->
  <BaseCheckbox name="isPremium" label="Premium User" disabled />
</template>
```

### 🛠 Best Practices

- **Boolean Values**: Ideal untuk true/false values dan form state
- **Required Checkboxes**: Gunakan untuk agreement/consent forms
- **Label Clarity**: Berikan label yang jelas dan informatif
- **Accessibility**: Checkbox otomatis terhubung dengan label melalui Shadcn FormLabel
- **Visual Feedback**: Error state ditampilkan dengan jelas melalui FormMessage
- **Consent Forms**: Perfect untuk terms & conditions dan privacy policy

### 🔗 Integration Notes

- **Shadcn Checkbox**: Menggunakan Checkbox component dari Shadcn UI
- **VeeValidate**: Terintegrasi dengan form validation system
- **Boolean Handling**: Otomatis handle boolean values dengan proper binding
- **Error Display**: Error messages ditampilkan melalui Shadcn FormMessage
- **Accessibility**: Built-in accessibility features dari Shadcn primitives

---

## BaseTextEditor.vue

### 📖 Description

Component rich text editor yang terintegrasi dengan Shadcn FormField system. Mendukung formatting lengkap, image upload, table editing, dan berbagai fitur advanced dengan toolbar yang customizable dan accessible. Dibangun di atas Tiptap dengan integrasi Shadcn Vue untuk memberikan pengalaman editing yang powerful dan konsisten.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { z } from "zod";

import { BaseForm, BaseTextEditor, BaseTextEditorEcho } from "@/components/forms";

const articleSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
});

const initialValues = {
  title: "",
  content: "",
};

// Image upload handler
const handleImageUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.url;
};

async function handleSubmit(values: z.infer<typeof articleSchema>) {
  console.log("Article data:", values);
  // Kirim ke API
}
</script>

<template>
  <BaseForm :schema="articleSchema" :initial-values="initialValues" @submit="handleSubmit">
    <BaseInput name="title" label="Judul Artikel" required />

    <BaseTextEditor
      name="content"
      label="Konten Artikel"
      placeholder="Mulai menulis artikel Anda..."
      :max-length="5000"
      :enable-image-upload="true"
      :enable-table="true"
      :enable-code-block="true"
      :image-upload-handler="handleImageUpload"
      required
    />

    <Button type="submit" class="w-full">Publish Artikel</Button>
  </BaseForm>
</template>
```

### 🛠 Best Practices

#### **Validation & Performance**

- **Schema Validation**: Gunakan Zod schema untuk validasi konten
- **Character Limits**: Set `maxLength` untuk mencegah konten yang terlalu panjang
- **Image Optimization**: Implementasikan image compression sebelum upload
- **Lazy Loading**: Gunakan lazy loading untuk editor yang tidak langsung terlihat
- **Debounced Updates**: Implementasikan debouncing untuk auto-save functionality

#### **File Upload Handling**

- **Server Upload**: Selalu gunakan server upload untuk production
- **File Validation**: Validasi tipe file dan ukuran sebelum upload
- **Error Handling**: Handle upload errors dengan proper user feedback
- **Progress Indicators**: Tampilkan progress untuk upload yang lama
- **Fallback**: Sediakan fallback ke base64 untuk development

#### **Accessibility (a11y)**

- **Keyboard Navigation**: Semua toolbar buttons accessible dengan keyboard
- **ARIA Labels**: Proper ARIA labels untuk screen readers
- **Focus Management**: Focus management yang baik untuk editor
- **Screen Reader Support**: Konten editor readable oleh screen readers
- **High Contrast**: Support untuk high contrast mode

#### **Styling & UX**

- **Responsive Design**: Toolbar responsive untuk mobile devices
- **Consistent Styling**: Menggunakan Shadcn design system
- **Visual Feedback**: Clear visual feedback untuk active states
- **Loading States**: Loading indicators untuk async operations
- **Error States**: Clear error messages dan recovery options

### 🔗 Integration Notes

#### **Shadcn FormField Integration**

- **FormField**: Terintegrasi dengan FormField, FormItem, FormLabel, FormMessage
- **Validation**: Error messages ditampilkan melalui FormMessage
- **Form Context**: Menggunakan VeeValidate form context untuk validation

#### **Tiptap Extensions**

- **StarterKit**: Basic formatting (bold, italic, lists, etc.)
- **Image**: Image insertion dengan upload support
- **Table**: Table creation dan editing dengan resizable columns
- **TextAlign**: Text alignment (left, center, right, justify)
- **Underline/Strike**: Additional text formatting
- **CodeBlock**: Code blocks dengan syntax highlighting

#### **Custom Extensions**

```typescript
// Menambah custom extension
import { Extension } from "@tiptap/core";

const CustomExtension = Extension.create({
  name: "customExtension",
  addCommands() {
    return {
      customCommand:
        () =>
        ({ commands }) => {
          // Custom command logic
        },
    };
  },
});

// Gunakan di editor
const editor = useEditor({
  extensions: [
    StarterKit,
    CustomExtension,
    // ... other extensions
  ],
});
```

---

## BaseTextEditorEcho.vue

### 📖 Description

Component rich text editor yang dibangun di atas Echo Editor dengan lazy loading untuk performa optimal. Menggunakan defineAsyncComponent untuk memuat editor secara asynchronous, memberikan pengalaman yang smooth saat membuka dialog atau form. Terintegrasi dengan Shadcn FormField system dan mendukung semua fitur advanced Echo Editor termasuk image upload, table editing, dan berbagai formatting options.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { z } from "zod";

import { BaseForm, BaseTextEditorEcho } from "@/components/forms";

const articleSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
});

const initialValues = {
  title: "",
  content: "",
};

async function handleSubmit(values: z.infer<typeof articleSchema>) {
  console.log("Article data:", values);
  // Kirim ke API
}
</script>

<template>
  <BaseForm :schema="articleSchema" :initial-values="initialValues" @submit="handleSubmit">
    <BaseInput name="title" label="Judul Artikel" required />

    <!-- Basic Echo Editor -->
    <BaseTextEditorEcho name="content" label="Konten Artikel" placeholder="Mulai menulis artikel Anda..." required />

    <!-- Echo Editor dengan custom upload URL -->
    <BaseTextEditorEcho
      name="description"
      label="Deskripsi"
      placeholder="Tulis deskripsi singkat..."
      :upload-url="`${ENV_CONFIG.apiBaseUrl}/api/temporary`"
      description="Deskripsi akan ditampilkan di preview artikel"
    />

    <!-- Echo Editor tanpa toolbar -->
    <BaseTextEditorEcho
      name="summary"
      label="Ringkasan"
      placeholder="Tulis ringkasan..."
      :hide-toolbar="true"
      :max-length="500"
    />

    <!-- Echo Editor dengan locale Indonesia -->
    <BaseTextEditorEcho
      name="contentId"
      label="Konten Bahasa Indonesia"
      placeholder="Mulai menulis dalam bahasa Indonesia..."
      locale-custom="id"
    />

    <Button type="submit" class="w-full">Publish Artikel</Button>
  </BaseForm>
</template>
```

### 🛠 Best Practices

#### **Performance & Loading**

- **Lazy Loading**: Component menggunakan `defineAsyncComponent` untuk loading yang optimal
- **Suspense Fallback**: Menampilkan loading state yang user-friendly saat editor dimuat
- **Dialog Performance**: Ideal untuk digunakan dalam dialog karena tidak memperlambat opening time
- **Memory Management**: Editor hanya dimuat saat benar-benar diperlukan

#### **Validation & Error Handling**

- **Schema Validation**: Terintegrasi dengan Zod schema untuk validasi konten
- **Error Display**: Error messages ditampilkan melalui FormMessage dengan styling yang konsisten
- **Required Fields**: Proper handling untuk required fields dengan visual indicator

#### **File Upload Integration**

- **Custom Upload URL**: Support custom endpoint untuk image upload
- **Authentication**: Otomatis menggunakan Bearer token dari auth store
- **Error Handling**: Graceful handling untuk upload failures dengan fallback
- **Progress Feedback**: Built-in progress indication untuk upload process

#### **Accessibility & UX**

- **Loading State**: Clear loading indicator saat editor sedang dimuat
- **Keyboard Navigation**: Full keyboard support dari Echo Editor
- **Screen Reader**: Compatible dengan screen readers
- **Focus Management**: Proper focus handling dalam form context

### 🔗 Integration Notes

#### **Echo Editor Features**

- **Full Extensions**: Mendukung semua extensions Echo Editor (Bold, Italic, Lists, Tables, Images, dll)
- **Image Upload**: Built-in image upload dengan authentication
- **Table Support**: Advanced table editing capabilities
- **Code Blocks**: Syntax highlighting untuk code blocks
- **Slash Commands**: Quick formatting dengan slash commands

#### **Shadcn FormField Integration**

- **FormField**: Terintegrasi dengan FormField, FormItem, FormLabel, FormMessage
- **Validation**: Error messages ditampilkan melalui FormMessage
- **Form Context**: Menggunakan VeeValidate form context untuk validation
- **Styling**: Consistent styling dengan Shadcn design system

#### **Performance Optimizations**

- **Lazy Loading**: Editor dimuat secara asynchronous untuk performa optimal
- **Suspense**: Menggunakan Vue Suspense untuk loading states
- **Memoized Extensions**: Extensions di-memoize untuk menghindari re-creation
- **Optimized Bundle**: Reduced bundle size dengan selective imports

### 📋 Props

| Prop           | Type      | Default              | Description                       |
| -------------- | --------- | -------------------- | --------------------------------- |
| `name`         | `string`  | -                    | Field name untuk form binding     |
| `label`        | `string`  | -                    | Label yang ditampilkan            |
| `hideToolbar`  | `boolean` | `false`              | Sembunyikan toolbar editor        |
| `hideMenubar`  | `boolean` | `false`              | Sembunyikan menubar editor        |
| `required`     | `boolean` | `false`              | Required field dengan asterisk    |
| `disabled`     | `boolean` | `false`              | Disable editor                    |
| `uploadUrl`    | `string`  | -                    | Custom URL untuk image upload     |
| `description`  | `string`  | -                    | Help text di bawah editor         |
| `placeholder`  | `string`  | `"Mulai menulis..."` | Placeholder text untuk editor     |
| `localeCustom` | `string`  | `"en"`               | Locale untuk editor (en, id, dll) |
| `maxLength`    | `number`  | -                    | Maximum character limit           |

### 🚀 Advanced Usage

#### **Custom Upload Handler**

```vue
<script setup lang="ts">
import { ENV_CONFIG } from "@/lib/config/environment";

// Custom upload endpoint dengan authentication
const customUploadUrl = `${ENV_CONFIG.apiBaseUrl}/api/custom-upload`;
</script>

<template>
  <BaseTextEditorEcho
    name="content"
    label="Konten dengan Custom Upload"
    :upload-url="customUploadUrl"
    placeholder="Upload gambar akan menggunakan endpoint custom..."
  />
</template>
```

#### **Multilingual Support**

```vue
<template>
  <!-- Editor bahasa Indonesia -->
  <BaseTextEditorEcho
    name="contentId"
    label="Konten Bahasa Indonesia"
    locale-custom="id"
    placeholder="Tulis dalam bahasa Indonesia..."
  />

  <!-- Editor bahasa Inggris -->
  <BaseTextEditorEcho name="contentEn" label="English Content" locale-custom="en" placeholder="Write in English..." />
</template>
```

#### **Minimal Editor Configuration**

```vue
<template>
  <!-- Editor minimal untuk komentar -->
  <BaseTextEditorEcho
    name="comment"
    label="Komentar"
    :hide-toolbar="true"
    :hide-menubar="true"
    placeholder="Tulis komentar Anda..."
    description="Gunakan format text biasa untuk komentar"
  />
</template>
```

#### **Form Integration dengan Validation**

```vue
<script setup lang="ts">
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  excerpt: z.string().min(20, "Excerpt minimal 20 karakter"),
  content: z.string().min(100, "Konten minimal 100 karakter"),
  tags: z.string().optional(),
});

const initialValues = {
  title: "",
  excerpt: "",
  content: "",
  tags: "",
};
</script>

<template>
  <BaseForm :schema="blogSchema" :initial-values="initialValues" @submit="handleSubmit">
    <div class="space-y-6">
      <BaseInput name="title" label="Judul Blog" placeholder="Masukkan judul menarik..." required />

      <BaseTextEditorEcho
        name="excerpt"
        label="Excerpt"
        placeholder="Tulis ringkasan singkat untuk preview..."
        description="Excerpt akan ditampilkan di halaman daftar artikel"
        :hide-menubar="true"
        required
      />

      <BaseTextEditorEcho
        name="content"
        label="Konten Blog"
        placeholder="Tulis konten lengkap artikel Anda..."
        description="Gunakan toolbar untuk formatting teks, menambah gambar, dan tabel"
        required
      />

      <BaseInput name="tags" label="Tags" placeholder="tag1, tag2, tag3" />

      <div class="flex gap-4">
        <Button type="button" variant="outline" class="flex-1">Simpan Draft</Button>
        <Button type="submit" class="flex-1">Publish</Button>
      </div>
    </div>
  </BaseForm>
</template>
```

### 🎯 Comparison: BaseTextEditor vs BaseTextEditorEcho

| Feature                | BaseTextEditor | BaseTextEditorEcho |
| ---------------------- | -------------- | ------------------ |
| **Editor Engine**      | Tiptap         | Echo Editor        |
| **Loading Strategy**   | Synchronous    | Lazy Loading       |
| **Bundle Impact**      | Immediate      | Deferred           |
| **Dialog Performance** | Slower         | Faster             |
| **Extensions**         | Custom         | Built-in           |
| **Image Upload**       | Custom         | Built-in           |
| **Table Support**      | Basic          | Advanced           |
| **Slash Commands**     | No             | Yes                |
| **Code Highlighting**  | Yes            | Yes                |
| **Customization**      | High           | Medium             |
| **Maintenance**        | More           | Less               |

### 💡 When to Use Each

#### **Use BaseTextEditorEcho when:**

- ✅ Editor digunakan dalam dialog/modal
- ✅ Performa loading penting
- ✅ Butuh fitur advanced out-of-the-box
- ✅ Ingin maintenance yang minimal
- ✅ Slash commands diperlukan
- ✅ Advanced table editing diperlukan

#### **Use BaseTextEditor when:**

- ✅ Butuh customization yang sangat spesifik
- ✅ Editor selalu visible di halaman
- ✅ Perlu kontrol penuh atas extensions
- ✅ Custom node views diperlukan
- ✅ Integrasi dengan library lain

---

## 🚀 Getting Started

### 1. Import Components

```typescript
import {
  BaseCheckbox,
  BaseForm,
  BaseInput,
  BaseInputFile,
  BaseRadio,
  BaseSelect,
  BaseTextarea,
  BaseTextEditor,
  BaseTextEditorEcho,
} from "@/components/forms";
```

### 2. Define Schema dengan Zod

```typescript
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  role: z.string().min(1, "Role wajib dipilih"),
  gender: z.string().min(1, "Jenis kelamin wajib dipilih"),
  isActive: z.boolean(),
  description: z.string().optional(),
  content: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});
```

### 3. Create Form dengan Shadcn Integration

```vue
<template>
  <BaseForm :schema="formSchema" :initial-values="initialValues" @submit="handleSubmit">
    <BaseInput name="name" label="Nama" required />
    <BaseInput name="email" label="Email" type="email" required />
    <BaseSelect name="role" label="Role" :options="roleOptions" required />
    <BaseRadio name="gender" label="Jenis Kelamin" :options="genderOptions" required />
    <BaseInputFile name="avatar" label="Foto Profil" accept="image/*" />
    <BaseCheckbox name="isActive" label="Aktif" />
    <BaseTextarea name="description" label="Deskripsi" />
    <BaseTextEditor name="content" label="Konten Rich Text" />
    <BaseTextEditorEcho name="contentEcho" label="Konten dengan Echo Editor" />

    <Button type="submit" class="w-full">Submit</Button>
  </BaseForm>
</template>
```

## 🔧 Advanced Usage

### Custom Validation dengan Zod

```typescript
const customSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf kapital")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });
```

### Dynamic Options dengan Reactive Data

```vue
<script setup lang="ts">
import { computed, ref, watch } from "vue";

const selectedCountry = ref("");
const cities = ref([]);

const cityOptions = computed(() =>
  cities.value.map((city) => ({
    label: city.name,
    value: city.id,
  })),
);

// Load cities based on selected country
watch(selectedCountry, async (countryId) => {
  cities.value = await fetchCities(countryId);
});
</script>

<template>
  <BaseSelect name="country" label="Negara" :options="countryOptions" v-model="selectedCountry" />
  <BaseSelect name="city" label="Kota" :options="cityOptions" :disabled="!selectedCountry" />
</template>
```

### BaseSelect dengan Pencarian Lokal dan Remote

```vue
<script setup lang="ts">
import { ref } from "vue";

import { BaseSelect, type SelectOption } from "@/components/forms";

import { companyService, userService } from "@/lib/api";

// Data untuk pencarian lokal
const products = ref([
  { label: "Laptop Dell XPS 13", value: "dell-xps-13" },
  { label: "MacBook Pro M3", value: "macbook-pro-m3" },
  { label: "ThinkPad X1 Carbon", value: "thinkpad-x1" },
  { label: "Surface Laptop Studio", value: "surface-studio" },
  { label: "ASUS ZenBook Pro", value: "asus-zenbook" },
  { label: "HP Spectre x360", value: "hp-spectre" },
]);

// Grouped options dengan pencarian
const locations = ref([
  // Jakarta
  { label: "Jakarta Pusat", value: "jkt-pusat", group: "Jakarta" },
  { label: "Jakarta Selatan", value: "jkt-selatan", group: "Jakarta" },
  { label: "Jakarta Utara", value: "jkt-utara", group: "Jakarta" },

  // Bandung
  { label: "Bandung Kota", value: "bdg-kota", group: "Bandung" },
  { label: "Bandung Barat", value: "bdg-barat", group: "Bandung" },

  // Surabaya
  { label: "Surabaya Kota", value: "sby-kota", group: "Surabaya" },
  { label: "Surabaya Timur", value: "sby-timur", group: "Surabaya" },
]);

// Remote search untuk users dengan error handling
const searchUsers = async (query: string): Promise<SelectOption[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await userService.search({
      q: query,
      limit: 15,
      active: true,
    });

    return response.data.map((user) => ({
      label: `${user.name} (${user.email})`,
      value: user.id,
      disabled: !user.is_active,
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    // Bisa menampilkan toast error di sini
    return [];
  }
};

// Remote search untuk companies dengan caching
const companyCache = new Map();
const searchCompanies = async (query: string): Promise<SelectOption[]> => {
  if (!query || query.length < 3) {
    return [];
  }

  // Check cache first
  if (companyCache.has(query)) {
    return companyCache.get(query);
  }

  try {
    const response = await companyService.search({
      name: query,
      limit: 20,
      active: true,
    });

    const results = response.data.map((company) => ({
      label: `${company.name} - ${company.industry}`,
      value: company.id,
      disabled: !company.is_active,
    }));

    // Cache results for 5 minutes
    companyCache.set(query, results);
    setTimeout(() => companyCache.delete(query), 5 * 60 * 1000);

    return results;
  } catch (error) {
    console.error("Error searching companies:", error);
    return [];
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Pencarian lokal dengan produk -->
    <BaseSelect
      name="product"
      label="Produk Favorit"
      :options="products"
      searchable
      search-placeholder="Cari produk..."
      placeholder="Pilih produk favorit..."
    />

    <!-- Multiple selection dengan pencarian lokal -->
    <BaseSelect
      name="locations"
      label="Lokasi Kerja"
      :options="locations"
      multiple
      searchable
      search-placeholder="Cari lokasi..."
      placeholder="Pilih lokasi kerja..."
    />

    <!-- Remote search untuk users -->
    <BaseSelect
      name="assignedUser"
      label="Assign ke User"
      :options="[]"
      remote
      searchable
      :on-search="searchUsers"
      search-placeholder="Ketik nama atau email user..."
      loading-text="Mencari user..."
      empty-text="User tidak ditemukan"
      :min-search-length="2"
    />

    <!-- Remote search dengan caching untuk companies -->
    <BaseSelect
      name="company"
      label="Perusahaan"
      :options="[]"
      remote
      searchable
      :on-search="searchCompanies"
      search-placeholder="Ketik nama perusahaan..."
      loading-text="Mencari perusahaan..."
      empty-text="Perusahaan tidak ditemukan"
      :min-search-length="3"
    />

    <!-- Multiple remote search -->
    <BaseSelect
      name="collaborators"
      label="Kolaborator"
      :options="[]"
      multiple
      remote
      searchable
      :on-search="searchUsers"
      search-placeholder="Cari kolaborator..."
      loading-text="Mencari user..."
      empty-text="Tidak ada user yang ditemukan"
      :min-search-length="2"
    />
  </div>
</template>
```

### File Upload dengan Preview

```vue
<script setup lang="ts">
import { ref } from "vue";

const uploadedFiles = ref([]);

const handleFileUpload = (files) => {
  uploadedFiles.value = [...uploadedFiles.value, ...files];
};
</script>

<template>
  <BaseInputFile
    name="gallery"
    label="Galeri Foto"
    accept="image/*"
    :multiple="true"
    :show-preview="true"
    preview-type="image"
    @upload="handleFileUpload"
  />
</template>
```

### Rich Text Editor dengan Image Upload

```vue
<script setup lang="ts">
import { ENV_CONFIG } from "@/lib/config/environment";
</script>

<template>
  <!-- Echo Editor dengan built-in image upload -->
  <BaseTextEditorEcho
    name="content"
    label="Konten dengan Image Upload (Echo Editor)"
    placeholder="Tulis konten dan upload gambar dengan drag & drop..."
    :upload-url="`${ENV_CONFIG.apiBaseUrl}/api/temporary`"
    description="Drag & drop gambar langsung ke editor atau gunakan toolbar"
  />

  <!-- Tiptap Editor dengan custom image upload -->
  <BaseTextEditor
    name="contentTiptap"
    label="Konten dengan Custom Image Upload (Tiptap)"
    :image-upload-handler="handleImageUpload"
    :enable-image-upload="true"
    :enable-table="true"
    :enable-code-block="true"
  />
</template>
```

### Custom Image Upload Handler (Tiptap)

```vue
<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";

const uploadProgress = ref(0);

const handleImageUpload = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.url);
        toast.success("Image uploaded successfully");
      } else {
        reject(new Error("Upload failed"));
        toast.error("Failed to upload image");
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
      toast.error("Failed to upload image");
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
};
</script>

<template>
  <BaseTextEditor
    name="content"
    label="Konten dengan Custom Image Upload"
    :image-upload-handler="handleImageUpload"
    :enable-image-upload="true"
    :enable-table="true"
    :enable-code-block="true"
  />

  <!-- Progress indicator -->
  <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-2">
    <div class="h-2 w-full rounded-full bg-gray-200">
      <div
        class="h-2 rounded-full bg-blue-600 transition-all duration-300"
        :style="{ width: `${uploadProgress}%` }"
      ></div>
    </div>
    <p class="mt-1 text-sm text-gray-600">Uploading: {{ uploadProgress }}%</p>
  </div>
</template>
```

### Auto-save Rich Text Editor

```vue
<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";

const content = ref("");
const isSaving = ref(false);
const lastSaved = ref<Date | null>(null);

// Debounced auto-save function
const debouncedSave = useDebounceFn(async (content: string) => {
  if (!content.trim()) return;

  isSaving.value = true;
  try {
    await fetch("/api/auto-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    lastSaved.value = new Date();
  } catch (error) {
    console.error("Auto-save failed:", error);
  } finally {
    isSaving.value = false;
  }
}, 2000);

// Watch for content changes
watch(content, (newContent) => {
  debouncedSave(newContent);
});
</script>

<template>
  <div class="space-y-4">
    <!-- Echo Editor dengan auto-save -->
    <BaseTextEditorEcho
      name="content"
      label="Konten dengan Auto-save (Echo Editor)"
      v-model="content"
      placeholder="Konten akan otomatis tersimpan saat Anda mengetik..."
    />

    <!-- Tiptap Editor dengan auto-save -->
    <BaseTextEditor name="contentTiptap" label="Konten dengan Auto-save (Tiptap)" v-model="content" />

    <!-- Auto-save status -->
    <div class="text-muted-foreground flex items-center gap-2 text-sm">
      <div v-if="isSaving" class="flex items-center gap-1">
        <div class="border-primary h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span>Menyimpan...</span>
      </div>
      <div v-else-if="lastSaved" class="flex items-center gap-1">
        <div class="h-2 w-2 rounded-full bg-green-500"></div>
        <span>Terakhir disimpan: {{ lastSaved.toLocaleTimeString() }}</span>
      </div>
    </div>
  </div>
</template>
```

## 🎨 Styling & Theming

### Shadcn Integration

Semua components menggunakan Shadcn design system yang konsisten:

- **Colors**: Menggunakan semantic color tokens dari Shadcn
- **Spacing**: Konsisten dengan spacing scale Shadcn
- **Typography**: Mengikuti typography hierarchy Shadcn
- **States**: Proper hover, focus, dan error states dari Shadcn primitives
- **Dark Mode**: Otomatis support dark mode dari Shadcn

### Custom Styling

```vue
<template>
  <!-- Custom styling dengan Tailwind classes -->
  <BaseInput name="custom" label="Custom Input" class="border-2 border-blue-500" />

  <!-- Custom form layout -->
  <div class="grid grid-cols-2 gap-4">
    <BaseInput name="firstName" label="Nama Depan" />
    <BaseInput name="lastName" label="Nama Belakang" />
  </div>
</template>
```

### Custom Rich Text Editor Styling

```vue
<template>
  <BaseTextEditor name="content" label="Custom Styled Editor" class="custom-editor" />
</template>

<style>
.custom-editor .ProseMirror {
  @apply rounded-lg border-2 border-blue-200;
  @apply focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100;
}

.custom-editor .ProseMirror h1 {
  @apply mb-4 text-3xl font-bold text-gray-900;
}

.custom-editor .ProseMirror h2 {
  @apply mb-3 text-2xl font-semibold text-gray-800;
}

.custom-editor .ProseMirror h3 {
  @apply mb-2 text-xl font-medium text-gray-700;
}

.custom-editor .ProseMirror blockquote {
  @apply my-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-4;
}

.custom-editor .ProseMirror table {
  @apply overflow-hidden rounded-lg border border-gray-300;
}

.custom-editor .ProseMirror table th {
  @apply bg-gray-100 font-semibold text-gray-700;
}

.custom-editor .ProseMirror table td {
  @apply border-b border-gray-200;
}
</style>
```

### Dark Mode Rich Text Editor

```vue
<template>
  <BaseTextEditor name="content" label="Dark Mode Editor" class="dark-editor" />
</template>

<style>
.dark-editor .ProseMirror {
  @apply bg-gray-900 text-gray-100;
}

.dark-editor .ProseMirror h1,
.dark-editor .ProseMirror h2,
.dark-editor .ProseMirror h3 {
  @apply text-gray-100;
}

.dark-editor .ProseMirror blockquote {
  @apply border-gray-600 bg-gray-800;
}

.dark-editor .ProseMirror table {
  @apply border-gray-600;
}

.dark-editor .ProseMirror table th {
  @apply bg-gray-800 text-gray-200;
}

.dark-editor .ProseMirror table td {
  @apply border-gray-700;
}

.dark-editor .ProseMirror code {
  @apply bg-gray-800 text-gray-200;
}
</style>
```

## 🧪 Testing

### Unit Testing

```typescript
import { mount } from "@vue/test-utils";

import { BaseInput } from "@/components/forms";

test("renders input with label", () => {
  const wrapper = mount(BaseInput, {
    props: {
      name: "test",
      label: "Test Label",
    },
  });

  expect(wrapper.find("label").text()).toBe("Test Label");
});
```

### Integration Testing

```typescript
test("form validation works correctly", async () => {
  const wrapper = mount(BaseForm, {
    props: {
      schema: testSchema,
      initialValues: {},
      onSubmit: vi.fn(),
    },
  });

  await wrapper.find("input").setValue("");
  await wrapper.find("form").trigger("submit");

  expect(wrapper.find(".error-message").exists()).toBe(true);
});
```

### Rich Text Editor Testing

```typescript
import { mount } from "@vue/test-utils";

import { BaseTextEditor } from "@/components/forms";

test("renders text editor with toolbar", () => {
  const wrapper = mount(BaseTextEditor, {
    props: {
      name: "content",
      label: "Test Editor",
    },
  });

  expect(wrapper.find("label").text()).toBe("Test Editor");
  expect(wrapper.find(".toolbar").exists()).toBe(true);
});

test("handles image upload", async () => {
  const mockUploadHandler = vi.fn().mockResolvedValue("https://example.com/image.jpg");

  const wrapper = mount(BaseTextEditor, {
    props: {
      name: "content",
      label: "Test Editor",
      imageUploadHandler: mockUploadHandler,
    },
  });

  // Simulate file selection
  const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
  const input = wrapper.find('input[type="file"]');

  await input.setValue(file);

  expect(mockUploadHandler).toHaveBeenCalledWith(file);
});

test("form validation works with text editor", async () => {
  const wrapper = mount(BaseForm, {
    props: {
      schema: z.object({
        content: z.string().min(10, "Content too short"),
      }),
      initialValues: { content: "" },
      onSubmit: vi.fn(),
    },
    slots: {
      default: `
        <BaseTextEditor name="content" label="Content" />
        <button type="submit">Submit</button>
      `,
    },
  });

  // Submit empty form
  await wrapper.find("form").trigger("submit");

  expect(wrapper.find(".error-message").text()).toContain("Content too short");
});
```

## 📚 Extending the System

### Adding New Components

1. **Create Component**: Buat component baru di folder `forms/`
2. **Define Interface**: Buat TypeScript interface untuk props
3. **Implement Shadcn Integration**: Gunakan FormField, FormItem, FormLabel, FormMessage
4. **Add Validation**: Integrasikan dengan VeeValidate
5. **Add to Index**: Export component di `index.ts`
6. **Update Documentation**: Tambahkan dokumentasi di file ini

### Example: BaseRadio.vue

```vue
<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface Props {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField }">
    <FormItem>
      <FormLabel>
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <RadioGroup v-bind="componentField" class="flex flex-col space-y-2">
          <div v-for="option in props.options" :key="option.value" class="flex items-center space-x-2">
            <RadioGroupItem :value="option.value" :id="`${props.name}-${option.value}`" :disabled="option.disabled" />
            <label :for="`${props.name}-${option.value}`" class="text-sm font-medium">
              {{ option.label }}
            </label>
          </div>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
```

## BaseRadio.vue

### 📖 Description

Component radio button yang terintegrasi dengan Shadcn FormField system. Mendukung single selection dengan berbagai orientasi (horizontal/vertical), ukuran yang dapat disesuaikan, dan styling yang konsisten dengan design system Shadcn. Ideal untuk form yang memerlukan pilihan tunggal dari beberapa opsi.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { z } from "zod";

import { BaseForm, BaseRadio } from "@/components/forms";

const surveySchema = z.object({
  gender: z.string().min(1, "Jenis kelamin wajib dipilih"),
  ageGroup: z.string().min(1, "Kelompok umur wajib dipilih"),
  experience: z.string().min(1, "Pengalaman wajib dipilih"),
  satisfaction: z.string().min(1, "Tingkat kepuasan wajib dipilih"),
});

const initialValues = {
  gender: "",
  ageGroup: "",
  experience: "",
  satisfaction: "",
};

const genderOptions = [
  { label: "Laki-laki", value: "male" },
  { label: "Perempuan", value: "female" },
  { label: "Lainnya", value: "other" },
];

const ageGroupOptions = [
  { label: "18-25 tahun", value: "18-25" },
  { label: "26-35 tahun", value: "26-35" },
  { label: "36-45 tahun", value: "36-45" },
  { label: "46-55 tahun", value: "46-55" },
  { label: "55+ tahun", value: "55+" },
];

const experienceOptions = [
  { label: "Pemula (0-1 tahun)", value: "beginner" },
  { label: "Menengah (2-5 tahun)", value: "intermediate" },
  { label: "Lanjutan (6-10 tahun)", value: "advanced" },
  { label: "Expert (10+ tahun)", value: "expert" },
];

const satisfactionOptions = [
  { label: "Sangat Tidak Puas", value: "very_dissatisfied" },
  { label: "Tidak Puas", value: "dissatisfied" },
  { label: "Netral", value: "neutral" },
  { label: "Puas", value: "satisfied" },
  { label: "Sangat Puas", value: "very_satisfied" },
];

async function handleSubmit(values: z.infer<typeof surveySchema>) {
  console.log("Survey data:", values);
  // Kirim ke API
}
</script>

<template>
  <BaseForm :schema="surveySchema" :initial-values="initialValues" @submit="handleSubmit">
    <!-- Radio vertical (default) -->
    <BaseRadio
      name="gender"
      label="Jenis Kelamin"
      :options="genderOptions"
      required
      description="Pilih jenis kelamin Anda"
    />

    <!-- Radio horizontal -->
    <BaseRadio name="ageGroup" label="Kelompok Umur" :options="ageGroupOptions" orientation="horizontal" required />

    <!-- Radio dengan ukuran kecil -->
    <BaseRadio name="experience" label="Tingkat Pengalaman" :options="experienceOptions" size="sm" required />

    <!-- Radio dengan ukuran besar -->
    <BaseRadio
      name="satisfaction"
      label="Tingkat Kepuasan"
      :options="satisfactionOptions"
      size="lg"
      orientation="horizontal"
      required
    />

    <Button type="submit" class="w-full">Kirim Survey</Button>
  </BaseForm>
</template>
```

### 🛠 Best Practices

#### **Basic Usage**

- **Single Selection**: Radio buttons ideal untuk pilihan tunggal dari beberapa opsi
- **Clear Labels**: Berikan label yang jelas dan mudah dipahami
- **Logical Grouping**: Kelompokkan opsi yang terkait dalam satu radio group
- **Required Fields**: Gunakan prop `required` untuk field yang wajib diisi
- **Accessibility**: Radio buttons otomatis terhubung dengan label melalui Shadcn FormLabel

#### **Orientation & Layout**

- **Vertical Layout**: Default untuk opsi yang banyak atau label panjang
- **Horizontal Layout**: Ideal untuk opsi yang sedikit dan label pendek
- **Responsive Design**: Horizontal layout otomatis wrap pada mobile
- **Spacing**: Konsisten spacing antara opsi menggunakan Shadcn spacing scale

#### **Size & Styling**

- **Small Size**: Gunakan untuk form yang compact atau mobile
- **Default Size**: Ukuran standar untuk sebagian besar use case
- **Large Size**: Untuk form yang perlu emphasis atau accessibility tinggi
- **Consistent Styling**: Menggunakan Shadcn design system untuk konsistensi

#### **Accessibility & UX**

- **Keyboard Navigation**: Full keyboard support dengan arrow keys
- **Screen Reader**: Proper ARIA attributes untuk screen readers
- **Focus Management**: Clear focus indicators dari Shadcn
- **Disabled States**: Proper handling untuk disabled options
- **Error States**: Clear error indication dengan FormMessage

### 🔗 Integration Notes

#### **Shadcn FormField Integration**

- **FormField**: Terintegrasi dengan FormField, FormItem, FormLabel, FormMessage
- **Validation**: Error messages ditampilkan melalui FormMessage
- **Form Context**: Menggunakan VeeValidate form context untuk validation
- **Styling**: Consistent styling dengan Shadcn design system

#### **RadioGroup Implementation**

- **Shadcn RadioGroup**: Menggunakan RadioGroup dan RadioGroupItem dari Shadcn
- **Single Selection**: Built-in single selection behavior
- **Value Binding**: Proper value binding dengan form context
- **Event Handling**: Change events terintegrasi dengan VeeValidate

#### **Accessibility Features**

- **ARIA Support**: Proper ARIA attributes dari Shadcn primitives
- **Keyboard Navigation**: Arrow keys untuk navigasi antar opsi
- **Focus Management**: Clear focus indicators dan focus trapping
- **Screen Reader**: Compatible dengan screen readers
- **Label Association**: Proper label association untuk accessibility

### 📋 Props

#### **Basic Props**

| Prop          | Type                         | Default      | Description                       |
| ------------- | ---------------------------- | ------------ | --------------------------------- |
| `name`        | `string`                     | -            | Field name untuk form binding     |
| `label`       | `string`                     | -            | Label yang ditampilkan            |
| `options`     | `RadioOption[]`              | -            | Array options untuk radio buttons |
| `disabled`    | `boolean`                    | `false`      | Disable radio group               |
| `required`    | `boolean`                    | `false`      | Required field dengan asterisk    |
| `description` | `string`                     | -            | Help text di bawah radio group    |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Orientasi layout radio buttons    |
| `size`        | `"sm" \| "default" \| "lg"`  | `"default"`  | Ukuran radio buttons              |

#### **RadioOption Interface**

```typescript
interface RadioOption {
  label: string; // Text yang ditampilkan
  value: string | number; // Value untuk form
  disabled?: boolean; // Disable option tertentu
}
```

### 🚀 Advanced Usage

#### **Dynamic Options dengan Reactive Data**

```vue
<script setup lang="ts">
import { computed, ref, watch } from "vue";

const selectedCategory = ref("");
const subcategories = ref([]);

const subcategoryOptions = computed(() =>
  subcategories.value.map((sub) => ({
    label: sub.name,
    value: sub.id,
    disabled: !sub.is_active,
  })),
);

// Load subcategories based on selected category
watch(selectedCategory, async (categoryId) => {
  if (categoryId) {
    subcategories.value = await fetchSubcategories(categoryId);
  } else {
    subcategories.value = [];
  }
});
</script>

<template>
  <BaseRadio name="category" label="Kategori" :options="categoryOptions" v-model="selectedCategory" required />

  <BaseRadio
    name="subcategory"
    label="Subkategori"
    :options="subcategoryOptions"
    :disabled="!selectedCategory"
    required
  />
</template>
```

#### **Conditional Options dengan Computed Properties**

```vue
<script setup lang="ts">
import { computed } from "vue";

const userRole = ref("admin");
const isPremium = ref(true);

const permissionOptions = computed(() => {
  const baseOptions = [
    { label: "Read Only", value: "read" },
    { label: "Read & Write", value: "write" },
  ];

  if (userRole.value === "admin" || isPremium.value) {
    baseOptions.push({ label: "Full Access", value: "full" }, { label: "Admin Access", value: "admin" });
  }

  return baseOptions;
});

const themeOptions = computed(() => {
  const options = [
    { label: "Light Theme", value: "light" },
    { label: "Dark Theme", value: "dark" },
  ];

  if (isPremium.value) {
    options.push({ label: "Auto Theme", value: "auto" }, { label: "Custom Theme", value: "custom" });
  }

  return options;
});
</script>

<template>
  <BaseRadio name="permissions" label="Permission Level" :options="permissionOptions" required />

  <BaseRadio name="theme" label="Theme Preference" :options="themeOptions" orientation="horizontal" />
</template>
```

#### **Form dengan Multiple Radio Groups**

```vue
<script setup lang="ts">
import { z } from "zod";

const preferencesSchema = z.object({
  // Personal preferences
  gender: z.string().min(1, "Gender required"),
  ageGroup: z.string().min(1, "Age group required"),

  // Technical preferences
  experience: z.string().min(1, "Experience level required"),
  skillLevel: z.string().min(1, "Skill level required"),

  // UI preferences
  theme: z.string().min(1, "Theme required"),
  layout: z.string().min(1, "Layout required"),
});

const initialValues = {
  gender: "",
  ageGroup: "",
  experience: "",
  skillLevel: "",
  theme: "",
  layout: "",
};
</script>

<template>
  <BaseForm :schema="preferencesSchema" :initial-values="initialValues" @submit="handleSubmit">
    <div class="space-y-8">
      <!-- Personal Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Informasi Personal</h3>

        <BaseRadio name="gender" label="Jenis Kelamin" :options="genderOptions" required />

        <BaseRadio name="ageGroup" label="Kelompok Umur" :options="ageGroupOptions" orientation="horizontal" required />
      </div>

      <!-- Technical Skills -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Keahlian Teknis</h3>

        <BaseRadio name="experience" label="Tingkat Pengalaman" :options="experienceOptions" required />

        <BaseRadio name="skillLevel" label="Level Keahlian" :options="skillLevelOptions" size="sm" required />
      </div>

      <!-- UI Preferences -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Preferensi UI</h3>

        <BaseRadio name="theme" label="Tema Aplikasi" :options="themeOptions" orientation="horizontal" required />

        <BaseRadio name="layout" label="Layout Interface" :options="layoutOptions" size="lg" required />
      </div>
    </div>

    <Button type="submit" class="w-full">Simpan Preferensi</Button>
  </BaseForm>
</template>
```

#### **Survey Form dengan Conditional Logic**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";

const surveyData = ref({
  hasExperience: "",
  experienceLevel: "",
  preferredTools: "",
  satisfaction: "",
});

const experienceOptions = [
  { label: "Ya, saya berpengalaman", value: "yes" },
  { label: "Tidak, saya pemula", value: "no" },
];

const experienceLevelOptions = computed(() => {
  if (surveyData.value.hasExperience === "yes") {
    return [
      { label: "1-2 tahun", value: "1-2" },
      { label: "3-5 tahun", value: "3-5" },
      { label: "6-10 tahun", value: "6-10" },
      { label: "10+ tahun", value: "10+" },
    ];
  } else {
    return [
      { label: "Sangat pemula", value: "beginner" },
      { label: "Sedikit pengalaman", value: "some" },
    ];
  }
});

const toolOptions = computed(() => {
  if (surveyData.value.hasExperience === "yes") {
    return [
      { label: "Visual Studio Code", value: "vscode" },
      { label: "IntelliJ IDEA", value: "intellij" },
      { label: "Sublime Text", value: "sublime" },
      { label: "Vim/Neovim", value: "vim" },
    ];
  } else {
    return [
      { label: "Tidak tahu", value: "unknown" },
      { label: "Mau belajar", value: "learning" },
    ];
  }
});
</script>

<template>
  <BaseForm :schema="surveySchema" :initial-values="initialValues" @submit="handleSubmit">
    <!-- Conditional radio groups -->
    <BaseRadio
      name="hasExperience"
      label="Apakah Anda berpengalaman dengan programming?"
      :options="experienceOptions"
      v-model="surveyData.hasExperience"
      required
    />

    <BaseRadio
      v-if="surveyData.hasExperience"
      name="experienceLevel"
      label="Berapa lama pengalaman Anda?"
      :options="experienceLevelOptions"
      required
    />

    <BaseRadio
      name="preferredTools"
      label="Tool apa yang Anda gunakan?"
      :options="toolOptions"
      :disabled="!surveyData.hasExperience"
      required
    />

    <BaseRadio
      name="satisfaction"
      label="Seberapa puas Anda dengan tool tersebut?"
      :options="satisfactionOptions"
      orientation="horizontal"
      size="lg"
      required
    />
  </BaseForm>
</template>
```

#### **Accessibility Enhanced Radio Groups**

```vue
<template>
  <!-- Radio dengan enhanced accessibility -->
  <BaseRadio
    name="accessibility"
    label="Preferensi Aksesibilitas"
    :options="accessibilityOptions"
    description="Pilih preferensi aksesibilitas yang sesuai dengan kebutuhan Anda"
    required
  />

  <!-- Radio dengan custom ARIA labels -->
  <BaseRadio
    name="notification"
    label="Preferensi Notifikasi"
    :options="notificationOptions"
    orientation="horizontal"
    size="lg"
    required
  />
</template>

<script setup lang="ts">
const accessibilityOptions = [
  {
    label: "High Contrast Mode",
    value: "high_contrast",
    disabled: false,
  },
  {
    label: "Large Text",
    value: "large_text",
    disabled: false,
  },
  {
    label: "Screen Reader Support",
    value: "screen_reader",
    disabled: false,
  },
  {
    label: "Keyboard Navigation",
    value: "keyboard_nav",
    disabled: false,
  },
];

const notificationOptions = [
  { label: "Semua Notifikasi", value: "all" },
  { label: "Hanya Penting", value: "important" },
  { label: "Tidak Ada", value: "none" },
];
</script>
```

### 🎨 Styling & Theming

#### **Custom Radio Styling**

```vue
<template>
  <BaseRadio name="custom" label="Custom Styled Radio" :options="customOptions" class="custom-radio-group" />
</template>

<style>
.custom-radio-group .radio-group {
  @apply space-y-4;
}

.custom-radio-group .radio-group-item {
  @apply border-2 border-blue-200 transition-all duration-200;
}

.custom-radio-group .radio-group-item:checked {
  @apply border-blue-500 bg-blue-50;
}

.custom-radio-group .radio-group-item:focus {
  @apply ring-2 ring-blue-300 ring-offset-2;
}

.custom-radio-group label {
  @apply font-medium text-gray-700;
}

.custom-radio-group label:hover {
  @apply text-blue-600;
}
</style>
```

#### **Dark Mode Radio Groups**

```vue
<template>
  <BaseRadio name="darkMode" label="Dark Mode Preferences" :options="darkModeOptions" class="dark-radio-group" />
</template>

<style>
.dark-radio-group .radio-group-item {
  @apply dark:border-gray-600 dark:bg-gray-800;
}

.dark-radio-group .radio-group-item:checked {
  @apply dark:border-blue-400 dark:bg-blue-900;
}

.dark-radio-group label {
  @apply dark:text-gray-200;
}

.dark-radio-group label:hover {
  @apply dark:text-blue-300;
}
</style>
```

### 🧪 Testing

#### **Unit Testing**

```typescript
import { mount } from "@vue/test-utils";

import { BaseRadio } from "@/components/forms";

test("renders radio group with options", () => {
  const options = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ];

  const wrapper = mount(BaseRadio, {
    props: {
      name: "test",
      label: "Test Radio",
      options,
    },
  });

  expect(wrapper.find("label").text()).toBe("Test Radio");
  expect(wrapper.findAll("input[type='radio']")).toHaveLength(2);
});

test("handles orientation correctly", () => {
  const wrapper = mount(BaseRadio, {
    props: {
      name: "test",
      label: "Test Radio",
      options: [{ label: "Option 1", value: "1" }],
      orientation: "horizontal",
    },
  });

  expect(wrapper.find(".flex-row").exists()).toBe(true);
});

test("handles disabled state", () => {
  const wrapper = mount(BaseRadio, {
    props: {
      name: "test",
      label: "Test Radio",
      options: [{ label: "Option 1", value: "1", disabled: true }],
    },
  });

  expect(wrapper.find("input[disabled]").exists()).toBe(true);
});
```

#### **Integration Testing**

```typescript
test("form validation works with radio group", async () => {
  const wrapper = mount(BaseForm, {
    props: {
      schema: z.object({
        choice: z.string().min(1, "Choice required"),
      }),
      initialValues: { choice: "" },
      onSubmit: vi.fn(),
    },
    slots: {
      default: `
        <BaseRadio name="choice" label="Test Choice" :options="[{label: 'Option 1', value: '1'}]" required />
        <button type="submit">Submit</button>
      `,
    },
  });

  await wrapper.find("form").trigger("submit");

  expect(wrapper.find(".error-message").text()).toContain("Choice required");
});
```

## 🤝 Contributing

### Guidelines

1. **Follow Shadcn Patterns**: Ikuti pola yang sudah ada di Shadcn primitives
2. **Type Safety**: Pastikan semua props memiliki TypeScript types
3. **Accessibility**: Implementasikan proper a11y attributes dari Shadcn
4. **Testing**: Tambahkan unit tests untuk component baru
5. **Documentation**: Update dokumentasi ini untuk component baru

### Checklist untuk Component Baru

- [ ] Component dibuat dengan TypeScript interface
- [ ] Terintegrasi dengan Shadcn FormField system
- [ ] Mendukung accessibility (ARIA attributes dari Shadcn)
- [ ] Error handling dan validation dengan VeeValidate
- [ ] Unit tests ditambahkan
- [ ] Dokumentasi diupdate
- [ ] Export ditambahkan di index.ts
- [ ] Styling konsisten dengan Shadcn design system

## 🔗 Resources

- [Shadcn Vue Documentation](https://www.shadcn-vue.com/)
- [VeeValidate Documentation](https://vee-validate.logaretm.com/v4/)
- [Zod Documentation](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tiptap Documentation](https://tiptap.dev/)
- [Lowlight Documentation](https://github.com/wooorm/lowlight)

---

_Dokumentasi ini akan terus diupdate seiring dengan penambahan component baru. Untuk pertanyaan atau saran, silakan buat issue di repository._
