<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { PlusIcon } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";

import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import UserDialog from "@/components/dialogs/UserDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";

import { useConfirmDialog, useDialog } from "@/composables/useDialog";
import { usePaginationApp } from "@/composables/usePaginationApp";
import { deleteUser, getUsers, type User } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

// Setup pagination
const { loading, query, pagination, setPagination, setPage, setSearch } = usePaginationApp(10);

// Data
const users = ref<User[]>([]);

// Dialog states using composables
const useDialogUser = useDialog<User>();
const confirmDialog = useConfirmDialog();

// Definisi kolom
const columns: Column<User>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    searchable: true,
  },
  {
    key: "username",
    label: "Username",
    sortable: true,
    width: "150px",
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    searchable: true,
  },
  {
    key: "no_hp",
    label: "No HP",
    sortable: true,
    width: "150px",
  },
  {
    key: "is_active",
    label: "Status",
    sortable: true,
    width: "120px",
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    width: "150px",
    render: (item: any) => {
      return item.user_roles[0].role.nama;
    },
  },
  {
    key: "created_at",
    label: "Dibuat",
    sortable: true,
    width: "150px",
  },
];

// Load users data
const loadUsers = async () => {
  try {
    loading.value = true;
    const response = await getUsers(query.value, authStore.accessToken);
    users.value = response.data;
    setPagination(response.pagination);
  } catch (error) {
    toast.error("Error", {
      description: "Gagal memuat data users",
    });
  } finally {
    loading.value = false;
  }
};

// Event handlers
const handleRowClick = (item: User) => {};

const openCreateDialog = () => {
  useDialogUser.openCreate();
};

const handleEdit = (item: User) => {
  useDialogUser.openEdit(item);
};

const handleDelete = (item: User) => {
  confirmDialog.showConfirm(item);
};

const confirmDelete = async () => {
  if (!confirmDialog.data.value) return;

  try {
    confirmDialog.setLoading(true);
    await deleteUser(confirmDialog.data.value.id, authStore.accessToken);

    loadUsers();

    toast.success("Berhasil", {
      description: "User berhasil dihapus",
    });
  } catch (error: any) {
    toast.error("Gagal", {
      description: error.message || "Gagal menghapus user",
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.hideConfirm();
  }
};

const handleUserDialogSuccess = () => {
  // Reload data after successful create/update
  loadUsers();
  useDialogUser.closeDialog();
};

const handleUserDialogUpdateOpen = (value: boolean) => {
  // Reset dialog state
  useDialogUser.state.value.open = value;
  useDialogUser.state.value.data = null;
};

const handlePageChange = (page: number) => {
  setPage(page);
  loadUsers();
};

// Gunakan debouce agar delat hit endpoint
const debounceFnSearch = useDebounceFn((search: string) => {
  setSearch(search);
  loadUsers();
}, 500);

const handleSearch = (search: string) => {
  debounceFnSearch(search);
};

// Mount
onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="px-5 py-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Users</h1>
      <Button @click="openCreateDialog" class="flex items-center gap-2">
        <PlusIcon class="h-4 w-4" />
        Tambah User
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>List of users dengan fitur pencarian, sorting, dan pagination</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          :data="users"
          :columns="columns"
          :searchable="true"
          :pagination="true"
          :page-size="10"
          :total-data="pagination.total"
          :total-pages="pagination.totalPages"
          :loading="loading"
          @page-change="handlePageChange"
          @search="handleSearch"
          @row-click="handleRowClick"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </CardContent>
    </Card>

    <!-- User Dialog -->
    <UserDialog
      :open="useDialogUser.state.value.open"
      :mode="useDialogUser.state.value.mode"
      :user="useDialogUser.state.value.data"
      @success="handleUserDialogSuccess"
      @update:open="handleUserDialogUpdateOpen"
    />

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      v-model:open="confirmDialog.open.value"
      title="Hapus User"
      :description="`Apakah Anda yakin ingin menghapus user '${confirmDialog.data.value?.name}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.loading.value"
      @confirm="confirmDelete"
    />
  </div>
</template>
