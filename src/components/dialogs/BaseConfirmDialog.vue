<script setup lang="ts">
import { computed } from "vue";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Konfirmasi",
  description: "Apakah Anda yakin?",
  confirmText: "Konfirmasi",
  cancelText: "Batal",
  variant: "default",
  loading: false,
});

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const btnVariant = computed(() => props.variant);

function close() {
  emit("update:open", false);
  emit("cancel");
}
</script>

<template>
  <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
    <DialogContent class="sm:max-w-[440px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="button" variant="outline" @click="close">{{ cancelText }}</Button>
        <Button type="button" :variant="btnVariant" :disabled="loading" @click="$emit('confirm')">
          <span v-if="loading">Processing…</span>
          <span v-else>{{ confirmText }}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
