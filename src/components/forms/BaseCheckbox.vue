<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField }">
    <FormItem class="flex flex-row items-start gap-3 space-y-0">
      <FormControl>
        <Checkbox
          :checked="!!componentField.modelValue"
          @update:checked="componentField.onChange"
          :disabled="props.disabled"
        />
      </FormControl>
      <div class="space-y-1 leading-none">
        <FormLabel>{{ props.label }}</FormLabel>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>
</template>
