# 🧩 Composables Documentation

## 📋 Pengantar

Composables adalah fungsi-fungsi yang dapat digunakan kembali dalam Vue 3 menggunakan Composition API. Mereka memungkinkan kita untuk mengekstrak dan menggunakan logika stateful di seluruh komponen, membuat kode lebih modular, dapat diuji, dan mudah dipelihara.

### 🎯 Keuntungan Composables

- **Reusability** - Logika dapat digunakan di banyak komponen
- **Separation of Concerns** - Memisahkan logika bisnis dari template
- **Type Safety** - Dukungan penuh TypeScript
- **Testability** - Mudah untuk di-test secara terpisah
- **Cleaner Components** - Komponen fokus pada rendering, bukan logika

### 📁 Struktur Composables

```
composables/
├── index.ts              # Export semua composables
├── useAppData.ts         # Data aplikasi global
├── useBreadcrumb.ts      # Manajemen breadcrumb
├── useDialog.ts          # State management untuk dialog
├── useFetch.ts           # Generic data fetching
├── useFilePreview.ts     # File preview dialog management
├── useFormatters.ts      # Utility formatters
├── usePagination.ts      # Pagination sederhana
├── usePaginationApp.ts   # Pagination dengan search & filter
├── usePortal.ts          # Portal menu management
└── useResourceList.ts    # List management dengan pagination
```

---

## 📄 `index.ts` - Export Center

**📖 Description**: File pusat untuk mengekspor semua composables, memudahkan import dan menjaga konsistensi.

```typescript
// Export semua composables
export * from "./useAppData";
export * from "./useBreadcrumb";
export * from "./useDialog";
export * from "./useFetch";
export * from "./useFilePreview";
export * from "./useFormatters";
export * from "./usePagination";
export * from "./usePaginationApp";
export * from "./usePortal";
export * from "./useResourceList";
```

**⚡ Usage Example**:

```typescript
// Import multiple composables
import { useFetch, useDialog, useFormatters, useFilePreview } from '@/composables'

// Atau import individual
import { useFetch } from '@/composables/useFetch'
import { useFilePreview } from '@/composables/useFilePreview'
```

**🛠 Best Practices**:

- Selalu export composables baru dari `index.ts`
- Gunakan named exports untuk konsistensi
- Jangan export default dari composables

---

## 📄 `useAppData.ts` - Global Application Data

**📖 Description**: Composable untuk mengelola data aplikasi global seperti informasi kontak, navigasi, dan link terkait. Menyediakan state terpusat untuk data yang digunakan di seluruh aplikasi.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <!-- Contact Info -->
    <div v-if="!isLoading">
      <p>{{ contactInfo.alamat }}</p>
      <p>{{ contactInfo.telepon }}</p>
      <p>{{ contactInfo.email }}</p>
    </div>

    <!-- Navigation Menu -->
    <nav>
      <ul>
        <li v-for="item in navigation" :key="item.path">
          <router-link :to="item.path">{{ item.title }}</router-link>
        </li>
      </ul>
    </nav>

    <!-- Related Links -->
    <div>
      <h3>Link Terkait</h3>
      <a v-for="link in relatedLinks" :key="link.id" :href="link.website">
        {{ link.nama }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { useAppData } from "@/composables";

const {
  contactInfo,
  footerInfo,
  relatedLinks,
  navigation,
  selayangPandangNavigation,
  pemerintahanNavigation,
  unitKerjaNavigation,
  isLoading,
  error,
  fetchAllAppData,
} = useAppData();

// Load data saat komponen dimount
onMounted(() => {
  fetchAllAppData();
});
</script>
```

**🛠 Best Practices**:

- Panggil `fetchAllAppData()` di root component atau layout
- Gunakan `isLoading` untuk menampilkan loading state
- Handle `error` state dengan baik
- Data akan otomatis tersedia di semua komponen yang menggunakan composable ini

---

## 📄 `useBreadcrumb.ts` - Breadcrumb Management

**📖 Description**: Composable untuk mengelola breadcrumb secara otomatis berdasarkan route saat ini. Mendukung dynamic breadcrumb dan context-aware labeling.

**⚡ Usage Example**:

```vue
<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li v-for="(item, index) in breadcrumbItems" :key="index" class="flex items-center">
        <router-link v-if="!item.active && item.href" :to="item.href" class="text-blue-600 hover:text-blue-800">
          {{ item.label }}
        </router-link>
        <span v-else class="text-gray-500">{{ item.label }}</span>

        <span v-if="index < breadcrumbItems.length - 1" class="mx-2">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { useBreadcrumb } from "@/composables";

const { breadcrumbItems, navigateTo, setContext, getTitleFromRoute } = useBreadcrumb();

// Set dynamic context untuk halaman detail
const setDetailContext = (detailName: string) => {
  setContext(detailName);
};

// Get page title dari breadcrumb
const pageTitle = getTitleFromRoute();
</script>
```

**🛠 Best Practices**:

- Gunakan `setContext()` untuk dynamic breadcrumb (misal: nama kegiatan dari API)
- Breadcrumb akan otomatis update saat route berubah
- Tambahkan route mapping baru di `routeLabels` dan `routeHierarchy` jika diperlukan
- Gunakan `getTitleFromRoute()` untuk mendapatkan title halaman

---

## 📄 `useDialog.ts` - Dialog State Management

**📖 Description**: Composable untuk mengelola state dialog/modal dengan mode create, edit, dan view. Menyediakan interface yang konsisten untuk semua dialog di aplikasi.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <!-- Trigger Buttons -->
    <button @click="openCreate" class="btn-primary">Tambah Baru</button>
    <button @click="openEdit(user)" class="btn-secondary">Edit</button>
    <button @click="openView(user)" class="btn-outline">Lihat Detail</button>

    <!-- Dialog Component -->
    <UserDialog
      v-model:open="state.open"
      :mode="state.mode"
      :data="state.data"
      :loading="state.loading"
      @close="closeDialog"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import UserDialog from "@/components/dialogs/UserDialog.vue";

import { useDialog } from "@/composables";

interface User {
  id: number;
  name: string;
  email: string;
}

const { state, openCreate, openEdit, openView, closeDialog, setLoading } = useDialog<User>();

const handleSave = async (userData: User) => {
  setLoading(true);
  try {
    if (state.value.mode === "create") {
      await createUser(userData);
    } else if (state.value.mode === "edit") {
      await updateUser(userData);
    }
    closeDialog();
    // Refresh data atau show success message
  } catch (error) {
    console.error("Error saving user:", error);
  } finally {
    setLoading(false);
  }
};
</script>
```

**🛠 Best Practices**:

- Gunakan generic type untuk type safety (`useDialog<User>()`)
- Set loading state saat melakukan operasi async
- Reset dialog state setelah operasi selesai
- Gunakan mode yang sesuai: `create`, `edit`, atau `view`

---

## 📄 `useFetch.ts` - Generic Data Fetching

**📖 Description**: Composable generik untuk data fetching dengan error handling, loading states, dan callback support. Mendukung data extraction dan type safety.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <div v-if="isLoading" class="loading">Loading...</div>

    <div v-else-if="isError" class="error">
      <p>Error: {{ error?.message }}</p>
      <button @click="refresh">Retry</button>
    </div>

    <div v-else-if="hasData">
      <div v-for="item in data" :key="item.id">
        {{ item.name }}
      </div>
    </div>

    <div v-else>No data available</div>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from "@/composables";
import { userService } from "@/lib/api/services/user";

interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse {
  data: User[];
  meta: { total: number };
}

const { data, isLoading, isError, error, hasData, fetchData, refresh } = useFetch<ApiResponse, User[]>(
  () => userService.getAll(),
  {
    immediate: true,
    extractData: (response) => response.data,
    onSuccess: (users) => {
      console.log("Users loaded:", users.length);
    },
    onError: (err) => {
      console.error("Failed to load users:", err);
    },
  },
);
</script>
```

**🛠 Best Practices**:

- Gunakan generic types untuk type safety
- Implementasi `extractData` untuk mengekstrak data dari response
- Gunakan `onSuccess` dan `onError` callbacks untuk side effects
- Set `immediate: false` jika ingin manual trigger
- Handle loading, error, dan empty states di template

---

## 📄 `useFilePreview.ts` - File Preview Dialog Management

**📖 Description**: Composable untuk mengelola file preview dialog dengan state management dan helper functions. Menyediakan interface yang konsisten untuk preview berbagai jenis file (gambar, video, audio, PDF) dengan fitur lengkap seperti zoom, download, dan fullscreen.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <!-- Trigger Buttons -->
    <button @click="previewImage" class="btn-primary">Preview Image</button>
    <button @click="previewDocument" class="btn-secondary">Preview PDF</button>
    <button @click="previewVideo" class="btn-outline">Preview Video</button>

    <!-- File Preview Dialog -->
    <FilePreviewDialog
      v-model:open="filePreview.isOpen.value"
      :file="filePreview.currentFile.value"
      :title="filePreview.options.value.title"
      :show-download="filePreview.options.value.showDownload ?? true"
      :show-external-link="filePreview.options.value.showExternalLink ?? true"
      :show-file-info="filePreview.options.value.showFileInfo ?? true"
      :max-width="filePreview.options.value.maxWidth"
      :max-height="filePreview.options.value.maxHeight"
      @download="filePreview.handleDownload"
      @external-link="filePreview.handleExternalLink"
    />
  </div>
</template>

<script setup lang="ts">
import { FilePreviewDialog } from "@/components/dialogs";

import { useFilePreview } from "@/composables";

const filePreview = useFilePreview();

// Preview gambar dengan shortcut method
const previewImage = () => {
  filePreview.previewImage("https://example.com/image.jpg", "Sample Image", {
    title: "Preview Gambar",
    showFileInfo: false,
  });
};

// Preview PDF dengan shortcut method
const previewDocument = () => {
  filePreview.previewPDF("https://example.com/document.pdf", "Document.pdf", {
    title: "Preview Dokumen",
    maxWidth: "95vw",
    maxHeight: "95vh",
  });
};

// Preview video dengan shortcut method
const previewVideo = () => {
  filePreview.previewVideo("https://example.com/video.mp4", "Sample Video");
};

// Preview file generic dengan full control
const previewCustomFile = () => {
  filePreview.previewFile(
    {
      url: "https://example.com/file.pdf",
      name: "Custom File",
      size: 1024000,
      type: "application/pdf",
      lastModified: new Date(),
      description: "Custom file description",
    },
    {
      title: "Custom Preview",
      showDownload: true,
      showExternalLink: true,
      showFileInfo: true,
    },
  );
};
</script>
```

**🔧 Available Methods**:

```typescript
const filePreview = useFilePreview();

// State Management
filePreview.isOpen.value; // Boolean - Dialog open state
filePreview.currentFile.value; // FilePreviewData | null - Current file
filePreview.options.value; // FilePreviewOptions - Current options

// Preview Methods
filePreview.previewFile(file, options); // General preview method
filePreview.previewImage(url, name, options); // Optimized for images
filePreview.previewPDF(url, name, options); // Optimized for PDFs
filePreview.previewVideo(url, name, options); // Optimized for videos
filePreview.closePreview(); // Close dialog

// Action Handlers
filePreview.handleDownload(file); // Download file handler
filePreview.handleExternalLink(file); // Open in new tab handler

// Utilities
filePreview.detectFileType(file); // Detect file type category
filePreview.canPreview(file); // Check if file can be previewed
```

**📊 Supported File Types**:

| Category      | Formats                                    | Features                     |
| ------------- | ------------------------------------------ | ---------------------------- |
| **Images**    | JPG, JPEG, PNG, GIF, WebP, BMP, SVG        | Zoom controls, click to zoom |
| **Videos**    | MP4, WebM, OGG, AVI, MOV, WMV, FLV         | Native video controls        |
| **Audio**     | MP3, WAV, OGG, AAC, FLAC, M4A              | Audio player with controls   |
| **Documents** | PDF                                        | Full iframe preview          |
| **Text**      | TXT, MD, JSON, XML, HTML, CSS, JS, TS, Vue | External link only           |
| **Office**    | DOC, DOCX, XLS, XLSX, PPT, PPTX            | External link only           |

**🎯 Integration Examples**:

```vue
<!-- DataTable Integration -->
<template>
  <DataTable :data="documents" :columns="columns">
    <template #file="{ item }">
      <button @click="filePreview.previewPDF(item.fileUrl, item.name)" class="text-blue-600 hover:underline">
        {{ item.name }}
      </button>
    </template>
  </DataTable>
</template>

<!-- Form Integration -->
<template>
  <BaseInputFileWithPreview
    name="document"
    label="Upload Document"
    accept="application/pdf"
    :enable-file-preview="true"
    description="Click on uploaded files to preview"
  />
</template>

<!-- Gallery Integration -->
<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="image in images" :key="image.id" class="cursor-pointer">
      <img
        :src="image.thumbnail"
        :alt="image.name"
        @click="filePreview.previewImage(image.fullUrl, image.name)"
        class="h-32 w-full rounded object-cover"
      />
    </div>
  </div>
</template>
```

**🛠 Best Practices**:

- Gunakan shortcut methods (`previewImage`, `previewPDF`, `previewVideo`) untuk kasus umum
- Gunakan `previewFile` untuk kontrol penuh atas options
- Set `showFileInfo: false` untuk preview sederhana tanpa detail file
- Gunakan `maxWidth` dan `maxHeight` untuk mengatur ukuran dialog
- Implementasi error handling untuk file yang gagal dimuat
- Gunakan `detectFileType` untuk kondisional rendering berdasarkan jenis file
- Cleanup object URLs secara otomatis sudah dihandle oleh composable

---

## 📄 `useFormatters.ts` - Utility Formatters

**📖 Description**: Composable yang menyediakan akses ke semua utility formatters dalam satu tempat. Memudahkan penggunaan formatters di komponen.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <!-- Currency -->
    <p>Harga: {{ currency(1000000) }}</p>

    <!-- Date -->
    <p>Tanggal: {{ date(new Date()) }}</p>
    <p>Waktu Relatif: {{ relativeDate(new Date()) }}</p>

    <!-- Text -->
    <p>{{ truncate("Lorem ipsum dolor sit amet", 20) }}</p>
    <p>{{ capitalize("hello world") }}</p>

    <!-- Contact -->
    <p>Telepon: {{ phone("081234567890") }}</p>
    <p>Email: {{ maskEmail("user@example.com") }}</p>

    <!-- Status -->
    <span :class="status('active')">{{ status("active") }}</span>

    <!-- File Size -->
    <p>Ukuran: {{ fileSize(1024000) }}</p>

    <!-- Percentage -->
    <p>Progress: {{ percentage(0.75) }}</p>
  </div>
</template>

<script setup lang="ts">
import { useFormatters } from "@/composables";

const {
  currency,
  number,
  date,
  time,
  relativeDate,
  monthName,
  status,
  activeStatus,
  truncate,
  capitalize,
  detailName,
  name,
  phone,
  maskEmail,
  percentage,
  fileSize,
  safeGet,
  isEmpty,
  isActivePath,
  getSlugUrl,
  slugify,
  youtubeInfo,
  facebookInfo,
  toEmbedUrl,
} = useFormatters();
</script>
```

**🛠 Best Practices**:

- Gunakan formatters yang sesuai dengan konteks data
- Kombinasikan dengan computed properties untuk data yang kompleks
- Gunakan `safeGet` untuk akses properti yang aman
- Gunakan `isEmpty` untuk validasi data kosong

---

## 📄 `usePagination.ts` - Simple Pagination

**📖 Description**: Composable untuk pagination sederhana dengan client-side pagination. Cocok untuk data yang sudah dimuat di frontend.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <!-- Data List -->
    <div v-for="item in paginatedItems" :key="item.id">
      {{ item.name }}
    </div>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button @click="currentPage = 1" :disabled="currentPage === 1">First</button>
      <button @click="currentPage--" :disabled="currentPage === 1">Previous</button>

      <span v-for="page in buildPagination(totalPages, currentPage)" :key="page">
        <button v-if="page !== '…'" @click="currentPage = page" :class="{ active: currentPage === page }">
          {{ page }}
        </button>
        <span v-else>…</span>
      </span>

      <button @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
      <button @click="currentPage = totalPages" :disabled="currentPage === totalPages">Last</button>
    </div>

    <!-- Info -->
    <p>
      Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of
      {{ totalItems }} items
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { usePagination } from "@/composables";

const { currentPage, totalPages, totalItems, itemsPerPage, setPagination, paginate, buildPagination } = usePagination();

// Sample data
const allItems = ref([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  // ... more items
]);

// Set pagination info
setPagination({
  currentPage: 1,
  totalPages: Math.ceil(allItems.value.length / itemsPerPage.value),
  totalItems: allItems.value.length,
  itemsPerPage: 10,
});

// Get paginated items
const paginatedItems = computed(() => paginate(allItems.value));
</script>
```

**🛠 Best Practices**:

- Gunakan untuk data yang sudah dimuat di frontend
- Update `totalPages` dan `totalItems` saat data berubah
- Gunakan `buildPagination()` untuk UI pagination yang kompleks
- Handle edge cases (empty data, single page, dll.)

---

## 📄 `usePaginationApp.ts` - Advanced Pagination

**📖 Description**: Composable untuk pagination yang lebih advanced dengan search, sorting, dan filtering. Cocok untuk server-side pagination dengan API.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <!-- Search -->
    <input v-model="searchQuery" @input="handleSearch" placeholder="Search users..." class="search-input" />

    <!-- Filters -->
    <select v-model="selectedStatus" @change="handleStatusFilter">
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>

    <!-- Sort -->
    <button @click="toggleSort('name')">Name {{ getSortDirection("name") }}</button>

    <!-- Data Table -->
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in items" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.status }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="!hasPrevPage">Previous</button>

      <button
        v-for="page in getPageNumbers(5)"
        :key="page"
        @click="setPage(page)"
        :class="{ active: pagination.current_page === page }"
      >
        {{ page }}
      </button>

      <button @click="nextPage" :disabled="!hasNextPage">Next</button>
    </div>

    <!-- Info -->
    <p>Showing {{ startItem }} to {{ endItem }} of {{ pagination.total }} items</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { usePaginationApp } from "@/composables";
import { userService } from "@/lib/api/services/user";

const {
  pagination,
  search,
  sorts,
  filters,
  hasData,
  hasNextPage,
  hasPrevPage,
  startItem,
  endItem,
  query,
  setPagination,
  setPage,
  setPerPage,
  nextPage,
  prevPage,
  setSearch,
  addSort,
  removeSort,
  clearSorts,
  addFilter,
  removeFilter,
  clearFilters,
  reset,
  getPageNumbers,
} = usePaginationApp(10);

const items = ref([]);
const searchQuery = ref("");
const selectedStatus = ref("");

// Watch query changes and fetch data
watch(
  query,
  async (newQuery) => {
    try {
      const response = await userService.getAll(newQuery);
      items.value = response.data.data;
      setPagination(response.data.meta);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },
  { deep: true, immediate: true },
);

// Search handler
const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  setSearch(target.value);
};

// Filter handler
const handleStatusFilter = () => {
  if (selectedStatus.value) {
    addFilter("status", selectedStatus.value);
  } else {
    removeFilter("status");
  }
};

// Sort handler
const toggleSort = (field: string) => {
  const existingSort = sorts.value.find((s) => s.field === field);
  if (existingSort) {
    if (existingSort.direction === "asc") {
      addSort(field, "desc");
    } else {
      removeSort(field);
    }
  } else {
    addSort(field, "asc");
  }
};

const getSortDirection = (field: string) => {
  const sort = sorts.value.find((s) => s.field === field);
  return sort ? (sort.direction === "asc" ? "↑" : "↓") : "";
};
</script>
```

**🛠 Best Practices**:

- Gunakan untuk server-side pagination
- Watch `query` untuk auto-fetch data
- Debounce search input untuk performa
- Reset ke page 1 saat search/filter/sort berubah
- Gunakan `getPageNumbers()` untuk UI pagination

---

## 📄 `usePortal.ts` - Portal Menu Management

**📖 Description**: Composable untuk mengelola menu portal dengan submenu dan state management. Menyediakan kontrol untuk menu yang aktif dan submenu yang terbuka.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <!-- Main Menu -->
    <nav class="main-menu">
      <ul>
        <li v-for="menu in menus" :key="menu.id" class="menu-item" :class="{ active: menuActive?.id === menu.id }">
          <router-link :to="menu.path" @click="toggleSubMenu(menu.id)">
            {{ menu.name }}
          </router-link>

          <!-- Submenu -->
          <ul v-if="menu.children && openSubMenuId === menu.id" class="submenu">
            <li v-for="child in menu.children" :key="child.id">
              <router-link :to="child.path">{{ child.name }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Container Menus -->
    <div v-if="containerMenus.length" class="container-menus">
      <h3>Menu Container</h3>
      <ul>
        <li v-for="container in containerMenus" :key="container.id">
          <router-link :to="container.path">{{ container.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { usePortal } from "@/composables";

const { menus, containerMenus, menuActive, hasOpenSubMenu, openSubMenu, toggleSubMenu, closeSubMenu, fetchData } =
  usePortal();

// Load menu data
onMounted(() => {
  fetchData();
});

// Close submenu when clicking outside
const handleClickOutside = (event: Event) => {
  if (hasOpenSubMenu.value) {
    closeSubMenu();
  }
};
</script>
```

**🛠 Best Practices**:

- Panggil `fetchData()` di layout atau root component
- Gunakan `toggleSubMenu()` untuk toggle submenu
- Implementasi click outside untuk menutup submenu
- Gunakan `menuActive` untuk styling menu yang aktif
- Handle loading state saat fetch data

---

## 📄 `useResourceList.ts` - Resource List Management

**📖 Description**: Composable untuk mengelola list resource dengan pagination, search, dan filtering. Menggabungkan `useFetch` dan `usePaginationApp` untuk solusi yang lengkap.

**⚡ Usage Example**:

```vue
<template>
  <div>
    <!-- Search -->
    <input v-model="searchInput" @input="handleSearch" placeholder="Search users..." class="search-input" />

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <!-- Error State -->
    <div v-else-if="isError" class="error">
      <p>Error: {{ error?.message }}</p>
      <button @click="fetchData">Retry</button>
    </div>

    <!-- Data Table -->
    <div v-else-if="items.length" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in items" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.status }}</td>
            <td>
              <button @click="editUser(user)">Edit</button>
              <button @click="deleteUser(user)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No users found</p>
    </div>

    <!-- Pagination -->
    <div v-if="meta && meta.total > 0" class="pagination">
      <button @click="handlePageChange(pagination.current_page - 1)" :disabled="pagination.current_page === 1">
        Previous
      </button>

      <button
        v-for="page in getPageNumbers(5)"
        :key="page"
        @click="handlePageChange(page)"
        :class="{ active: pagination.current_page === page }"
      >
        {{ page }}
      </button>

      <button
        @click="handlePageChange(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
      >
        Next
      </button>
    </div>

    <!-- Info -->
    <p v-if="meta">Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} users</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { useResourceList } from "@/composables";
import { userService } from "@/lib/api/services/user";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const searchInput = ref("");

const { items, meta, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<User>((params) => userService.getAll(params), {
    perPage: 10,
    searchDebounce: 500,
  });

// Watch query changes and fetch data
watch(query, fetchData, { deep: true, immediate: true });

// Get page numbers for pagination UI
const getPageNumbers = (maxVisible: number = 5) => {
  const pages: number[] = [];
  const totalPages = pagination.last_page;
  const currentPage = pagination.current_page;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const halfVisible = Math.floor(maxVisible / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (endPage - startPage + 1 < maxVisible) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisible - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
};

// CRUD operations
const editUser = (user: User) => {
  // Open edit dialog
  console.log("Edit user:", user);
};

const deleteUser = async (user: User) => {
  if (confirm("Are you sure?")) {
    try {
      await userService.delete(user.id);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};
</script>
```

**🛠 Best Practices**:

- Gunakan untuk CRUD operations dengan pagination
- Set `searchDebounce` untuk performa yang lebih baik
- Watch `query` untuk auto-fetch data
- Handle loading, error, dan empty states
- Refresh data setelah CRUD operations
- Gunakan generic type untuk type safety

---

## 🎯 Best Practices Umum

### 📝 Naming Convention

- Selalu gunakan prefix `use` untuk composables
- Gunakan camelCase untuk nama composable
- Nama harus deskriptif dan jelas

### 🔧 Type Safety

- Gunakan TypeScript untuk semua composables
- Definisikan interface untuk data yang kompleks
- Gunakan generic types untuk reusability

### 🧪 Testing

- Test composables secara terpisah dari komponen
- Mock dependencies yang diperlukan
- Test semua return values dan side effects

### 📦 Reusability

- Buat composables yang focused pada satu tanggung jawab
- Hindari side effects yang tidak perlu
- Dokumentasikan parameter dan return values

### 🚀 Performance

- Gunakan `computed` untuk derived state
- Implementasi debouncing untuk search
- Lazy load data jika diperlukan

---

## 🔗 Integration dengan Komponen

### Layout Components

```typescript
// layouts/AppLayout.vue
import { useAppData, useBreadcrumb, usePortal } from "@/composables";

const { navigation, fetchAllAppData } = useAppData();
const { breadcrumbItems } = useBreadcrumb();
const { menus, fetchData } = usePortal();
```

### Page Components

```typescript
// pages/UserPage.vue
import { useDialog, useResourceList } from "@/composables";

const { items, fetchData } = useResourceList(() => userService.getAll());
const { openCreate, openEdit } = useDialog<User>();
```

### Feature Components

```typescript
// components/UserForm.vue
import { useFetch, useFilePreview, useFormatters } from "@/composables";

const { data, isLoading } = useFetch(() => userService.get(id));
const { date, currency } = useFormatters();
const filePreview = useFilePreview();
```

### Dialog Components

```typescript
// components/dialogs/DocumentDialog.vue
import { useDialog, useFilePreview } from "@/composables";

const { state, openEdit } = useDialog<Document>();
const filePreview = useFilePreview();

// Preview document before editing
const previewDocument = (doc) => {
  filePreview.previewPDF(doc.fileUrl, doc.name);
};
```

---

_Dokumentasi ini akan terus diperbarui seiring dengan penambahan composables baru. Untuk pertanyaan atau saran, silakan buat issue di repository._
