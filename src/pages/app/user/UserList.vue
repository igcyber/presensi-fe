<script setup lang="ts">
import { AlertCircle, Edit, Eye, Loader2, Search, Trash2, UserPlus, Users } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { BasePagination } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { User } from "@/schemas/userSchema";
import { type UserListParams, userService } from "@/services/userService";

const router = useRouter();

const loading = ref(false);
const users = ref<User[]>([]);
const totalUsers = ref(0);
const currentPage = ref(1);
const perPage = ref(10);
const searchQuery = ref("");
const error = ref<string | null>(null);

// Computed properties
const totalPages = computed(() => Math.ceil(totalUsers.value / perPage.value));
const hasUsers = computed(() => users.value.length > 0);
const isSearching = computed(() => searchQuery.value.length > 0);

// Load users
const loadUsers = async (page = 1) => {
  try {
    loading.value = true;
    error.value = null;

    const params: UserListParams = {
      page,
      per_page: perPage.value,
      search: searchQuery.value || undefined,
      sort_by: "created_at",
      sort_order: "desc",
    };

    const response = await userService.getUsers(params);
    users.value = response.data.data;
    totalUsers.value = response.data.meta.total;
    currentPage.value = response.data.meta.current_page;
  } catch (err: any) {
    error.value = err.message || "Gagal memuat daftar user";
    console.error("Load users error:", err);
  } finally {
    loading.value = false;
  }
};

// Handle search
const handleSearch = () => {
  currentPage.value = 1;
  loadUsers(1);
};

// Handle page change
const handlePageChange = (page: number) => {
  loadUsers(page);
};

// Handle create user
const handleCreateUser = () => {
  router.push("/users/create");
};

// Handle edit user
const handleEditUser = (user: User) => {
  router.push(`/users/${user.id}/edit`);
};

// Handle view user
const handleViewUser = (user: User) => {
  router.push(`/users/${user.id}`);
};

// Handle delete user
const handleDeleteUser = async (user: User) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus user "${user.full_name}"?`)) {
    return;
  }

  try {
    await userService.deleteUser(user.id);
    // Reload users after deletion
    await loadUsers(currentPage.value);
  } catch (err: any) {
    error.value = err.message || "Gagal menghapus user";
    console.error("Delete user error:", err);
  }
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Load users on mount
onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Users class="text-primary h-8 w-8" />
        <div>
          <h1 class="text-3xl font-bold">Manajemen User</h1>
          <p class="text-muted-foreground">Kelola data user sistem</p>
        </div>
      </div>

      <Button @click="handleCreateUser" class="flex items-center gap-2">
        <UserPlus class="h-4 w-4" />
        Tambah User
      </Button>
    </div>

    <!-- Search and Filters -->
    <Card class="mb-6">
      <CardContent class="pt-6">
        <div class="flex gap-4">
          <div class="flex-1">
            <div class="relative">
              <Search class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                v-model="searchQuery"
                placeholder="Cari berdasarkan nama, email, atau NIP..."
                class="pl-10"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>
          <Button @click="handleSearch" variant="outline"> Cari </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Error State -->
    <div v-if="error" class="mb-6">
      <Card>
        <CardContent class="pt-6">
          <div class="bg-destructive/15 border-destructive/20 text-destructive rounded-lg border px-4 py-3">
            <div class="flex items-center gap-2">
              <AlertCircle class="h-4 w-4" />
              <span class="text-sm font-medium">{{ error }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <Loader2 class="text-primary h-5 w-5 animate-spin" />
        <span class="text-muted-foreground">Memuat daftar user...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasUsers && !loading" class="py-12 text-center">
      <Users class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
      <h3 class="mb-2 text-lg font-semibold">
        {{ isSearching ? "User tidak ditemukan" : "Belum ada user" }}
      </h3>
      <p class="text-muted-foreground mb-4">
        {{ isSearching ? "Coba ubah kata kunci pencarian" : "Mulai dengan membuat user pertama" }}
      </p>
      <Button v-if="!isSearching" @click="handleCreateUser">
        <UserPlus class="mr-2 h-4 w-4" />
        Tambah User
      </Button>
    </div>

    <!-- Users Table -->
    <Card v-else>
      <CardHeader>
        <CardTitle>Daftar User</CardTitle>
        <CardDescription> Total {{ totalUsers }} user ditemukan </CardDescription>
      </CardHeader>

      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="px-4 py-3 text-left font-medium">Nama</th>
                <th class="px-4 py-3 text-left font-medium">Email</th>
                <th class="px-4 py-3 text-left font-medium">NIP</th>
                <th class="px-4 py-3 text-left font-medium">Status</th>
                <th class="px-4 py-3 text-left font-medium">Dibuat</th>
                <th class="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="hover:bg-muted/50 border-b">
                <td class="px-4 py-3">
                  <div>
                    <div class="font-medium">{{ user.full_name }}</div>
                    <div class="text-muted-foreground text-sm">@{{ user.name }}</div>
                  </div>
                </td>
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3">{{ user.nip }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ user.is_active ? "Aktif" : "Tidak Aktif" }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ formatDate(user.created_at) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" @click="handleViewUser(user)">
                      <Eye class="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" @click="handleEditUser(user)">
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      @click="handleDeleteUser(user)"
                      class="text-destructive hover:text-destructive"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Pagination -->
    <div v-if="hasUsers && totalPages > 1" class="mt-6">
      <BasePagination
        :page="currentPage"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalUsers"
        :items-per-page="perPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: calc(100vh - 4rem);
}

/* Table styles */
table {
  border-collapse: collapse;
}

th,
td {
  text-align: left;
}

/* Hover effects */
tbody tr:hover {
  background-color: hsl(var(--muted) / 0.5);
}

/* Responsive table */
@media (max-width: 768px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
