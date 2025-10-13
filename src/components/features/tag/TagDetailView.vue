<script setup lang="ts">
import { ArrowLeft, Calendar, Tag as TagIcon, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { Tag } from "@/lib/api/types/tag.types";

interface Props {
  tag: Tag;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", tag: Tag): void;
  (e: "delete", tag: Tag): void;
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
  const name = props.tag.creator?.fullName || "Unknown";
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
  emit("edit", props.tag);
};

const handleDelete = () => {
  emit("delete", props.tag);
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
            <TagIcon class="text-primary h-6 w-6" />
          </div>
          <div class="flex-1">
            <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
              {{ tag.namaTag }}
            </CardTitle>
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
              <span class="truncate">{{ tag.creator?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(tag.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :tag="tag" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
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
                {{ tag.creator?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(tag.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="tag.updatedAt && tag.updatedAt !== tag.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ tag.updater?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(tag.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
