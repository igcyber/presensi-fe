# 📝 Dokumentasi Form Components

## 🎯 Overview

Sistem form components ini dibangun untuk memberikan konsistensi, maintainability, dan scalability dalam pengembangan form di aplikasi portal. Setiap component dirancang dengan prinsip-prinsip berikut:

- **Konsistensi**: Semua form components menggunakan pola yang sama untuk props, events, dan styling
- **Maintainability**: Kode yang mudah dipahami dan dimodifikasi dengan struktur yang jelas
- **Scalability**: Mudah untuk menambah component baru atau memperluas fungsionalitas existing
- **Accessibility**: Mendukung a11y standards dengan proper ARIA attributes dan keyboard navigation
- **Type Safety**: Full TypeScript support dengan interface yang jelas

### 🏗️ Arsitektur

Sistem ini menggunakan:

- **VeeValidate** untuk form validation dan state management
- **Zod** untuk schema validation
- **Reka UI** components sebagai base UI primitives
- **Vue 3 Composition API** dengan `<script setup>`

---

## 📦 Components

### BaseForm.vue

#### 📖 Description

Component wrapper yang menyediakan konteks form untuk semua form fields. Mengintegrasikan VeeValidate dengan Zod schema untuk validasi yang type-safe.

#### ⚡ Usage Example

```vue
<script setup lang="ts">
import { z } from "zod";

import { BaseForm, BaseInput, BaseSelect } from "@/components/forms";

const userSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  role: z.string().min(1, "Role wajib dipilih"),
});

const initialValues = {
  name: "",
  email: "",
  role: "",
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

    <button type="submit" class="btn-primary">Simpan</button>
  </BaseForm>
</template>
```

#### 🛠 Best Practices

- **Schema Definition**: Selalu definisikan Zod schema yang sesuai dengan struktur data
- **Initial Values**: Berikan initial values yang sesuai dengan schema untuk menghindari hydration mismatch
- **Error Handling**: Implementasikan proper error handling di `onSubmit` function
- **Loading States**: Tambahkan loading state untuk UX yang lebih baik
- **Type Safety**: Gunakan `z.infer<typeof schema>` untuk type inference

#### 🔗 Integration Notes

- **VeeValidate**: Otomatis terintegrasi dengan `toTypedSchema()`
- **Zod**: Schema validation berjalan real-time
- **Form State**: Akses form state melalui `useFormContext()` di child components

---

### BaseInput.vue

#### 📖 Description

Component input text yang terintegrasi dengan form validation. Mendukung berbagai tipe input dan validasi real-time.

#### ⚡ Usage Example

```vue
<script setup lang="ts">
import { BaseInput } from "@/components/forms";
</script>

<template>
  <!-- Input text biasa -->
  <BaseInput name="username" label="Username" placeholder="Masukkan username" required />

  <!-- Input email -->
  <BaseInput name="email" label="Email" type="email" placeholder="user@example.com" required />

  <!-- Input password -->
  <BaseInput name="password" label="Password" type="password" required />

  <!-- Input number -->
  <BaseInput name="age" label="Umur" type="number" placeholder="25" />
</template>
```

#### 🛠 Best Practices

- **Validation**: Gunakan `validate-on-blur` untuk UX yang lebih baik
- **Accessibility**: Label otomatis terhubung dengan input melalui `for` attribute
- **Required Fields**: Gunakan prop `required` untuk menampilkan asterisk merah
- **Placeholders**: Berikan placeholder yang informatif
- **Type Safety**: Gunakan tipe input yang sesuai (email, password, number, dll)

#### 🔗 Integration Notes

- **VeeValidate**: Otomatis terintegrasi dengan form context
- **Validation**: Error messages ditampilkan otomatis
- **Form State**: Menggunakan `isFieldDirty` untuk optimasi validasi

---

### BaseSelect.vue

#### 📖 Description

Component select dropdown yang mendukung single dan multiple selection. Dilengkapi dengan konversi tipe data dan validasi.

#### ⚡ Usage Example

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

#### 🛠 Best Practices

- **Options Structure**: Gunakan struktur `{ label, value, disabled? }` untuk options
- **Multiple Selection**: Gunakan `multiple` prop untuk multi-select
- **Type Conversion**: Gunakan `valueAsNumber` untuk konversi string ke number
- **Disabled Options**: Gunakan `disabled` property pada option untuk disable item tertentu
- **Placeholder**: Berikan placeholder yang jelas

#### 🔗 Integration Notes

- **Reka UI**: Menggunakan Select components dari Reka UI
- **Type Safety**: Mendukung konversi tipe data otomatis
- **Multiple Values**: Handle array values untuk multiple selection
- **Accessibility**: Proper ARIA attributes dan keyboard navigation

---

### BaseCheckbox.vue

#### 📖 Description

Component checkbox yang terintegrasi dengan form validation. Ideal untuk boolean values dan agreement checkboxes.

#### ⚡ Usage Example

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

#### 🛠 Best Practices

- **Boolean Values**: Ideal untuk true/false values
- **Required Checkboxes**: Gunakan untuk agreement/consent
- **Label Clarity**: Berikan label yang jelas dan informatif
- **Accessibility**: Checkbox otomatis terhubung dengan label
- **Visual Feedback**: Error state ditampilkan dengan jelas

#### 🔗 Integration Notes

- **VeeValidate**: Terintegrasi dengan form validation
- **Boolean Handling**: Otomatis handle boolean values
- **Error Display**: Error messages ditampilkan di bawah label

---

### BaseTextarea.vue

#### 📖 Description

Component textarea yang mendukung auto-resize, character counter, dan validasi. Ideal untuk input teks panjang.

#### ⚡ Usage Example

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

#### 🛠 Best Practices

- **Auto-resize**: Gunakan untuk konten yang panjang
- **Character Counter**: Tampilkan counter untuk input dengan batas karakter
- **Rows**: Set jumlah rows awal yang sesuai
- **Maxlength**: Gunakan untuk membatasi panjang input
- **Placeholder**: Berikan placeholder yang informatif

#### 🔗 Integration Notes

- **Auto-resize**: Implementasi custom untuk dynamic height
- **Character Counter**: Real-time counter dengan maxlength
- **Validation**: Terintegrasi dengan VeeValidate
- **Accessibility**: Proper label association dan ARIA attributes

---

## 🚀 Getting Started

### 1. Import Components

```typescript
import { BaseCheckbox, BaseForm, BaseInput, BaseSelect, BaseTextarea } from "@/components/forms";
```

### 2. Define Schema

```typescript
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  role: z.string().min(1, "Role wajib dipilih"),
  isActive: z.boolean(),
  description: z.string().optional(),
});
```

### 3. Create Form

```vue
<template>
  <BaseForm :schema="formSchema" :initial-values="initialValues" @submit="handleSubmit">
    <BaseInput name="name" label="Nama" required />
    <BaseInput name="email" label="Email" type="email" required />
    <BaseSelect name="role" label="Role" :options="roleOptions" required />
    <BaseCheckbox name="isActive" label="Aktif" />
    <BaseTextarea name="description" label="Deskripsi" />

    <button type="submit">Submit</button>
  </BaseForm>
</template>
```

## 🔧 Advanced Usage

### Custom Validation

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

### Dynamic Options

```vue
<script setup lang="ts">
import { computed, ref } from "vue";

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

## 🎨 Styling & Theming

Semua components menggunakan Tailwind CSS classes dan mengikuti design system yang konsisten:

- **Colors**: Menggunakan semantic color tokens
- **Spacing**: Konsisten dengan spacing scale
- **Typography**: Mengikuti typography hierarchy
- **States**: Proper hover, focus, dan error states

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

## 📚 Extending the System

### Adding New Components

1. **Create Component**: Buat component baru di folder `forms/`
2. **Define Interface**: Buat TypeScript interface untuk props
3. **Implement Logic**: Implementasikan logic dengan VeeValidate integration
4. **Add to Index**: Export component di `index.ts`
5. **Update Documentation**: Tambahkan dokumentasi di file ini

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
        <span v-if="props.required" class="text-red-500">*</span>
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

1. **Follow Patterns**: Ikuti pola yang sudah ada di components lain
2. **Type Safety**: Pastikan semua props memiliki TypeScript types
3. **Accessibility**: Implementasikan proper a11y attributes
4. **Testing**: Tambahkan unit tests untuk component baru
5. **Documentation**: Update dokumentasi ini untuk component baru

## 📋 Checklist untuk Component Baru

- [ ] Component dibuat dengan TypeScript interface
- [ ] Terintegrasi dengan VeeValidate
- [ ] Mendukung accessibility (ARIA attributes)
- [ ] Error handling dan validation
- [ ] Unit tests ditambahkan
- [ ] Dokumentasi diupdate
- [ ] Export ditambahkan di index.ts
- [ ] Styling konsisten dengan design system

---

_Dokumentasi ini akan terus diupdate seiring dengan penambahan component baru. Untuk pertanyaan atau saran, silakan buat issue di repository._
