<script setup lang="ts">
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit,
  ExternalLink,
  Globe,
  Plus,
  Trash2,
  User,
} from "lucide-vue-next";
import { computed, ref } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useFormatters } from "@/composables/useFormatters";
import type { PortalMenu, PortalMenuKat, PortalMenuSub } from "@/lib/api/types/portal.types";

interface Props {
  portalMenu: PortalMenu;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", portalMenu: PortalMenu): void;
  (e: "delete", portalMenu: PortalMenu): void;
  (e: "add-kat"): void;
  (e: "edit-kat", kat: PortalMenuKat): void;
  (e: "delete-kat", kat: PortalMenuKat): void;
  (e: "add-sub", katId: number): void;
  (e: "edit-sub", sub: PortalMenuSub): void;
  (e: "delete-sub", sub: PortalMenuSub): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();

// State
const expandedKats = ref<Set<number>>(new Set());

// Computed properties
const creatorInitials = computed(() => {
  const name = props.portalMenu.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const totalSubs = computed(() => {
  return props.portalMenu.portalMenuKats?.reduce((total, kat) => total + (kat.portalMenuSubs?.length || 0), 0) || 0;
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.portalMenu);
};

const handleDelete = () => {
  emit("delete", props.portalMenu);
};

const handleOpenPortal = (link: string) => {
  if (link && link !== "#") {
    window.open(link, "_blank");
  }
};

const handleOpenPortalSub = (link: string) => {
  if (link && link !== "#") {
    window.open(link, "_blank");
  }
};

// Accordion methods
const toggleKat = (katId: number) => {
  if (expandedKats.value.has(katId)) {
    expandedKats.value.delete(katId);
  } else {
    expandedKats.value.add(katId);
  }
};

const isKatExpanded = (katId: number) => {
  return expandedKats.value.has(katId);
};

// Event handlers for nested actions
const handleAddKat = () => {
  emit("add-kat");
};

const handleEditKat = (kat: PortalMenuKat) => {
  emit("edit-kat", kat);
};

const handleDeleteKat = (kat: PortalMenuKat) => {
  emit("delete-kat", kat);
};

const handleAddSub = (katId: number) => {
  emit("add-sub", katId);
};

const handleEditSub = (sub: PortalMenuSub) => {
  emit("edit-sub", sub);
};

const handleDeleteSub = (sub: PortalMenuSub) => {
  emit("delete-sub", sub);
};
</script>

<template>
  <div class="container mx-auto max-w-6xl space-y-6 p-4 lg:p-6">
    <!-- Back Button (Optional) -->
    <div v-if="showBackButton" class="flex items-center">
      <Button variant="ghost" size="sm" @click="handleBack" class="gap-2 px-0 hover:bg-transparent">
        <ArrowLeft class="h-4 w-4" />
        <span class="hidden sm:inline">Kembali</span>
      </Button>
    </div>

    <!-- Header Card -->
    <Card class="shadow-sm">
      <CardHeader class="space-y-4 pb-4">
        <!-- Title -->
        <CardTitle class="text-xl leading-tight font-bold sm:text-2xl lg:text-3xl">
          {{ portalMenu.judul }}
        </CardTitle>

        <!-- Meta Information -->
        <div class="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
          <!-- Creator -->
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6 flex-shrink-0">
              <AvatarFallback class="text-xs">
                {{ creatorInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex min-w-0 items-center gap-1">
              <User class="h-4 w-4 flex-shrink-0" />
              <span class="truncate">{{ portalMenu.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4 flex-shrink-0" />
            <span class="truncate">{{ date(portalMenu.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2 pt-2">
          <slot name="actions" :portalMenu="portalMenu" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions -->
            <Button variant="outline" size="sm" @click="handleEdit" class="gap-2">
              <Edit class="h-4 w-4" />
              <span class="hidden sm:inline">Edit</span>
            </Button>
            <Button variant="destructive" size="sm" @click="handleDelete" class="gap-2">
              <Trash2 class="h-4 w-4" />
              <span class="hidden sm:inline">Hapus</span>
            </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Portal Info Card -->
    <Card class="shadow-sm">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg">
          <Globe class="h-5 w-5" />
          Informasi Portal
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4 pt-4">
        <!-- Portal Link Info -->
        <div class="bg-muted/50 rounded-lg p-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 flex-1 items-center gap-3">
              <div class="flex-shrink-0 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <Globe class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium break-words">{{ portalMenu.judul }}</p>
                <p class="text-muted-foreground text-sm break-all">{{ portalMenu.link || "#" }}</p>
              </div>
            </div>
            <div class="flex flex-shrink-0" v-if="portalMenu.link && portalMenu.link !== '#'">
              <Button @click="handleOpenPortal(portalMenu.link)" class="w-full gap-2 sm:w-auto">
                <ExternalLink class="h-4 w-4" />
                <span class="hidden sm:inline">Buka Portal</span>
                <span class="sm:hidden">Buka</span>
              </Button>
            </div>
          </div>
        </div>

        <!-- Portal Icon -->
        <div v-if="portalMenu.icon && portalMenu.iconUrl" class="flex justify-center">
          <div class="relative overflow-hidden rounded-lg border shadow-sm" style="width: 120px; height: 120px">
            <img :src="portalMenu.iconUrl" :alt="portalMenu.judul" class="h-full w-full object-cover" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Nested Table Card -->
    <Card v-if="portalMenu.portalMenuKats && portalMenu.portalMenuKats.length > 0" class="shadow-sm">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle class="flex items-center gap-2 text-lg">
            <Globe class="h-5 w-5" />
            Struktur Portal
          </CardTitle>
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="outline" class="text-xs">{{ portalMenu.portalMenuKats.length }} Kategori</Badge>
            <Badge variant="outline" class="text-xs">{{ totalSubs }} Sub Menu</Badge>
            <Button size="sm" @click="handleAddKat" class="gap-2">
              <Plus class="h-4 w-4" />
              <span class="hidden sm:inline">Tambah Kategori</span>
              <span class="sm:hidden">Tambah</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead class="w-12"></TableHead>
                <TableHead class="min-w-[200px]">Nama</TableHead>
                <TableHead class="hidden w-24 sm:table-cell">Jumlah Sub</TableHead>
                <TableHead class="hidden w-32 md:table-cell">Dibuat</TableHead>
                <TableHead class="w-32">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-for="kat in portalMenu.portalMenuKats" :key="kat.id">
                <!-- Kategori Row -->
                <TableRow class="bg-muted/30 hover:bg-muted/50 transition-colors">
                  <TableCell class="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="toggleKat(kat.id)"
                      class="hover:bg-muted h-8 w-8 p-0"
                      :disabled="!kat.portalMenuSubs || kat.portalMenuSubs.length === 0"
                    >
                      <ChevronRight v-if="!isKatExpanded(kat.id)" class="h-4 w-4 transition-transform" />
                      <ChevronDown v-else class="h-4 w-4 transition-transform" />
                    </Button>
                  </TableCell>
                  <TableCell class="p-3">
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0 rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                        <Globe class="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="font-medium break-words">{{ kat.judul }}</p>
                        <p class="text-muted-foreground text-sm">Kategori</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell class="hidden p-3 sm:table-cell">
                    <Badge variant="secondary" class="text-xs">{{ kat.portalMenuSubs?.length || 0 }} Sub</Badge>
                  </TableCell>
                  <TableCell class="hidden p-3 md:table-cell">
                    <span class="text-muted-foreground text-sm">{{ date(kat.createdAt) }}</span>
                  </TableCell>
                  <TableCell class="p-3">
                    <div class="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="handleAddSub(kat.id)"
                        class="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                        title="Tambah Sub Menu"
                      >
                        <Plus class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="handleEditKat(kat)"
                        class="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        title="Edit Kategori"
                      >
                        <Edit class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="handleDeleteKat(kat)"
                        class="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        title="Hapus Kategori"
                      >
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                <!-- Sub Menu Rows -->
                <template v-if="isKatExpanded(kat.id) && kat.portalMenuSubs && kat.portalMenuSubs.length > 0">
                  <template v-for="sub in kat.portalMenuSubs" :key="sub.id">
                    <TableRow
                      class="hover:bg-muted/30 !border-l-4 border-l-green-200 transition-colors dark:border-l-green-800"
                    >
                      <TableCell class="p-2"></TableCell>
                      <TableCell class="p-3">
                        <div class="flex items-center gap-3 pl-4">
                          <div class="flex-shrink-0 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                            <ExternalLink class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div class="min-w-0 flex-1">
                            <p class="font-medium break-words">{{ sub.judul }}</p>
                            <p class="text-muted-foreground text-sm break-all">{{ sub.link }}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell class="hidden p-3 sm:table-cell">
                        <Badge variant="outline" class="text-xs">Sub Menu</Badge>
                      </TableCell>
                      <TableCell class="hidden p-3 md:table-cell">
                        <span class="text-muted-foreground text-sm">{{ date(sub.createdAt) }}</span>
                      </TableCell>
                      <TableCell class="p-3">
                        <div class="flex items-center gap-1">
                          <Button
                            v-if="sub.link && sub.link !== '#'"
                            variant="ghost"
                            size="sm"
                            @click="handleOpenPortalSub(sub.link)"
                            class="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                            title="Buka Link"
                          >
                            <ExternalLink class="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="handleEditSub(sub)"
                            class="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                            title="Edit Sub Menu"
                          >
                            <Edit class="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="handleDeleteSub(sub)"
                            class="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                            title="Hapus Sub Menu"
                          >
                            <Trash2 class="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </template>
                </template>
              </template>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <Card v-else class="shadow-sm">
      <CardContent class="p-8 text-center">
        <div class="text-muted-foreground space-y-4">
          <Globe class="mx-auto h-12 w-12 opacity-50" />
          <div class="space-y-2">
            <p class="text-sm">Belum ada kategori dalam portal ini</p>
            <p class="text-muted-foreground/70 text-xs">Mulai dengan menambahkan kategori pertama</p>
          </div>
          <Button @click="handleAddKat" class="mt-4 gap-2">
            <Plus class="h-4 w-4" />
            Tambah Kategori Pertama
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Footer Information -->
    <Card class="bg-muted/30 shadow-sm">
      <CardContent class="p-4 lg:p-6">
        <div class="grid gap-4 text-sm sm:grid-cols-2 lg:gap-6">
          <!-- Created Info -->
          <div class="space-y-2">
            <p class="text-foreground font-medium">Informasi Pembuatan</p>
            <div class="text-muted-foreground space-y-1">
              <p class="break-words">
                <span class="font-medium">Dibuat oleh:</span>
                {{ portalMenu.createdByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(portalMenu.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="portalMenu.updatedAt && portalMenu.updatedAt !== portalMenu.createdAt" class="space-y-2">
            <p class="text-foreground font-medium">Informasi Pembaruan</p>
            <div class="text-muted-foreground space-y-1">
              <p class="break-words">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ portalMenu.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(portalMenu.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
