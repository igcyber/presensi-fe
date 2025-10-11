<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";

import { createMenu, getMenus, updateMenu } from "@/lib/api/services/menu";
import type { Menu } from "@/lib/api/types/menu.types";
import { createMenuSchema, updateMenuSchema } from "@/schemas/menuSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  menu?: Menu | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props and emits
const props = withDefaults(defineProps<Props>(), { menu: null });
const emit = defineEmits<Emits>();

// Reactive variables
const menuList = ref<Menu[]>([]);
const loadingMenus = ref(false);

// Computed properties
const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      nama: "",
      url: "",
      menuId: null,
    };
  }

  return {
    nama: props.menu?.nama ?? "",
    url: props.menu?.url ?? "",
    menuId: props.menu?.menuId ?? null,
  };
});

const schema = computed(() => (props.mode === "create" ? createMenuSchema : updateMenuSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Filter menu options untuk menghindari circular reference
const menuOptions = computed(() => {
  let filteredMenus = menuList.value;

  // Jika mode edit, filter out menu yang sedang diedit dan children-nya
  if (props.mode === "edit" && props.menu) {
    const currentId = props.menu.id;
    const childrenIds = props.menu.children?.map((child) => child.id) || [];

    filteredMenus = filteredMenus.filter((m) => {
      return m.id !== currentId && !childrenIds.includes(m.id);
    });
  }

  return filteredMenus.map((m) => ({
    label: m.nama,
    value: m.id.toString(),
  }));
});

// Methods
async function loadMenus() {
  try {
    loadingMenus.value = true;
    const response = await getMenus({ limit: 100 }); // Load semua menu
    menuList.value = response.data.data;
  } catch (error) {
    console.error("Failed to load menus:", error);
    toast.error("Gagal memuat daftar menu");
  } finally {
    loadingMenus.value = false;
  }
}

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createMenu(values);
    toast.success("Berhasil", { description: "Menu berhasil ditambahkan" });
  } else if (props.menu) {
    await updateMenu(props.menu.id, values);
    toast.success("Berhasil", { description: "Menu berhasil diperbarui" });
  }
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadMenus();
    }
  },
);

// Lifecycle hooks
onMounted(() => {
  if (props.open) {
    loadMenus();
  }
});
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Menu"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Menu" placeholder="Masukkan nama menu" required />

      <BaseInput name="url" label="URL" placeholder="Masukkan URL menu (contoh: /profil)" />

      <BaseSelect
        name="menuId"
        label="Parent Menu"
        :options="menuOptions"
        placeholder="Pilih parent menu (opsional)"
        description="Pilih parent jika menu ini merupakan sub menu"
        :disabled="loadingMenus"
        searchable
      />
    </div>
  </BaseFormDialog>
</template>
