<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, Briefcase, Calendar, FolderTree, User, UserCircle, Users } from "lucide-vue-next";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { JabatanAnggota } from "@/lib/api/types/jabatanAnggota.types";

interface Props {
  jabatanAnggota: JabatanAnggota;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", jabatanAnggota: JabatanAnggota): void;
  (e: "delete", jabatanAnggota: JabatanAnggota): void;
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
  const name = props.jabatanAnggota.creator?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const nameInitials = computed(() => {
  const name = props.jabatanAnggota.nama || "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const hasParentAnggota = computed(() => {
  return props.jabatanAnggota.anggota !== null;
});

const hasChildren = computed(() => {
  return props.jabatanAnggota.anggotaChild && props.jabatanAnggota.anggotaChild.length > 0;
});

const childrenCount = computed(() => {
  return props.jabatanAnggota.anggotaChild?.length || 0;
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.jabatanAnggota);
};

const handleDelete = () => {
  emit("delete", props.jabatanAnggota);
};

const navigateToParentAnggota = () => {
  if (props.jabatanAnggota.anggota) {
    router.push({ name: "app.jabatan-anggota.detail", params: { id: props.jabatanAnggota.anggota.id.toString() } });
  }
};

const navigateToChild = (childId: number) => {
  router.push({ name: "app.jabatan-anggota.detail", params: { id: childId.toString() } });
};

const navigateToStruktur = () => {
  if (props.jabatanAnggota.struktur) {
    router.push({ name: "app.struktur.detail", params: { id: props.jabatanAnggota.struktur.id.toString() } });
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

    <!-- Parent Anggota (if exists) -->
    <Card
      v-if="hasParentAnggota"
      class="border-primary/20 bg-primary/5 cursor-pointer transition-all hover:shadow-md"
      @click="navigateToParentAnggota"
    >
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UserCircle class="text-primary h-5 w-5" />
            <Badge variant="secondary" class="text-xs">Parent Anggota</Badge>
          </div>
          <ArrowUpRight class="text-muted-foreground h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="flex items-center gap-3">
          <Avatar class="h-12 w-12">
            <AvatarImage :src="jabatanAnggota.anggota?.fotoUrl || ''" :alt="jabatanAnggota.anggota?.nama || ''" />
            <AvatarFallback>
              {{ jabatanAnggota.anggota?.nama?.slice(0, 2).toUpperCase() }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 space-y-1">
            <h3 class="font-semibold">{{ jabatanAnggota.anggota?.nama }}</h3>
            <p class="text-muted-foreground text-sm">{{ jabatanAnggota.anggota?.jabatan }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Header Card -->
    <Card>
      <CardHeader class="space-y-4">
        <!-- Title with Photo -->
        <div class="flex items-start gap-4">
          <Avatar class="border-primary/20 h-20 w-20 border-2">
            <AvatarImage :src="jabatanAnggota.fotoUrl" :alt="jabatanAnggota.nama" />
            <AvatarFallback class="bg-primary/10 text-primary text-lg">
              {{ nameInitials }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 space-y-2">
            <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
              {{ jabatanAnggota.nama }}
            </CardTitle>
            <div class="flex items-center gap-2">
              <Briefcase class="text-primary h-4 w-4" />
              <Badge variant="default" class="text-sm">{{ jabatanAnggota.jabatan }}</Badge>
            </div>
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
              <span class="truncate">{{ jabatanAnggota.creator?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(jabatanAnggota.createdAt) }}</span>
          </div>

          <!-- Children Count -->
          <div v-if="hasChildren" class="flex items-center gap-1">
            <Users class="h-4 w-4" />
            <Badge variant="outline" class="truncate">{{ childrenCount }} Anggota Bawahan</Badge>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :jabatan-anggota="jabatanAnggota" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Struktur Info Card -->
    <Card class="cursor-pointer transition-all hover:shadow-md" @click="navigateToStruktur">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <FolderTree class="h-5 w-5" />
            Struktur Organisasi
          </CardTitle>
          <ArrowUpRight class="text-muted-foreground h-4 w-4" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="bg-muted/50 space-y-2 rounded-lg p-4">
          <h3 class="font-semibold">{{ jabatanAnggota.struktur?.nama }}</h3>
          <p class="text-muted-foreground line-clamp-2 text-sm">
            {{ jabatanAnggota.struktur?.tentang }}
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Children Anggota (if exists) -->
    <Card v-if="hasChildren">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <Users class="h-5 w-5" />
            Anggota Bawahan
          </CardTitle>
          <Badge variant="secondary">{{ childrenCount }}</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="child in jabatanAnggota.anggotaChild"
            :key="child.id"
            class="hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
            @click="navigateToChild(child.id)"
          >
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Avatar class="h-10 w-10">
                    <AvatarImage :src="child.fotoUrl" :alt="child.nama" />
                    <AvatarFallback class="text-xs">
                      {{ child.nama.slice(0, 2).toUpperCase() }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 space-y-1">
                    <h4 class="line-clamp-1 text-sm font-semibold">{{ child.nama }}</h4>
                    <p class="text-muted-foreground line-clamp-1 text-xs">{{ child.jabatan }}</p>
                  </div>
                </div>
                <ArrowUpRight class="text-muted-foreground h-4 w-4 flex-shrink-0" />
              </div>
            </CardHeader>
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
                {{ jabatanAnggota.creator?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(jabatanAnggota.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div
            v-if="jabatanAnggota.updatedAt && jabatanAnggota.updatedAt !== jabatanAnggota.createdAt"
            class="space-y-1"
          >
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ jabatanAnggota.updater?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(jabatanAnggota.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
