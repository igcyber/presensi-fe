<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  autoResize?: boolean;
  maxlength?: number;
  showCounter?: boolean;
}

const props = defineProps<Props>();

function handleAutoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField }">
    <FormItem>
      <FormLabel>{{ props.label }}</FormLabel>
      <FormControl>
        <Textarea
          v-bind="componentField"
          :rows="props.rows ?? 4"
          :placeholder="props.placeholder"
          :maxlength="props.maxlength"
          @input="
            (e: Event) => {
              if (props.autoResize) handleAutoResize(e);
              componentField.onInput(e);
            }
          "
        />
      </FormControl>
      <div v-if="props.showCounter && props.maxlength" class="text-muted-foreground text-right text-xs">
        {{ String((componentField.modelValue as string)?.length || 0) }}/{{ props.maxlength }}
      </div>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
