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
  valueAsNumber?: boolean;
  multiple?: boolean;
  emptyOption?: string; // opsional
}

const props = withDefaults(defineProps<Props>(), {
  valueAsNumber: false,
  multiple: false,
});

const toStringValue = (val: string | number) => String(val);

const normalizedValue = (modelValue: AcceptableValue) => {
  const mv = modelValue;
  if (props.multiple) {
    if (!Array.isArray(mv)) return [];
    return props.valueAsNumber ? mv.map(toStringValue) : mv;
  }
  return props.valueAsNumber && mv != null ? String(mv) : mv;
};

const handleChange = (val: AcceptableValue, onChange: (val: any) => void) => {
  if (props.multiple) {
    const arr = Array.isArray(val) ? val : [];
    onChange(props.valueAsNumber ? arr.map(Number) : arr);
  } else {
    const s = val as string | undefined;
    onChange(props.valueAsNumber && s != null ? Number(s) : s);
  }
};
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField, meta, errorMessage }">
    <FormItem>
      <FormLabel :custom-for="props.name">
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>

      <FormControl>
        <Select
          :multiple="props.multiple"
          :model-value="normalizedValue(componentField.modelValue)"
          @update:model-value="(val) => handleChange(val, componentField.onChange)"
          :disabled="props.disabled"
        >
          <SelectTrigger :id="props.name" class="w-full" :aria-invalid="!!(!meta.valid && errorMessage)">
            <SelectValue :placeholder="props.placeholder ?? 'Pilih…'" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem v-if="props.emptyOption" value="">
                {{ props.emptyOption }}
              </SelectItem>
              <SelectItem
                v-for="opt in props.options"
                :key="toStringValue(opt.value)"
                :value="toStringValue(opt.value)"
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
