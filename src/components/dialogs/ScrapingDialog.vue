<script setup lang="ts">
import { CheckSquare, Loader2, Play, RotateCcw, Send, Square } from "lucide-vue-next";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// remove checkbox; use Button toggles instead
import { Separator } from "@/components/ui/separator";

import {
  commitScrapingResult,
  getScrapingResult,
  getScrapingStatus,
  startScrapingWarta,
} from "@/lib/api/services/scraping";
import type { ScrapedItem } from "@/lib/api/services/scraping";
import { getTags } from "@/lib/api/services/tag";
import type { Tag } from "@/lib/api/types/tag.types";

interface Props {
  open: boolean;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const open = computed({
  get: () => props.open,
  set: (v: boolean) => emit("update:open", v),
});

// State
const step = ref<1 | 2 | 3>(1);
const taskId = ref<string>("");
const status = ref<"pending" | "running" | "done" | "failed" | "idle">("idle");
const progress = ref<number | null>(null);
const processed = ref<number | null>(null);
const total = ref<number | null>(null);
const pollingId = ref<number | null>(null);
const isStarting = ref(false);
const isCommitting = ref(false);

const results = ref<ScrapedItem[]>([]);
const selectedUrlSet = ref<Set<string>>(new Set());
const committedUrlSet = ref<Set<string>>(new Set());
const checkedMap = ref<Record<string, boolean>>({});
const MAX_PER_BATCH = 5;
const selectedCount = computed(() => selectedUrlSet.value.size);

// Tag
const tagList = ref<Tag[]>([]);
const loadingTags = ref(false);
const selectedTagIdString = ref<string | null>(null);
const tagOptions = computed(() => tagList.value.map((t) => ({ label: t.namaTag, value: String(t.id) })));

async function loadTags() {
  try {
    loadingTags.value = true;
    const res = await getTags({ limit: 100 });
    tagList.value = res.data.data;
    console.log("[ScrapingDialog] tags loaded:", tagList.value);
    // Set default tag jika belum dipilih
    if (!selectedTagIdString.value && tagList.value.length > 0) {
      selectedTagIdString.value = String(tagList.value[0].id);
      console.log("[ScrapingDialog] default tag set:", selectedTagIdString.value);
    }
  } catch {
    toast.error("Gagal memuat tags");
  } finally {
    loadingTags.value = false;
  }
}

function resetState() {
  step.value = 1;
  taskId.value = "";
  status.value = "idle";
  progress.value = null;
  processed.value = null;
  total.value = null;
  results.value = [];
  selectedUrlSet.value = new Set();
  selectedTagIdString.value = null;
  stopPolling();
}

function stopPolling() {
  if (pollingId.value) {
    clearInterval(pollingId.value);
    pollingId.value = null;
  }
}

async function startScraping() {
  try {
    isStarting.value = true;
    status.value = "pending";
    const { taskId: id } = await startScrapingWarta();
    taskId.value = id;
    step.value = 2;
    status.value = "running";
    beginPolling();
  } catch {
    status.value = "failed";
    toast.error("Gagal memulai scraping");
  } finally {
    isStarting.value = false;
  }
}

function beginPolling() {
  stopPolling();
  pollingId.value = window.setInterval(async () => {
    try {
      const s: any = await getScrapingStatus(taskId.value);
      status.value = s.status as any;
      progress.value = typeof s.progress_percent === "number" ? s.progress_percent : null;
      processed.value = typeof s.processed_links === "number" ? s.processed_links : null;
      total.value = typeof s.total_links === "number" ? s.total_links : null;
      if (s.status === "done") {
        stopPolling();
        const r = await getScrapingResult(taskId.value);
        results.value = r.data || [];
        console.log("[ScrapingDialog] results loaded:", results.value.length);
        // inisialisasi map checkbox dan seleksi kosong
        const map: Record<string, boolean> = {};
        for (const item of results.value) {
          map[item.url] = false;
        }
        checkedMap.value = map;
        selectedUrlSet.value = new Set();
        step.value = 3;
      }
      if (s.status === "failed") {
        stopPolling();
        toast.error("Scraping gagal");
      }
    } catch {
      stopPolling();
      toast.error("Gagal memeriksa status scraping");
    }
  }, 2000);
}

async function commitSelected() {
  if (!selectedTagIdString.value) {
    toast.error("Silakan pilih Tag terlebih dahulu");
    return;
  }
  const selected = results.value.filter((r) => selectedUrlSet.value.has(r.url));
  if (selected.length === 0) {
    toast.error("Pilih minimal satu item untuk di-commit");
    return;
  }
  if (selected.length > MAX_PER_BATCH) {
    toast.error(`Maksimal ${MAX_PER_BATCH} item per pengiriman`);
    return;
  }
  try {
    isCommitting.value = true;
    console.log("[ScrapingDialog] commitSelected start", {
      tagId: selectedTagIdString.value,
      selectedCount: selected.length,
      selected,
    });
    const res = await commitScrapingResult({ tag_id: Number(selectedTagIdString.value), data: selected });
    const createdCount = Array.isArray(res?.created) ? res.created.length : selected.length;
    const committedUrls = new Set(selected.map((s) => s.url));
    // tandai item yang sudah dikirim sebagai disabled
    const nextCommitted = new Set(committedUrlSet.value);
    committedUrls.forEach((u) => nextCommitted.add(u));
    committedUrlSet.value = nextCommitted;
    // hilangkan mereka dari seleksi aktif
    const nextSelected = new Set(selectedUrlSet.value);
    committedUrls.forEach((u) => nextSelected.delete(u));
    selectedUrlSet.value = nextSelected;
    console.log("[ScrapingDialog] commitSelected success", { createdCount, committedUrls: Array.from(committedUrls) });
    toast.success("Commit berhasil", { description: `${createdCount} berita dikirim` });
    // tidak menutup dialog; pengguna dapat lanjut memilih batch berikutnya
    emit("success");
  } catch {
    console.error("[ScrapingDialog] commitSelected failed");
    toast.error("Gagal commit hasil scraping");
  } finally {
    isCommitting.value = false;
  }
}

function onClose() {
  resetState();
  emit("cancel");
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetState();
      loadTags();
    } else {
      stopPolling();
    }
  },
);

onBeforeUnmount(() => stopPolling());

// Gunakan dummy schema kosong untuk memenuhi BaseFormDialog (tidak ada validasi)
const schema = z.object({});
const initialValues = {} as Record<string, unknown>;
const onSubmit = () => {};

function onToggle(url: string, nextChecked: boolean) {
  if (committedUrlSet.value.has(url)) return;
  const currentlyChecked = !!checkedMap.value[url];
  console.log("[ScrapingDialog] onToggle", {
    url,
    nextChecked,
    currentlyChecked,
    selectedCount: selectedUrlSet.value.size,
  });
  if (nextChecked && !currentlyChecked) {
    if (selectedUrlSet.value.size >= MAX_PER_BATCH) {
      // revert
      checkedMap.value[url] = false;
      toast.error(`Maksimal ${MAX_PER_BATCH} item per batch`);
      return;
    }
    checkedMap.value[url] = true;
    const next = new Set(selectedUrlSet.value);
    next.add(url);
    selectedUrlSet.value = next;
  } else if (!nextChecked && currentlyChecked) {
    checkedMap.value[url] = false;
    const next = new Set(selectedUrlSet.value);
    next.delete(url);
    selectedUrlSet.value = next;
  }
  console.log("[ScrapingDialog] selection changed", {
    selectedCount: selectedUrlSet.value.size,
    selected: Array.from(selectedUrlSet.value),
  });
}

watch(selectedUrlSet, (v) => {
  console.log("[ScrapingDialog] selectedUrlSet watch", { size: v.size, selected: Array.from(v) });
});
watch(
  checkedMap,
  (m) => {
    const selected = Object.keys(m).filter((k) => m[k]);
    console.log("[ScrapingDialog] checkedMap watch", { selectedCount: selected.length, selected });
  },
  { deep: true },
);
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    mode="view"
    resource-name="Scraping Warta"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass || 'sm:max-w-[1000px]'"
    @cancel="onClose"
  >
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tarik Berita Dari Web DPRD</CardTitle>
          <CardDescription>Mulai proses tarik berita, pantau progress, pilih hasil, lalu commit.</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Step Controls -->
          <div class="text-muted-foreground flex items-center gap-2 text-sm">
            <span :class="step >= 1 ? 'text-foreground font-medium' : ''">1. Mulai</span>
            <Separator orientation="vertical" class="h-4" />
            <span :class="step >= 2 ? 'text-foreground font-medium' : ''">2. Progres</span>
            <Separator orientation="vertical" class="h-4" />
            <span :class="step >= 3 ? 'text-foreground font-medium' : ''">3. Hasil & Commit</span>
          </div>

          <!-- Step 1: Start -->
          <div v-if="step === 1" class="mt-4">
            <Button type="button" @click="startScraping" :disabled="isStarting" class="inline-flex items-center gap-2">
              <Loader2 v-if="isStarting" class="h-4 w-4 animate-spin" />
              <Play v-else class="h-4 w-4" />
              Mulai Tarik
            </Button>
          </div>

          <!-- Step 2: Progress -->
          <div v-else-if="step === 2" class="mt-4 space-y-4">
            <div class="text-sm">
              Task ID: <span class="font-mono">{{ taskId }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span class="text-muted-foreground">Status:</span>
              <span class="font-medium capitalize">{{ status }}</span>
            </div>
            <div>
              <div class="bg-secondary h-2 w-full rounded">
                <div class="bg-primary h-2 rounded transition-all" :style="{ width: `${progress ?? 0}%` }" />
              </div>
              <div class="text-muted-foreground mt-2 text-xs">{{ Math.round(progress ?? 0) }}%</div>
            </div>
            <div class="flex gap-2">
              <Button
                type="button"
                variant="outline"
                @click="
                  () => {
                    stopPolling();
                    beginPolling();
                  }
                "
                :disabled="status === 'done' || status === 'failed'"
              >
                Refresh Status
              </Button>
              <Button
                type="button"
                variant="ghost"
                @click="
                  () => {
                    stopPolling();
                    status = 'failed';
                  }
                "
                class="hidden"
                >Stop</Button
              >
            </div>
          </div>

          <!-- Step 3: Results & Commit -->
          <div v-else class="mt-4 space-y-4">
            <div class="flex items-center justify-between">
              <div class="text-muted-foreground text-xs">Maksimal {{ MAX_PER_BATCH }} item per kirim.</div>
              <div class="w-72">
                <BaseSelect
                  name="tagId"
                  label="Tag Berita"
                  :options="tagOptions"
                  placeholder="Pilih tag"
                  required
                  searchable
                  :disabled="loadingTags"
                  v-model="selectedTagIdString"
                />
              </div>
            </div>

            <div class="h-[420px] overflow-y-auto rounded-md border">
              <div class="divide-y">
                <div v-for="item in results" :key="item.url" class="flex items-start gap-3 p-3">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    :aria-pressed="!!checkedMap[item.url]"
                    :disabled="
                      committedUrlSet.has(item.url) || (!checkedMap[item.url] && selectedCount >= MAX_PER_BATCH)
                    "
                    @click="
                      () => {
                        const next = !checkedMap[item.url];
                        console.log('[ScrapingDialog] toggle click', { url: item.url, next });
                        onToggle(item.url, next);
                      }
                    "
                  >
                    <CheckSquare v-if="checkedMap[item.url]" class="text-primary h-4 w-4" />
                    <Square v-else class="h-4 w-4" />
                  </Button>
                  <div class="space-y-1">
                    <div class="leading-5 font-medium">{{ item.title }}</div>
                    <div class="text-muted-foreground text-xs">{{ item.published_at || "-" }}</div>
                    <a :href="item.url" target="_blank" class="text-primary text-xs underline">{{ item.url }}</a>
                    <div v-if="committedUrlSet.has(item.url)" class="text-muted-foreground text-[10px] font-medium">
                      Sudah dikirim
                    </div>
                  </div>
                </div>
                <div v-if="results.length === 0" class="text-muted-foreground p-6 text-center text-sm">
                  Tidak ada hasil.
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                class="inline-flex items-center gap-2"
                @click="
                  () => {
                    step = 1;
                    resetState();
                  }
                "
              >
                <RotateCcw class="h-4 w-4" />
                Ulangi Tarik
              </Button>
              <Button
                type="button"
                :disabled="isCommitting || !selectedTagIdString || selectedCount === 0"
                class="inline-flex items-center gap-2"
                @click="commitSelected"
              >
                <Loader2 v-if="isCommitting" class="h-4 w-4 animate-spin" />
                <Send v-else class="h-4 w-4" />
                Commit yang dipilih ({{ selectedCount }})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </BaseFormDialog>
</template>
