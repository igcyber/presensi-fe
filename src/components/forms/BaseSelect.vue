<script setup lang="ts">
import type { AcceptableValue } from "reka-ui";
import { computed } from "vue";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  valueAsNumber?: boolean;
  multiple?: boolean;
  emptyOption?: string;
  description?: string;
  searchable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  valueAsNumber: false,
  multiple: false,
  placeholder: "Pilih opsi...",
});

const toStringValue = (val: string | number): string => String(val);

const normalizedValue = (modelValue: AcceptableValue) => {
  if (props.multiple) {
    if (!Array.isArray(modelValue)) return [];
    return modelValue.map(toStringValue);
  }
  return modelValue != null ? String(modelValue) : modelValue;
};

const handleChange = (val: AcceptableValue, onChange: (val: any) => void) => {
  if (props.multiple) {
    const arr = Array.isArray(val) ? val : [];
    const result = props.valueAsNumber ? arr.map(Number) : arr;
    onChange(result.length > 0 ? result : null);
  } else {
    const stringValue = val as string | undefined;
    if (!stringValue) {
      onChange(null);
      return;
    }
    onChange(props.valueAsNumber ? Number(stringValue) : stringValue);
  }
};

// Group options by group property
const groupedOptions = computed(() => {
  const grouped = props.options.reduce(
    (acc, option) => {
      const group = option.group || "default";
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    },
    {} as Record<string, SelectOption[]>,
  );

  return grouped;
});

const hasGroups = computed(() => Object.keys(groupedOptions.value).length > 1 || !groupedOptions.value.default);
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
          :name="props.name"
          :disabled="props.disabled"
          @update:model-value="(val) => handleChange(val, componentField.onChange)"
        >
          <SelectTrigger
            :id="props.name"
            class="w-full"
            :aria-invalid="!!(!meta.valid && errorMessage)"
            :aria-describedby="props.description ? `${props.name}-description` : undefined"
          >
            <SelectValue :placeholder="props.placeholder" />
          </SelectTrigger>

          <SelectContent>
            <!-- Empty option if provided -->
            <SelectGroup v-if="props.emptyOption">
              <SelectItem value="">
                {{ props.emptyOption }}
              </SelectItem>
            </SelectGroup>

            <!-- Grouped options -->
            <template v-if="hasGroups">
              <SelectGroup v-for="(groupOptions, groupName) in groupedOptions" :key="groupName">
                <SelectItem
                  v-for="opt in groupOptions"
                  :key="toStringValue(opt.value)"
                  :value="toStringValue(opt.value)"
                  :disabled="opt.disabled"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectGroup>
            </template>

            <!-- Ungrouped options -->
            <SelectGroup v-else>
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

      <FormDescription v-if="props.description">
        {{ props.description }}
      </FormDescription>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
