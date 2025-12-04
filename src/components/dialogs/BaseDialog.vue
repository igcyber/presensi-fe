<script setup lang="ts">
import { computed } from "vue";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  widthClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  widthClass: "sm:max-w-[520px]",
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "close"): void;
  (e: "open"): void;
}>();

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
    if (!value) {
      emit("close");
    } else {
      emit("open");
    }
  },
});

function handleOpenChange(value: boolean) {
  open.value = value;
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent
      :class="cn('flex max-h-[90vh] flex-col p-0', props.widthClass)"
      @open-auto-focus="(e) => e.preventDefault()"
    >
      <DialogHeader v-if="props.title || $slots.header" class="flex-shrink-0 p-6 pb-0">
        <slot name="header">
          <DialogTitle v-if="props.title">{{ props.title }}</DialogTitle>
          <DialogDescription v-if="props.description">{{ props.description }}</DialogDescription>
        </slot>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto px-6">
        <slot />
      </div>

      <DialogFooter v-if="$slots.footer" class="flex-shrink-0 p-6 pt-0">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
