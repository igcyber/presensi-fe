<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createVideo, updateVideo } from "@/lib/api/services/video";
import type { Video } from "@/lib/api/types/video.types";
import { createVideoSchema, updateVideoSchema } from "@/schemas/videoSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  video?: Video | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  video: null,
  widthClass: "sm:max-w-[600px]",
});

const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { judul: "", isi: "", link: "" }
    : {
        judul: props.video?.judul ?? "",
        isi: props.video?.isi ?? "",
        link: props.video?.link ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createVideoSchema : updateVideoSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createVideo(values);
    toast.success("Berhasil", { description: "Video berhasil ditambahkan" });
  } else if (props.video) {
    await updateVideo(props.video.id, values);
    toast.success("Berhasil", { description: "Video berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Video"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul Video" placeholder="Masukkan judul video" required />

      <BaseTextarea name="isi" label="Deskripsi" placeholder="Masukkan deskripsi video" :rows="3" required />

      <BaseInput
        name="link"
        label="Link Video"
        placeholder="https://www.youtube.com/embed/xyz123"
        required
        help-text="Masukkan embed URL YouTube atau Facebook"
      />
    </div>
  </BaseFormDialog>
</template>
