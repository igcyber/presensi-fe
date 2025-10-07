<script setup lang="ts">
import { useForm } from "vee-validate";
import { computed, onMounted } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { createPortalMenuKat, updatePortalMenuKat } from "@/lib/api/services/portal";
import type { PortalMenuKat } from "@/lib/api/types/portal.types";
import { createPortalMenuKatSchema, updatePortalMenuKatSchema } from "@/schemas/portalSchema";

const { setFieldValue } = useForm();

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  portalMenuKat?: PortalMenuKat | null;
  defaultPortalMenuId?: number;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { portalMenuKat: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() => {
  const defaultPortalMenuId = props.defaultPortalMenuId || 0;
  if (props.mode === "create") {
    return { judul: "", portalMenuId: defaultPortalMenuId };
  } else {
    return {
      judul: props.portalMenuKat?.judul ?? "",
      portalMenuId: props.portalMenuKat?.portalMenuId || defaultPortalMenuId,
    };
  }
});

const schema = computed(() => (props.mode === "create" ? createPortalMenuKatSchema : updatePortalMenuKatSchema));

const defaultPortalMenuId = computed(() => props.defaultPortalMenuId || 0);

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  const payload = {
    judul: values.judul,
    portalMenuId: values.portalMenuId,
  };

  if (props.mode === "create") {
    await createPortalMenuKat(payload);
    toast.success("Berhasil", { description: "Portal kategori berhasil ditambahkan" });
  } else if (props.portalMenuKat) {
    await updatePortalMenuKat(props.portalMenuKat.id, payload);
    toast.success("Berhasil", { description: "Portal kategori berhasil diperbarui" });
  }
}

onMounted(() => {
  setFieldValue("portalMenuId", defaultPortalMenuId.value);
});
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Portal Kategori"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul Kategori" placeholder="Masukkan judul kategori" required />
    </div>
  </BaseFormDialog>
</template>
