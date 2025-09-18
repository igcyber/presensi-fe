<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PortalDialog from "@/components/dialogs/PortalDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Column, DataTable } from "@/components/ui/datatable";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFormatters } from "@/composables/useFormatters";
import { useResourceList } from "@/composables/useResourceList";
import { deletePortalMenu, getPortalMenus } from "@/lib/api/services/portal";
import type { PortalMenu } from "@/lib/api/types/portal.types";

// Composables initialization
const {
  items,
  isLoading,
  isError,
  error,
  pagination,
  query,
  fetchData,
  handleSearch,
  handlePageChange,
  handleCustomFilter,
} = useResourceList<PortalMenu>((params) => getPortalMenus(params), { perPage: 10, searchDebounce: 500 });

const dialog = useDialog<PortalMenu>();
const confirmDialog = useDialog<PortalMenu>();
const router = useRouter();

const { truncate } = useFormatters();

// Column definitions
const columns: Column<PortalMenu>[] = [
  {
    key: "judul",
    label: "Judul Portal",
    sortable: true,
    searchable: true,
    width: "200px",
  },
  {
    key: "link",
    label: "Link",
    sortable: false,
    width: "200px",
    render: (item: PortalMenu): string => {
      const link = item.link || "";
      return link === "#" ? "Menu Parent" : truncate(link, 30);
    },
  },
  {
    key: "portalMenuKats",
    label: "Kategori",
    sortable: false,
    width: "150px",
    render: (item: PortalMenu): string => {
      const count = item.portalMenuKats?.length || 0;
      return count > 0 ? `${count} kategori` : "Tidak ada";
    },
  },
  {
    key: "portalMenuSubs",
    label: "Sub Menu",
    sortable: false,
    width: "150px",
    render: (item: PortalMenu): string => {
      const count = item.portalMenuSubs?.length || 0;
      return count > 0 ? `${count} sub menu` : "Tidak ada";
    },
  },
  {
    key: "createdByUser",
    label: "Pembuat",
    sortable: false,
    width: "150px",
    render: (item: PortalMenu): string => item.createdByUser?.fullName || "Unknown",
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    width: "150px",
  },
];

// Event handlers
const openCreateDialog = (): void => {
  dialog.openCreate();
};

const handleRowClick = (item: PortalMenu): void => {
  router.push({ name: "app.portal.detail", params: { id: item.id.toString() } });
};

const handleEdit = (item: PortalMenu): void => {
  dialog.openEdit(item);
};

const handleDelete = (item: PortalMenu): void => {
  confirmDialog.openView(item);
};

const confirmDelete = async (): Promise<void> => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const portalMenu = confirmDialog.state.value.data;

    await deletePortalMenu(portalMenu.id);
    fetchData();

    toast.success("Berhasil menghapus portal menu", {
      description: `Portal menu "${portalMenu.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus portal menu";
    toast.error("Gagal menghapus portal menu", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePortalDialogSuccess = (): void => {
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
          <h1 class="text-3xl font-bold tracking-tight">Portal</h1>
          <p class="text-muted-foreground">Daftar portal menu dengan fitur pencarian, pengurutan, dan paginasi</p>
        </div>
        <Button @click="openCreateDialog" class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
      </div>

      <Card>
        <CardHeader class="px-8">
          <CardTitle>Portal</CardTitle>
          <CardDescription>List daftar portal menu dengan fitur pencarian, sorting, dan pagination</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Error State -->
          <ErrorState v-if="isError" :message="error?.message || 'Gagal memuat data portal'" @retry="fetchData" />

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
            @custom-filter="handleCustomFilter"
            @row-click="handleRowClick"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </CardContent>
      </Card>

      <!-- Portal Dialog -->
      <PortalDialog
        v-model:open="dialog.state.value.open"
        :mode="dialog.state.value.mode"
        :portal-menu="dialog.state.value.data"
        widthClass="sm:max-w-[600px]"
        @success="handlePortalDialogSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Portal Menu"
        :description="`Apakah Anda yakin ingin menghapus portal menu '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
