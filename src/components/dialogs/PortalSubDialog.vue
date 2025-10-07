<script setup lang="ts">
import { useForm } from "vee-validate";
import { computed, onMounted } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";

import { createPortalMenuSub, updatePortalMenuSub } from "@/lib/api/services/portal";
import type { PortalMenuSub } from "@/lib/api/types/portal.types";
import { createPortalMenuSubSchema, updatePortalMenuSubSchema } from "@/schemas/portalSchema";

const { setFieldValue } = useForm();

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  portalMenuSub?: PortalMenuSub | null;
  defaultPortalMenuId?: number;
  defaultPortalKatId?: number;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { portalMenuSub: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() => {
  const defaultPortalMenuId = props.defaultPortalMenuId || 0;
  const defaultPortalKatId = props.defaultPortalKatId || 0;

  if (props.mode === "create") {
    return {
      judul: "",
      link: "",
      icon: "",
      portalMenuId: defaultPortalMenuId,
      portalKatId: defaultPortalKatId,
    };
  } else {
    return {
      judul: props.portalMenuSub?.judul ?? "",
      link: props.portalMenuSub?.link ?? "",
      icon: props.portalMenuSub?.iconUrl ?? "",
      portalMenuId: props.portalMenuSub?.portalMenuId || defaultPortalMenuId,
      portalKatId: defaultPortalKatId,
    };
  }
});

const schema = computed(() => (props.mode === "create" ? createPortalMenuSubSchema : updatePortalMenuSubSchema));

const defaultPortalMenuId = computed(() => props.defaultPortalMenuId || 0);
const defaultPortalKatId = computed(() => props.defaultPortalKatId || 0);

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  const payload = {
    judul: values.judul,
    link: values.link || undefined,
    icon: values.icon || undefined,
    portalMenuId: parseInt(values.portalMenuId),
    portalKatId: parseInt(values.portalKatId),
  };

  if (props.mode === "create") {
    await createPortalMenuSub(payload);
    toast.success("Berhasil", { description: "Portal sub kategori berhasil ditambahkan" });
  } else if (props.portalMenuSub) {
    await updatePortalMenuSub(props.portalMenuSub.id, payload);
    toast.success("Berhasil", { description: "Portal sub kategori berhasil diperbarui" });
  }
}

onMounted(() => {
  setFieldValue("portalMenuId", defaultPortalMenuId.value);
  setFieldValue("portalKatId", defaultPortalKatId.value);
});
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Portal Sub Kategori"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul Sub Kategori" placeholder="Masukkan judul sub kategori" required />

      <BaseInput
        name="link"
        label="Link Sub Kategori"
        placeholder="Masukkan link sub kategori (opsional)"
        description="URL sub kategori atau '#' untuk menu parent"
      />

      <BaseInputFile
        name="icon"
        label="Icon Sub Kategori"
        accept="image/*"
        :required="false"
        description="Format: JPG, PNG, GIF, WebP. Maksimal 2MB"
        :existing-files="props.portalMenuSub?.iconUrl || undefined"
      />
    </div>
  </BaseFormDialog>
</template>
