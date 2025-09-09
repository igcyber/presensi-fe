<script setup lang="ts">
import { useFormContext } from "vee-validate";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

const props = defineProps<Props>();

const { isFieldDirty } = useFormContext();
</script>

<template>
  <FormField v-slot="{ componentField }" :name="props.name" :validate-on-blur="!isFieldDirty(props.name)">
    <FormItem>
      <FormLabel>{{ props.label }}</FormLabel>
      <FormControl>
        <Input v-bind="componentField" :type="props.type || 'text'" :placeholder="props.placeholder" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
