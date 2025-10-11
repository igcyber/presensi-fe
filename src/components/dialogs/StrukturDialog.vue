<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createStruktur, getStrukturs, updateStruktur } from "@/lib/api/services/struktur";
import type { Struktur } from "@/lib/api/types/struktur.types";
import { createStrukturSchema, updateStrukturSchema } from "@/schemas/strukturSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  struktur?: Struktur | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props and emits
const props = withDefaults(defineProps<Props>(), { struktur: null });
const emit = defineEmits<Emits>();

// Reactive variables
const strukturList = ref<Struktur[]>([]);
const loadingStrukturs = ref(false);

// Computed properties
const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      nama: "",
      tentang: "",
      strukturId: null,
    };
  }

  return {
    nama: props.struktur?.nama ?? "",
    tentang: props.struktur?.tentang ?? "",
    strukturId: props.struktur?.strukturId ?? null,
  };
});

const schema = computed(() => (props.mode === "create" ? createStrukturSchema : updateStrukturSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Filter struktur options untuk menghindari circular reference
const strukturOptions = computed(() => {
  let filteredStrukturs = strukturList.value;

  // Jika mode edit, filter out struktur yang sedang diedit dan children-nya
  if (props.mode === "edit" && props.struktur) {
    const currentId = props.struktur.id;
    const childrenIds = props.struktur.children?.map((child) => child.id) || [];

    filteredStrukturs = filteredStrukturs.filter((s) => {
      return s.id !== currentId && !childrenIds.includes(s.id);
    });
  }

  return [
    // { label: "-- Tidak Ada Parent --", value: "" },
    ...filteredStrukturs.map((s) => ({
      label: s.nama,
      value: s.id.toString(),
    })),
  ];
});

// Methods
async function loadStrukturs() {
  try {
    loadingStrukturs.value = true;
    const response = await getStrukturs({ limit: 100 }); // Load semua struktur
    strukturList.value = response.data.data;
  } catch (error) {
    console.error("Failed to load strukturs:", error);
    toast.error("Gagal memuat daftar struktur");
  } finally {
    loadingStrukturs.value = false;
  }
}

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createStruktur(values);
    toast.success("Berhasil", { description: "Struktur berhasil ditambahkan" });
  } else if (props.struktur) {
    await updateStruktur(props.struktur.id, values);
    toast.success("Berhasil", { description: "Struktur berhasil diperbarui" });
  }
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadStrukturs();
    }
  },
);

// Lifecycle hooks
onMounted(() => {
  if (props.open) {
    loadStrukturs();
  }
});
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Struktur"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Struktur" placeholder="Masukkan nama struktur" required />

      <BaseSelect
        name="strukturId"
        label="Parent Struktur"
        :options="strukturOptions"
        placeholder="Pilih parent struktur (opsional)"
        description="Pilih parent jika struktur ini merupakan sub struktur"
        :disabled="loadingStrukturs"
        searchable
      />

      <BaseTextarea
        name="tentang"
        label="Tentang"
        placeholder="Masukkan deskripsi tentang struktur ini"
        :rows="6"
        required
      />
    </div>
  </BaseFormDialog>
</template>
