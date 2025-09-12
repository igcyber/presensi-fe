<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
});
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField, errorMessage }">
    <FormItem class="flex flex-row items-start gap-3 space-y-0">
      <FormControl>
        <Checkbox
          :checked="!!componentField.modelValue"
          @update:checked="componentField.onChange"
          :disabled="props.disabled"
          :aria-invalid="!!errorMessage"
        />
      </FormControl>
      <div class="space-y-1 leading-none">
        <FormLabel>
          {{ props.label }}
          <span v-if="props.required" class="text-destructive">*</span>
        </FormLabel>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>
</template>
