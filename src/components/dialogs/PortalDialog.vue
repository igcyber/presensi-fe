<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";

import { createPortalMenu, updatePortalMenu } from "@/lib/api/services/portal";
import type { PortalMenu } from "@/lib/api/types/portal.types";
import { createPortalMenuSchema, updatePortalMenuSchema } from "@/schemas/portalSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  portalMenu?: PortalMenu | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { portalMenu: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() =>
  props.mode === "create"
    ? { judul: "", link: "", icon: "" }
    : {
        judul: props.portalMenu?.judul ?? "",
        link: props.portalMenu?.link ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createPortalMenuSchema : updatePortalMenuSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createPortalMenu(values);
    toast.success("Berhasil", { description: "Portal menu berhasil ditambahkan" });
  } else if (props.portalMenu) {
    await updatePortalMenu(props.portalMenu.id, values);
    toast.success("Berhasil", { description: "Portal menu berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Portal Menu"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul Portal" placeholder="Masukkan judul portal" required />

      <BaseInput
        name="link"
        label="Link Portal"
        placeholder="Masukkan link portal (opsional)"
        description="URL portal atau '#' untuk menu parent"
      />

      <BaseInputFile
        name="icon"
        label="Icon Portal"
        accept="image/*"
        :required="false"
        description="Format: JPG, PNG, GIF, WebP. Maksimal 2MB"
        :existing-files="props.portalMenu?.iconUrl"
      />
    </div>
  </BaseFormDialog>
</template>
