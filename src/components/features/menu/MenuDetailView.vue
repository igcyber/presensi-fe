<script setup lang="ts">
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderTree,
  Link,
  ListTree,
  User,
  Users,
} from "lucide-vue-next";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Menu } from "@/lib/api/types/menu.types";
import type { Page } from "@/lib/api/types/page.types";

interface Props {
  menu: Menu;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", menu: Menu): void;
  (e: "delete", menu: Menu): void;
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
  const name = props.menu.creator?.fullName || "System";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const menuPage = computed(() => {
  return (props.menu.page as Page) ?? null;
});

const hasPage = computed(() => {
  return props.menu.page !== null && props.menu.page !== undefined;
});

const hasParent = computed(() => {
  return props.menu.parent !== null;
});

const hasChildren = computed(() => {
  return props.menu.children && props.menu.children.length > 0;
});

const childrenCount = computed(() => {
  return props.menu.children?.length || 0;
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.menu);
};

const handleDelete = () => {
  emit("delete", props.menu);
};

const navigateToParent = () => {
  if (props.menu.parent) {
    router.push({ name: "app.menu.detail", params: { id: props.menu.parent.id.toString() } });
  }
};

const navigateToChild = (childId: number) => {
  router.push({ name: "app.menu.detail", params: { id: childId.toString() } });
};

const navigateToPage = (pageId: number) => {
  router.push({ name: "app.pages.detail", params: { id: pageId.toString() } });
};

// Helper function to strip HTML
const stripHtml = (html: string): string => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
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

    <!-- Parent Menu (if exists) -->
    <Card
      v-if="hasParent"
      class="border-primary/20 bg-primary/5 cursor-pointer transition-all hover:shadow-md"
      @click="navigateToParent"
    >
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FolderTree class="text-primary h-5 w-5" />
            <Badge variant="secondary" class="text-xs">Parent Menu</Badge>
          </div>
          <ArrowUpRight class="text-muted-foreground h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="flex items-center gap-2">
          <ChevronRight class="text-muted-foreground h-4 w-4" />
          <h3 class="font-semibold">{{ menu.parent?.nama }}</h3>
        </div>
        <p v-if="menu.parent?.url" class="text-muted-foreground pl-6 font-mono text-xs">
          {{ menu.parent?.url }}
        </p>
      </CardContent>
    </Card>

    <!-- Header Card -->
    <Card>
      <CardHeader class="space-y-4">
        <!-- Title -->
        <div class="flex items-start gap-3">
          <div class="bg-primary/10 rounded-lg p-2">
            <ListTree class="text-primary h-6 w-6" />
          </div>
          <div class="flex-1">
            <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
              {{ menu.nama }}
            </CardTitle>
            <p class="text-muted-foreground mt-1 text-sm">{{ menu.slug }}</p>
          </div>
        </div>

        <!-- Meta Information -->
        <div
          class="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
        >
          <!-- Creator -->
          <div v-if="menu.creator" class="flex items-center gap-2">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">
                {{ creatorInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex items-center gap-1">
              <User class="h-4 w-4" />
              <span class="truncate">{{ menu.creator?.fullName || "System" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(menu.createdAt) }}</span>
          </div>

          <!-- Children Count -->
          <div v-if="hasChildren" class="flex items-center gap-1">
            <Users class="h-4 w-4" />
            <Badge variant="outline" class="truncate">{{ childrenCount }} Sub Menu</Badge>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :menu="menu" :on-edit="handleEdit" :on-delete="handleDelete">
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
          <Link class="h-5 w-5" />
          URL Menu
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="bg-muted/50 rounded-lg p-4">
          <div v-if="menu.url" class="flex items-center gap-3">
            <div class="bg-primary/10 rounded-md p-2">
              <ExternalLink class="text-primary h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <dt class="text-muted-foreground mb-1 text-xs font-medium">Path URL</dt>
              <dd class="font-mono text-sm break-all">{{ menu.url }}</dd>
            </div>
          </div>
          <div v-else class="text-muted-foreground flex items-center gap-2 text-sm">
            <ExternalLink class="h-4 w-4" />
            <span>Tidak ada URL yang ditetapkan</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Page Section -->
    <Card v-if="hasPage">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileText class="h-5 w-5" />
          Page
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <Card
          class="hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
          @click="navigateToPage(menuPage.id)"
        >
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 rounded-md p-1.5">
                  <FileText class="text-primary h-4 w-4" />
                </div>
                <div class="flex-1 space-y-1">
                  <h4 class="line-clamp-1 text-sm font-semibold">{{ menuPage.nama }}</h4>
                  <Badge :variant="menuPage.tipe === 'page' ? 'default' : 'secondary'" class="text-xs">
                    {{ menuPage.tipe === "page" ? "Page" : "File" }}
                  </Badge>
                </div>
              </div>
              <ArrowUpRight class="text-muted-foreground h-4 w-4 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <p v-if="menuPage.content" class="text-muted-foreground line-clamp-2 text-xs">
              {{ stripHtml(menuPage.content).substring(0, 80) }}...
            </p>
            <p v-else class="text-muted-foreground text-xs italic">No content</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>

    <!-- Children Menus (if exists) -->
    <Card v-if="hasChildren">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <Users class="h-5 w-5" />
            Sub Menu
          </CardTitle>
          <Badge variant="secondary">{{ childrenCount }}</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="child in menu.children"
            :key="child.id"
            class="hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
            @click="navigateToChild(child.id)"
          >
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="bg-primary/10 rounded-md p-1.5">
                    <ListTree class="text-primary h-4 w-4" />
                  </div>
                  <h4 class="line-clamp-1 text-sm font-semibold">{{ child.nama }}</h4>
                </div>
                <ArrowUpRight class="text-muted-foreground h-4 w-4 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <p v-if="child.url" class="text-muted-foreground line-clamp-1 font-mono text-xs">
                {{ child.url }}
              </p>
              <p v-else class="text-muted-foreground text-xs italic">No URL</p>
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
                {{ menu.creator?.fullName || "System" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(menu.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="menu.updatedAt && menu.updatedAt !== menu.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ menu.updater?.fullName || "System" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(menu.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
