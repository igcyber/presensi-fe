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
  required?: boolean;
  valueAsNumber?: boolean; // konversi ke number saat submit
  multiple?: boolean; // <-- tambahkan
}

const props = withDefaults(defineProps<Props>(), {
  valueAsNumber: false,
  multiple: false,
});
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField, meta, errorMessage }">
    <FormItem>
      <FormLabel :custom-for="props.name">
        {{ props.label }}
        <span v-if="props.required" class="text-red-500">*</span>
      </FormLabel>

      <FormControl>
        <Select
          :multiple="props.multiple"
          :model-value="
            props.multiple
              ? // MULTIPLE: UI butuh string[]; normalisasi dari model ke string[]
                props.valueAsNumber
                ? Array.isArray(componentField.modelValue)
                  ? componentField.modelValue.map((v: any) => String(v))
                  : []
                : Array.isArray(componentField.modelValue)
                  ? componentField.modelValue
                  : []
              : props.valueAsNumber
                ? componentField.modelValue != null
                  ? String(componentField.modelValue)
                  : undefined
                : componentField.modelValue
          "
          @update:model-value="
            (val: AcceptableValue) => {
              if (props.multiple) {
                // MULTIPLE: val => string[] → kirim array ke VeeValidate
                const arr = Array.isArray(val) ? val : [];
                componentField.onChange(props.valueAsNumber ? arr.map((s: string) => Number(s)) : arr);
              } else {
                // SINGLE: val => string → kirim primitif
                const s = val as string | undefined;
                componentField.onChange(props.valueAsNumber && s != null ? Number(s) : s);
              }
            }
          "
          :disabled="props.disabled"
        >
          <SelectTrigger :id="props.name" class="w-full" :aria-invalid="!!(!meta.valid && errorMessage)">
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
