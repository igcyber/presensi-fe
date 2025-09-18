<script setup lang="ts">
import { ArrowLeft, Calendar, ExternalLink, Globe, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { PortalMenu } from "@/lib/api/types/portal.types";

interface Props {
  portalMenu: PortalMenu;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", portalMenu: PortalMenu): void;
  (e: "delete", portalMenu: PortalMenu): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();

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
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-6 p-4">
    <!-- Back Button (Optional) -->
    <div v-if="showBackButton" class="flex items-center">
      <Button variant="ghost" size="sm" @click="handleBack" class="gap-2 px-0">
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </Button>
    </div>

    <!-- Header Card -->
    <Card>
      <CardHeader class="space-y-4">
        <!-- Title -->
        <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
          {{ portalMenu.judul }}
        </CardTitle>

        <!-- Meta Information -->
        <div class="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
          <!-- Creator -->
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">
                {{ creatorInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex items-center gap-1">
              <User class="h-4 w-4" />
              <span class="truncate">{{ portalMenu.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(portalMenu.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :portalMenu="portalMenu" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Portal Info Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Globe class="h-5 w-5" />
          Informasi Portal
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Portal Link Info -->
        <div class="bg-muted/50 rounded-lg p-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <Globe class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-wrap">{{ portalMenu.judul }}</p>
                <p class="text-muted-foreground text-sm">{{ portalMenu.link || "#" }}</p>
              </div>
            </div>
            <div class="flex flex-row gap-2" v-if="portalMenu.link && portalMenu.link !== '#'">
              <Button @click="handleOpenPortal(portalMenu.link)" class="gap-2 sm:w-auto">
                <ExternalLink class="h-4 w-4" />
                <span class="hidden sm:inline">Buka Portal</span>
                <span class="sm:hidden">Buka</span>
              </Button>
            </div>
          </div>
        </div>

        <!-- Portal Icon -->
        <div v-if="portalMenu.icon && portalMenu.iconUrl" class="flex justify-center">
          <div class="relative overflow-hidden rounded-lg border" style="width: 120px; height: 120px">
            <img :src="portalMenu.iconUrl" :alt="portalMenu.judul" class="h-full w-full object-cover" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Categories Card -->
    <Card v-if="portalMenu.portalMenuKats && portalMenu.portalMenuKats.length > 0">
      <CardHeader>
        <CardTitle class="text-xl">Kategori</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="flex flex-wrap gap-2">
          <Badge v-for="kat in portalMenu.portalMenuKats" :key="kat.id" variant="secondary">
            {{ kat.judul }}
          </Badge>
        </div>
      </CardContent>
    </Card>

    <!-- Sub Menus Card -->
    <Card v-if="portalMenu.portalMenuSubs && portalMenu.portalMenuSubs.length > 0">
      <CardHeader>
        <CardTitle class="text-xl">Sub Menu</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="sub in portalMenu.portalMenuSubs"
            :key="sub.id"
            class="flex items-center justify-between rounded-lg border p-3"
          >
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                <Globe class="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-wrap">{{ sub.judul }}</p>
                <p class="text-muted-foreground text-sm">{{ sub.link }}</p>
              </div>
            </div>
            <Button
              v-if="sub.link && sub.link !== '#'"
              variant="outline"
              size="sm"
              @click="handleOpenPortalSub(sub.link)"
              class="gap-2"
            >
              <ExternalLink class="h-4 w-4" />
              <span class="hidden sm:inline">Buka</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Footer Information -->
    <Card class="bg-muted/50">
      <CardContent>
        <div class="grid gap-4 text-sm sm:grid-cols-2">
          <!-- Created Info -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Informasi Pembuatan</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Dibuat oleh:</span>
                {{ portalMenu.createdByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(portalMenu.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="portalMenu.updatedAt && portalMenu.updatedAt !== portalMenu.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ portalMenu.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
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
