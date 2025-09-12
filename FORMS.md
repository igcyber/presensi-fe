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

Component select dropdown yang mendukung single dan multiple selection. Terintegrasi dengan Shadcn Select primitives dan mendukung konversi tipe data serta validasi yang comprehensive.

### ⚡ Usage Example

```vue
<script setup lang="ts">
import { BaseSelect } from "@/components/forms";

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
</template>
```

### 🛠 Best Practices

- **Options Structure**: Gunakan struktur `{ label, value, disabled? }` untuk options
- **Multiple Selection**: Gunakan `multiple` prop untuk multi-select
- **Type Conversion**: Gunakan `valueAsNumber` untuk konversi string ke number
- **Disabled Options**: Gunakan `disabled` property pada option untuk disable item tertentu
- **Placeholder**: Berikan placeholder yang jelas dan informatif
- **Accessibility**: Select otomatis terhubung dengan label melalui Shadcn FormLabel

### 🔗 Integration Notes

- **Shadcn Select**: Menggunakan Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
- **Reka UI**: Base Select components dari Reka UI
- **Type Safety**: Mendukung konversi tipe data otomatis
- **Multiple Values**: Handle array values untuk multiple selection
- **Accessibility**: Proper ARIA attributes dan keyboard navigation dari Shadcn

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

import { BaseForm, BaseTextEditor } from "@/components/forms";

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

## 🚀 Getting Started

### 1. Import Components

```typescript
import {
  BaseCheckbox,
  BaseForm,
  BaseInput,
  BaseInputFile,
  BaseSelect,
  BaseTextarea,
  BaseTextEditor,
} from "@/components/forms";
```

### 2. Define Schema dengan Zod

```typescript
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  role: z.string().min(1, "Role wajib dipilih"),
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
    <BaseInputFile name="avatar" label="Foto Profil" accept="image/*" />
    <BaseCheckbox name="isActive" label="Aktif" />
    <BaseTextarea name="description" label="Deskripsi" />
    <BaseTextEditor name="content" label="Konten Rich Text" />

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
    label="Konten dengan Image Upload"
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
import { debounce, ref, watch } from "vue";

const content = ref("");
const isSaving = ref(false);
const lastSaved = ref<Date | null>(null);

// Debounced auto-save
const debouncedSave = debounce(async (content: string) => {
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
    <BaseTextEditor name="content" label="Konten dengan Auto-save" v-model="content" />

    <!-- Auto-save status -->
    <div class="flex items-center gap-2 text-sm text-gray-600">
      <div v-if="isSaving" class="flex items-center gap-1">
        <div class="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
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
