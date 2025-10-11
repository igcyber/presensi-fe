<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";

import { createJabatanAnggota, getJabatanAnggotas, updateJabatanAnggota } from "@/lib/api/services/jabatanAnggota";
import { getStrukturs } from "@/lib/api/services/struktur";
import type { JabatanAnggota } from "@/lib/api/types/jabatanAnggota.types";
import type { Struktur } from "@/lib/api/types/struktur.types";
import { createJabatanAnggotaSchema, updateJabatanAnggotaSchema } from "@/schemas/jabatanAnggotaSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  jabatanAnggota?: JabatanAnggota | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props and emits
const props = withDefaults(defineProps<Props>(), { jabatanAnggota: null });
const emit = defineEmits<Emits>();

// Reactive variables
const anggotaList = ref<JabatanAnggota[]>([]);
const strukturList = ref<Struktur[]>([]);
const loadingAnggotas = ref(false);
const loadingStrukturs = ref(false);

// Computed properties
const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      nama: "",
      jabatan: "",
      foto: "",
      anggotaId: null,
      strukturId: "",
    };
  }

  return {
    nama: props.jabatanAnggota?.nama ?? "",
    jabatan: props.jabatanAnggota?.jabatan ?? "",
    foto: props.jabatanAnggota?.foto ?? "",
    anggotaId: props.jabatanAnggota?.anggotaId ?? null,
    strukturId: props.jabatanAnggota?.strukturId ?? "",
  };
});

const schema = computed(() => (props.mode === "create" ? createJabatanAnggotaSchema : updateJabatanAnggotaSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Filter anggota options untuk menghindari circular reference
const anggotaOptions = computed(() => {
  let filteredAnggotas = anggotaList.value;

  // Jika mode edit, filter out anggota yang sedang diedit dan children-nya
  if (props.mode === "edit" && props.jabatanAnggota) {
    const currentId = props.jabatanAnggota.id;
    const childrenIds = props.jabatanAnggota.anggotaChild?.map((child) => child.id) || [];

    filteredAnggotas = filteredAnggotas.filter((a) => {
      return a.id !== currentId && !childrenIds.includes(a.id);
    });
  }

  return filteredAnggotas.map((a) => ({
    label: `${a.nama} - ${a.jabatan}`,
    value: a.id.toString(),
  }));
});

const strukturOptions = computed(() => {
  return strukturList.value.map((s) => ({
    label: s.nama,
    value: s.id.toString(),
  }));
});

// Methods
async function loadAnggotas() {
  try {
    loadingAnggotas.value = true;
    const response = await getJabatanAnggotas({ limit: 100 }); // Load semua anggota
    anggotaList.value = response.data.data;
  } catch (error) {
    console.error("Failed to load anggota:", error);
    toast.error("Gagal memuat daftar anggota");
  } finally {
    loadingAnggotas.value = false;
  }
}

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
    await createJabatanAnggota(values);
    toast.success("Berhasil", { description: "Jabatan anggota berhasil ditambahkan" });
  } else if (props.jabatanAnggota) {
    await updateJabatanAnggota(props.jabatanAnggota.id, values);
    toast.success("Berhasil", { description: "Jabatan anggota berhasil diperbarui" });
  }
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadAnggotas();
      loadStrukturs();
    }
  },
);

// Lifecycle hooks
onMounted(() => {
  if (props.open) {
    loadAnggotas();
    loadStrukturs();
  }
});
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Jabatan Anggota"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Anggota" placeholder="Masukkan nama lengkap anggota" required />

      <BaseInput name="jabatan" label="Jabatan" placeholder="Masukkan jabatan anggota" required />

      <BaseInputFile
        name="foto"
        label="Foto Anggota"
        description="Format: JPG, PNG, WebP. Maksimal 5MB"
        :existing-files="props.jabatanAnggota?.fotoUrl ?? []"
        :max-size="5"
      />

      <BaseSelect
        name="strukturId"
        label="Struktur"
        :options="strukturOptions"
        placeholder="Pilih struktur"
        description="Pilih struktur/jabatan organisasi"
        :disabled="loadingStrukturs"
        searchable
        required
      />

      <BaseSelect
        name="anggotaId"
        label="Parent Anggota"
        :options="anggotaOptions"
        placeholder="Pilih parent anggota (opsional)"
        description="Pilih parent jika anggota ini memiliki atasan"
        :disabled="loadingAnggotas"
        searchable
      />
    </div>
  </BaseFormDialog>
</template>
