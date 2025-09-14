# 🏗️ Portal Pemerintah - Dokumentasi Arsitektur

## 📋 Gambaran Umum

Portal Pemerintah adalah aplikasi web modern yang dibangun dengan Vue 3 dan TypeScript untuk menyediakan informasi dan layanan publik. Aplikasi ini menggunakan arsitektur yang terstruktur dengan pemisahan yang jelas antara komponen UI, logika bisnis, dan manajemen state.

### 🛠️ Teknologi Utama

- **Vue 3** - Framework frontend dengan Composition API
- **TypeScript** - Type safety dan developer experience
- **Pinia** - State management yang modern
- **Vue Router** - Routing dan navigasi
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool yang cepat
- **Reka UI** - Komponen UI yang dapat diakses

---

## 📁 Struktur Folder

```
src/
├── __tests__/          # Unit tests dan testing utilities
├── assets/             # Static assets (images, fonts, icons)
├── components/         # Komponen Vue yang dapat digunakan kembali
├── composables/        # Composition API functions
├── examples/           # Contoh penggunaan komponen
├── layouts/            # Layout templates untuk halaman
├── lib/                # Library dan utilities
├── pages/              # Halaman aplikasi (route components)
├── router/             # Konfigurasi Vue Router
├── schemas/            # Zod validation schemas
├── stores/             # Pinia stores untuk state management
├── styles/             # Global CSS dan styling
├── App.vue             # Root component
└── main.ts             # Entry point aplikasi
```

---

## 📁 `__tests__/` - Testing

**Tujuan**: Menyimpan unit tests dan testing utilities untuk memastikan kualitas kode.

**Isi**:

- Unit tests untuk komponen Vue
- Integration tests
- Testing utilities dan helpers

**Best Practices**:

- Gunakan `@vue/test-utils` untuk testing komponen Vue
- Test coverage minimal 80%
- Test critical business logic dan user interactions

**Contoh**:

```typescript
// __tests__/components/Button.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Button from "@/components/ui/button/Button.vue";

describe("Button Component", () => {
  it("renders correctly", () => {
    const wrapper = mount(Button, {
      props: { variant: "primary" },
      slots: { default: "Click me" },
    });
    expect(wrapper.text()).toBe("Click me");
  });
});
```

---

## 📁 `assets/` - Static Assets

**Tujuan**: Menyimpan file statis seperti gambar, font, dan ikon yang digunakan di seluruh aplikasi.

**Isi**:

- Images (logos, backgrounds, placeholders)
- Fonts (custom fonts, icon fonts)
- Icons (SVG icons, favicons)
- Videos dan media lainnya

**Best Practices**:

- Organisir berdasarkan tipe file
- Gunakan format yang optimal (WebP untuk gambar, WOFF2 untuk font)
- Optimasi ukuran file untuk performa

---

## 📁 `components/` - Komponen Vue

**Tujuan**: Menyimpan komponen Vue yang dapat digunakan kembali di seluruh aplikasi.

### 🎯 Struktur Komponen

```
components/
├── base/              # Komponen dasar (pagination, dll)
├── dialogs/           # Modal dan dialog components
├── features/          # Komponen spesifik fitur
├── forms/             # Form components
├── layout/            # Layout components
├── modals/            # Modal components
├── navigation/        # Navigation components
└── ui/                # Design system components
```

### 🎨 `ui/` - Design System

Komponen UI yang konsisten dan dapat diakses, mengikuti prinsip atomic design:

- **Avatar** - Komponen avatar pengguna
- **Button** - Tombol dengan berbagai variant
- **Card** - Container untuk konten
- **Dialog** - Modal dan dialog
- **Form** - Form controls dan validation
- **Table** - Data table dengan sorting dan pagination
- **Input, Select, Textarea** - Form inputs

**Best Practices**:

- Gunakan TypeScript untuk props dan events
- Implementasi accessibility (ARIA labels, keyboard navigation)
- Konsisten dengan design system
- Gunakan `class-variance-authority` untuk variant management

**Contoh**:

```vue
<!-- components/ui/button/Button.vue -->
<template>
  <button :class="buttonVariants({ variant, size })" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cva } from "class-variance-authority";

const buttonVariants = cva("inline-flex items-center justify-center rounded-md font-medium transition-colors", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    },
    size: {
      sm: "h-9 px-3",
      md: "h-10 px-4 py-2",
    },
  },
});

defineProps<{
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
}>();
</script>
```

### 🏗️ `features/` - Feature Components

Komponen yang spesifik untuk fitur tertentu:

- **berita/** - Komponen untuk halaman berita
- **media/** - Komponen untuk media (carousel, share link)
- **selayang-pandang/** - Komponen untuk informasi daerah

### 📝 `forms/` - Form Components

Komponen form yang dapat digunakan kembali:

- **BaseForm** - Wrapper form dengan validation
- **BaseInput, BaseSelect, BaseTextarea** - Form controls
- **LoginForm** - Form login khusus

---

## 📁 `composables/` - Composition API

**Tujuan**: Menyimpan fungsi-fungsi yang dapat digunakan kembali menggunakan Composition API.

**Isi**:

- `useFetch.ts` - Generic data fetching dengan error handling
- `useAuth.ts` - Authentication logic
- `usePagination.ts` - Pagination logic
- `useDialog.ts` - Dialog/modal management
- `useFormatters.ts` - Data formatting utilities

**Best Practices**:

- Gunakan TypeScript untuk type safety
- Return reactive refs dan computed properties
- Handle loading states dan error handling
- Gunakan naming convention `use*`

**Contoh**:

```typescript
// composables/useFetch.ts
export function useFetch<TResponse, TData = TResponse>(
  apiFn: () => Promise<TResponse>,
  options?: {
    immediate?: boolean;
    extractData?: (response: TResponse) => TData;
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  },
) {
  const data = ref<TData | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  const fetchData = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiFn();
      data.value = options?.extractData ? options.extractData(response) : (response as TData);

      options?.onSuccess?.(data.value);
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      options?.onError?.(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  return { data, isLoading, error, fetchData, refresh: fetchData };
}
```

---

## 📁 `examples/` - Contoh Penggunaan

**Tujuan**: Menyimpan contoh penggunaan komponen dan fitur untuk referensi developer.

**Isi**:

- Contoh implementasi form
- Contoh penggunaan composables
- Demo komponen UI

---

## 📁 `layouts/` - Layout Templates

**Tujuan**: Menyimpan template layout yang digunakan untuk membungkus halaman.

**Isi**:

- `AppLayout.vue` - Layout utama untuk aplikasi
- `AuthLayout.vue` - Layout untuk halaman autentikasi

**Best Practices**:

- Gunakan `<slot />` untuk konten halaman
- Implementasi responsive design
- Konsisten dengan design system

**Contoh**:

```vue
<!-- layouts/AppLayout.vue -->
<template>
  <div class="bg-background min-h-screen">
    <AppHeader />
    <div class="container mx-auto px-4 py-8">
      <AppBreadcrumb />
      <main>
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>
```

---

## 📁 `lib/` - Library dan Utilities

**Tujuan**: Menyimpan konfigurasi, utilities, dan library yang digunakan di seluruh aplikasi.

### 🔧 Struktur

```
lib/
├── api/               # API configuration dan services
│   ├── core/         # HTTP client dan response handling
│   ├── services/     # API service functions
│   ├── types/        # TypeScript types untuk API
│   └── factories/    # Factory patterns untuk CRUD operations
├── config/           # Konfigurasi aplikasi
└── utils/            # Utility functions
```

### 🌐 `api/` - API Layer

**Core API**:

- `httpInstance.ts` - Axios instance dengan interceptors
- `apiResponse.ts` - Response handling utilities

**Services**:

- `auth.ts` - Authentication API calls
- `berita.ts` - News API calls
- `user.ts` - User management API calls

**Types**:

- TypeScript interfaces untuk API responses
- Type safety untuk semua API calls

**Best Practices**:

- Gunakan factory pattern untuk CRUD operations
- Implementasi error handling yang konsisten
- Type safety dengan TypeScript
- Interceptors untuk authentication

**Contoh**:

```typescript
// lib/api/services/auth.ts
import { httpInstance } from "../core/httpInstance";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpInstance.post("/auth/login", credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await httpInstance.post("/auth/logout");
  },
};
```

### ⚙️ `config/` - Konfigurasi

- `environment.ts` - Environment variables
- `portal.ts` - Portal-specific configuration

### 🛠️ `utils/` - Utilities

- `formatters.ts` - Data formatting functions
- `utils.ts` - General utility functions

---

## 📁 `pages/` - Halaman Aplikasi

**Tujuan**: Menyimpan komponen halaman yang sesuai dengan routing aplikasi.

### 🗂️ Struktur Halaman

```
pages/
├── app/              # Halaman aplikasi (dashboard, profile)
├── beranda/          # Halaman beranda
├── berita/           # Halaman berita
├── media/            # Halaman media (foto, video, dokumen)
├── pemerintahan/     # Halaman informasi pemerintahan
├── portal/           # Halaman portal
├── selayang-pandang/ # Halaman informasi daerah
├── unit-kerja/       # Halaman unit kerja
├── login/            # Halaman login
├── HomePage.vue      # Halaman utama
└── NotFound.vue      # 404 page
```

**Best Practices**:

- Satu komponen per halaman
- Gunakan layout yang sesuai
- Implementasi loading states
- Handle error states

**Contoh**:

```vue
<!-- pages/berita/IndexPage.vue -->
<template>
  <AppLayout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">Berita Terkini</h1>

      <div v-if="isLoading" class="space-y-4">
        <TableSkeleton />
      </div>

      <div v-else-if="error" class="py-8 text-center">
        <ErrorState :error="error" @retry="refresh" />
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="berita in data" :key="berita.id">
          <CardContent>
            <h3 class="font-semibold">{{ berita.title }}</h3>
            <p class="text-muted-foreground">{{ berita.excerpt }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useFetch } from "@/composables/useFetch";
import { beritaService } from "@/lib/api/services/berita";

const { data, isLoading, error, refresh } = useFetch(() => beritaService.getAll(), { immediate: true });
</script>
```

---

## 📁 `router/` - Vue Router Configuration

**Tujuan**: Konfigurasi routing dan navigasi aplikasi.

**Isi**:

- `index.ts` - Main router configuration
- Route guards untuk authentication
- Lazy loading untuk code splitting

**Best Practices**:

- Gunakan lazy loading untuk performa
- Implementasi route guards
- Type-safe routing dengan TypeScript
- Organisir routes berdasarkan fitur

**Contoh**:

```typescript
// router/index.ts
import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/pages/HomePage.vue"),
    },
    {
      path: "/login",
      component: () => import("@/pages/login/IndexPage.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/app",
      component: () => import("@/layouts/AppLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard",
          component: () => import("@/pages/app/dashboard/IndexPage.vue"),
        },
      ],
    },
  ],
});

// Route guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/app/dashboard");
  } else {
    next();
  }
});

export default router;
```

---

## 📁 `schemas/` - Validation Schemas

**Tujuan**: Menyimpan Zod validation schemas untuk form validation dan type safety.

**Isi**:

- `authSchema.ts` - Authentication form validation
- `userSchema.ts` - User form validation
- `roleSchema.ts` - Role form validation

**Best Practices**:

- Gunakan Zod untuk runtime validation
- Konsisten dengan TypeScript types
- Reusable schemas untuk form validation

**Contoh**:

```typescript
// schemas/authSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
```

---

## 📁 `stores/` - State Management

**Tujuan**: Menyimpan Pinia stores untuk manajemen state global aplikasi.

**Isi**:

- `authStore.ts` - Authentication state management
- `counter.ts` - Contoh store (dapat dihapus)

**Best Practices**:

- Gunakan Composition API style dengan `defineStore`
- Reactive state dengan `ref` dan `computed`
- Actions untuk mutations
- Persist state ke localStorage jika diperlukan

**Contoh**:

```typescript
// stores/authStore.ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { UserAuth } from "@/lib/api/types/auth.types";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<UserAuth | null>(null);
  const accessToken = ref<string>("");
  const isLoading = ref<boolean>(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);

  // Actions
  const login = async (credentials: LoginForm) => {
    isLoading.value = true;
    try {
      const response = await authService.login(credentials);
      user.value = response.data.user;
      accessToken.value = response.data.token.value;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    accessToken.value = "";
  };

  return {
    // State
    user,
    accessToken,
    isLoading,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
  };
});
```

---

## 📁 `styles/` - Global Styling

**Tujuan**: Menyimpan global CSS dan styling configuration.

**Isi**:

- `main.css` - Global styles dan Tailwind imports
- `reset.css` - CSS reset
- `icons.css` - Icon font styles

**Best Practices**:

- Gunakan Tailwind CSS untuk utility classes
- Custom CSS untuk komponen yang kompleks
- Konsisten dengan design system

---

## 📄 File Utama

### 🚀 `main.ts` - Entry Point

File entry point aplikasi yang menginisialisasi Vue app, router, dan store.

```typescript
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
```

### 🎯 `App.vue` - Root Component

Root component yang membungkus seluruh aplikasi.

```vue
<template>
  <div id="app">
    <Toaster position="top-right" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
</script>
```

---

## 🎯 Best Practices

### 📝 Code Organization

1. **Single Responsibility** - Setiap file/komponen memiliki satu tanggung jawab
2. **Consistent Naming** - Gunakan naming convention yang konsisten
3. **Type Safety** - Gunakan TypeScript untuk semua kode
4. **Component Composition** - Pecah komponen besar menjadi komponen kecil

### 🔧 Development

1. **ESLint & Prettier** - Gunakan untuk code quality dan formatting
2. **Testing** - Tulis unit tests untuk komponen kritis
3. **Documentation** - Dokumentasikan komponen dan fungsi yang kompleks
4. **Performance** - Gunakan lazy loading dan code splitting

### 🎨 UI/UX

1. **Accessibility** - Implementasi ARIA labels dan keyboard navigation
2. **Responsive Design** - Mobile-first approach
3. **Loading States** - Tampilkan loading indicators
4. **Error Handling** - Handle error states dengan baik

### 🔒 Security

1. **Input Validation** - Validasi semua input pengguna
2. **Authentication** - Implementasi route guards
3. **XSS Protection** - Sanitize user input
4. **HTTPS** - Gunakan HTTPS di production

---

## 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**

   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm run test:unit
   ```

---

## 📚 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

_Dokumentasi ini akan terus diperbarui seiring dengan perkembangan proyek. Untuk pertanyaan atau saran, silakan buat issue di repository._
