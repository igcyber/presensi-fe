<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, Calendar, ChevronRight, Folder, FolderTree, User, Users } from "lucide-vue-next";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Struktur } from "@/lib/api/types/struktur.types";

interface Props {
  struktur: Struktur;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", struktur: Struktur): void;
  (e: "delete", struktur: Struktur): void;
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
  const name = props.struktur.creator?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const hasParent = computed(() => {
  return props.struktur.parent !== null;
});

const hasChildren = computed(() => {
  return props.struktur.children && props.struktur.children.length > 0;
});

const childrenCount = computed(() => {
  return props.struktur.children?.length || 0;
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.struktur);
};

const handleDelete = () => {
  emit("delete", props.struktur);
};

const navigateToParent = () => {
  if (props.struktur.parent) {
    router.push({ name: "app.struktur.detail", params: { id: props.struktur.parent.id.toString() } });
  }
};

const navigateToChild = (childId: number) => {
  router.push({ name: "app.struktur.detail", params: { id: childId.toString() } });
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

    <!-- Parent Structure (if exists) -->
    <Card
      v-if="hasParent"
      class="border-primary/20 bg-primary/5 cursor-pointer transition-all hover:shadow-md"
      @click="navigateToParent"
    >
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FolderTree class="text-primary h-5 w-5" />
            <Badge variant="secondary" class="text-xs">Parent Structure</Badge>
          </div>
          <ArrowUpRight class="text-muted-foreground h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="flex items-center gap-2">
          <ChevronRight class="text-muted-foreground h-4 w-4" />
          <h3 class="font-semibold">{{ struktur.parent?.nama }}</h3>
        </div>
        <p class="text-muted-foreground line-clamp-2 pl-6 text-sm">
          {{ struktur.parent?.tentang }}
        </p>
      </CardContent>
    </Card>

    <!-- Header Card -->
    <Card>
      <CardHeader class="space-y-4">
        <!-- Title -->
        <div class="flex items-start gap-3">
          <div class="bg-primary/10 rounded-lg p-2">
            <Folder class="text-primary h-6 w-6" />
          </div>
          <div class="flex-1">
            <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
              {{ struktur.nama }}
            </CardTitle>
            <p class="text-muted-foreground mt-1 text-sm">{{ struktur.slug }}</p>
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
              <span class="truncate">{{ struktur.creator?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(struktur.createdAt) }}</span>
          </div>

          <!-- Children Count -->
          <div v-if="hasChildren" class="flex items-center gap-1">
            <Users class="h-4 w-4" />
            <Badge variant="outline" class="truncate">{{ childrenCount }} Sub Struktur</Badge>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :struktur="struktur" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Content Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Folder class="h-5 w-5" />
          Tentang Struktur
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="pt-6">
        <div class="bg-muted/50 rounded-lg p-4">
          <p class="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {{ struktur.tentang }}
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Children Structures (if exists) -->
    <Card v-if="hasChildren">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <Users class="h-5 w-5" />
            Sub Struktur
          </CardTitle>
          <Badge variant="secondary">{{ childrenCount }}</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent class="pt-6">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="child in struktur.children"
            :key="child.id"
            class="hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
            @click="navigateToChild(child.id)"
          >
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="bg-primary/10 rounded-md p-1.5">
                    <Folder class="text-primary h-4 w-4" />
                  </div>
                  <h4 class="line-clamp-1 text-sm font-semibold">{{ child.nama }}</h4>
                </div>
                <ArrowUpRight class="text-muted-foreground h-4 w-4 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground line-clamp-2 text-xs">
                {{ child.tentang }}
              </p>
            </CardContent>
          </Card>
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
                {{ struktur.creator?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(struktur.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="struktur.updatedAt && struktur.updatedAt !== struktur.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ struktur.updater?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(struktur.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
