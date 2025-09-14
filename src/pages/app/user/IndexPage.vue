<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import UserDialog from "@/components/dialogs/UserDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { getRoles } from "@/lib/api/services/role";
import { deleteUser, getUsers } from "@/lib/api/services/user";
import type { Role } from "@/lib/api/types/role.types";
import type { User } from "@/lib/api/types/user.types";

// Composables
const router = useRouter();

const { items, isLoading, isError, error, pagination, query, fetchData, handleSearch, handlePageChange } =
  useResourceList<User>((params) => getUsers(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<User>();
const confirmDialog = useDialog<User>();

const { capitalize } = useFormatters();

// Reactive state
const roleOptions = ref<{ label: string; value: number }[]>([]);

// Column definitions
const columns: Column<User>[] = [
  {
    key: "fullName",
    label: "Nama",
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
    key: "nip",
    label: "NIP",
    sortable: true,
    width: "150px",
  },
  {
    key: "roles",
    label: "Role",
    sortable: true,
    width: "150px",
    render: (item: User): string => {
      return item.roles.map((role: Role) => capitalize(role.name)).join(", ");
    },
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "150px",
  },
];

// Methods
const loadRoleOptions = async (): Promise<void> => {
  try {
    const roles = await getRoles();
    roleOptions.value = roles.data.data.map((role: Role) => ({ label: role.name, value: role.id }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data role";
    toast.error("Gagal", { description: errorMessage });
  }
};

const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: User): void => {
  router.push({ name: "app.user.detail", params: { id: item.id } });
};

const handleEdit = (item: User): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: User): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deleteUser(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "User berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus user";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handleUserDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Watchers
watch(
  query,
  () => {
    fetchData();
  },
  { immediate: true, deep: true },
);

// Lifecycle hooks
onMounted(() => {
  loadRoleOptions();
});
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">User</h1>
          <p class="text-muted-foreground">Daftar pengguna dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Users</CardTitle>
          <CardDescription>List of users dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data user'" @retry="fetchData" />

          <!-- Data Table -->
          <DataTable
            v-else
            :data="items"
            :columns="columns"
            :searchable="true"
            :pagination="true"
            :page-size="pagination.per_page"
            :total-data="pagination.total"
            :total-pages="pagination.last_page"
            :loading="isLoading"
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
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :user="dialog.state.value.data"
        :role-options="roleOptions"
        @success="handleUserDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus User"
        :description="`Apakah Anda yakin ingin menghapus user '${confirmDialog.state.value.data?.fullName}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
