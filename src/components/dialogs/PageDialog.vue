<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextEditorEcho from "@/components/forms/BaseTextEditorEcho.vue";

import { getMenus } from "@/lib/api/services/menu";
import { createPage, updatePage } from "@/lib/api/services/page";
import type { Menu } from "@/lib/api/types/menu.types";
import type { Page } from "@/lib/api/types/page.types";
import { TIPE_OPTIONS } from "@/lib/api/types/page.types";
import { createPageSchema, updatePageSchema } from "@/schemas/pageSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  page?: Page | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props and emits
const props = withDefaults(defineProps<Props>(), { page: null });
const emit = defineEmits<Emits>();

// Reactive variables
const menuList = ref<Menu[]>([]);
const loadingMenus = ref(false);
const selectedTipe = ref<"file" | "page">("page");

// Computed properties
const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      nama: "",
      tipe: "page",
      content: "",
      file: "",
      menuId: null,
      temporaryFileNames: [],
    };
  }

  return {
    nama: props.page?.nama ?? "",
    tipe: props.page?.tipe ?? "page",
    content: props.page?.content ?? "",
    file: props.page?.file ?? "",
    menuId: props.page?.menuId ?? null,
    temporaryFileNames: [],
  };
});

const schema = computed(() => (props.mode === "create" ? createPageSchema : updatePageSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

const menuOptions = computed(() => {
  return menuList.value.map((m) => ({
    label: m.nama,
    value: m.id.toString(),
  }));
});

const showFileInput = computed(() => {
  return selectedTipe.value === "file";
});

// Methods
async function loadMenus() {
  try {
    loadingMenus.value = true;
    const response = await getMenus({ limit: 100 }); // Load semua menu
    let data: Menu[] = response.data.data;
    data = data.filter((d: Menu) => {
      if (initialValues.value.menuId && initialValues.value.menuId == d.id) return true;
      return d.menuId !== null && d.page === null;
    });

    menuList.value = data;
  } catch (error) {
    console.error("Failed to load menus:", error);
    toast.error("Gagal memuat daftar menu");
  } finally {
    loadingMenus.value = false;
  }
}

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createPage(values);
    toast.success("Berhasil", { description: "Page berhasil ditambahkan" });
  } else if (props.page) {
    await updatePage(props.page.id, values);
    toast.success("Berhasil", { description: "Page berhasil diperbarui" });
  }
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadMenus();
      selectedTipe.value = (props.page?.tipe ?? "page") as "file" | "page";
    }
  },
  { immediate: true },
);
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Page"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Page" placeholder="Masukkan nama page" required />

      <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2">
        <BaseSelect
          name="tipe"
          label="Tipe"
          :options="TIPE_OPTIONS"
          placeholder="Pilih tipe"
          required
          @update:model-value="selectedTipe = $event as 'file' | 'page'"
        />

        <BaseSelect
          name="menuId"
          label="Menu"
          :options="menuOptions"
          placeholder="Pilih menu (opsional)"
          description="Hubungkan page dengan menu"
          :disabled="loadingMenus"
          searchable
        />
      </div>

      <!-- Content Editor - hanya untuk tipe 'page' -->
      <BaseTextEditorEcho
        name="content"
        label="Content"
        placeholder="Masukkan content page..."
        description="Gunakan editor untuk membuat content halaman"
      />

      <!-- File Input - hanya untuk tipe 'file' -->
      <BaseInputFile
        v-if="showFileInput"
        name="file"
        label="File"
        accept="application/pdf"
        description="Format: PDF. Maksimal 10MB"
        :existing-files="page?.fileUrl"
      />

      <!-- Info untuk tipe 'file' -->
      <div v-else class="bg-muted/50 rounded-md p-3 text-sm">
        <p class="text-muted-foreground">
          Tipe <strong>File</strong> dipilih. Content tidak diperlukan untuk tipe file.
        </p>
      </div>
    </div>
  </BaseFormDialog>
</template>
