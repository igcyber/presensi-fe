<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import RoleDialog from "@/components/dialogs/RoleDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useResourceList } from "@/composables/useResourceList";
import { deleteRole, getRoles } from "@/lib/api/services/role";
import type { Role } from "@/lib/api/types/role.types";

// Composables
const router = useRouter();

const { items, isLoading, isError, error, pagination, query, fetchData, handlePageChange } = useResourceList<Role>(
  (params) => getRoles(params),
  { perPage: 10 },
);

const dialog = useDialog<Role>();
const confirmDialog = useDialog<Role>();

// Column definitions
const columns: Column<Role>[] = [
  {
    key: "name",
    label: "Nama Role",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "150px",
  },
  {
    key: "updatedAt",
    label: "Diperbarui",
    sortable: true,
    width: "150px",
  },
];

// Methods
const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: Role): void => {
  router.push({ name: "app.role.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: Role): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: Role): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    await deleteRole(confirmDialog.state.value.data.id);

    fetchData();

    toast.success("Berhasil", {
      description: "Role berhasil dihapus",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus role";

    toast.error("Gagal", {
      description: errorMessage,
    });
  } finally {
    confirmDialog.setLoading(false);
    confirmDialog.closeDialog();
  }
};

const handleRoleDialogSuccess = (): void => {
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
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Role</h1>
          <p class="text-muted-foreground">Daftar role dengan fitur pengurutan dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Roles</CardTitle>
          <CardDescription>List daftar roles dengan fitur sorting dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data role'" @retry="fetchData" />

          <!-- Data Table -->
          <DataTable
            v-else
            :data="items"
            :columns="columns"
            :searchable="false"
            :pagination="true"
            :page-size="pagination.per_page"
            :total-data="pagination.total"
            :total-pages="pagination.last_page"
            :loading="isLoading"
            @page-change="handlePageChange"
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </CardContent>
      </Card>

      <!-- Role Dialog -->
      <RoleDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :role="dialog.state.value.data"
        @success="handleRoleDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Role"
        :description="`Apakah Anda yakin ingin menghapus role '${confirmDialog.state.value.data?.name}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
