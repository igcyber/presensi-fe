<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, Calendar, FileCode, FileText, ListTree, User } from "lucide-vue-next";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Page } from "@/lib/api/types/page.types";

interface Props {
  page: Page;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", page: Page): void;
  (e: "delete", page: Page): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();
const router = useRouter();

// Computed properties
const creatorInitials = computed(() => {
  const name = props.page.creator?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const tipeConfig = computed(() => {
  const configs = {
    page: {
      label: "Page",
      icon: FileText,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    file: {
      label: "File",
      icon: FileCode,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
  };
  return configs[props.page.tipe] || configs.page;
});

const isPageType = computed(() => {
  return props.page.tipe === "page";
});

const hasMenu = computed(() => {
  return props.page.menu !== null;
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.page);
};

const handleDelete = () => {
  emit("delete", props.page);
};

const navigateToMenu = () => {
  if (props.page.menu) {
    router.push({ name: "app.menu.detail", params: { id: props.page.menu.id.toString() } });
  }
};
</script>

<template>
  <div class="container mx-auto max-w-5xl space-y-6 p-4">
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
        <div class="flex items-start gap-3">
          <div class="bg-primary/10 rounded-lg p-2">
            <component :is="tipeConfig.icon" class="text-primary h-6 w-6" />
          </div>
          <div class="flex-1">
            <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
              {{ page.nama }}
            </CardTitle>
            <p class="text-muted-foreground mt-1 text-sm">{{ page.slug }}</p>
          </div>
        </div>

        <!-- Meta Information -->
        <div
          class="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
        >
          <!-- Creator -->
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">
                {{ creatorInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex items-center gap-1">
              <User class="h-4 w-4" />
              <span class="truncate">{{ page.creator?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Tipe -->
          <div class="flex items-center gap-2">
            <div :class="['rounded-lg p-1', tipeConfig.color]">
              <component :is="tipeConfig.icon" class="h-4 w-4" />
            </div>
            <Badge variant="secondary" class="truncate">{{ tipeConfig.label }}</Badge>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(page.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :page="page" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Menu Info Card (if menu exists) -->
    <Card v-if="hasMenu" class="cursor-pointer transition-all hover:shadow-md" @click="navigateToMenu">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <ListTree class="h-5 w-5" />
            Menu Terkait
          </CardTitle>
          <ArrowUpRight class="text-muted-foreground h-4 w-4" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="bg-muted/50 space-y-2 rounded-lg p-4">
          <h3 class="font-semibold">{{ page.menu?.nama }}</h3>
          <p v-if="page.menu?.url" class="text-muted-foreground font-mono text-xs">
            {{ page.menu?.url }}
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Content Card (for page type) -->
    <Card v-if="isPageType && page.content">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <component :is="tipeConfig.icon" class="h-5 w-5" />
          Content
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="prose prose-sm dark:prose-invert max-w-none">
          <div v-html="page.content"></div>
        </div>
      </CardContent>
    </Card>

    <!-- File Type Info (for file type) -->
    <Card v-else-if="!isPageType">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileCode class="h-5 w-5" />
          File Type
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="bg-muted/50 rounded-lg p-6 text-center">
          <FileCode class="text-muted-foreground mx-auto mb-3 h-12 w-12 opacity-50" />
          <p class="text-muted-foreground text-sm">Page dengan tipe File</p>
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
                {{ page.creator?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(page.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="page.updatedAt && page.updatedAt !== page.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ page.updater?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(page.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
