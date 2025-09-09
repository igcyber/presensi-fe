<script setup lang="ts">
import type { AcceptableValue } from "reka-ui";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  valueAsNumber?: boolean; // konversi ke number saat submit
}

const props = defineProps<Props>();
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField }">
    <FormItem>
      <FormLabel>{{ props.label }}</FormLabel>
      <FormControl>
        <Select
          :model-value="
            props.valueAsNumber
              ? componentField.modelValue != null
                ? String(componentField.modelValue)
                : undefined
              : componentField.modelValue
          "
          @update:model-value="
            (val: AcceptableValue) => componentField.onChange(props.valueAsNumber ? Number(val) : val)
          "
          :disabled="props.disabled"
        >
          <SelectTrigger>
            <SelectValue :placeholder="props.placeholder ?? 'Pilih…'" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="opt in props.options"
                :key="String(opt.value)"
                :value="String(opt.value)"
                :disabled="opt.disabled"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
