<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";
import { computed, ref } from "vue";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
});

const showPassword = ref(false);

const inputType = computed(() => (props.type === "password" ? (showPassword.value ? "text" : "password") : props.type));

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <FormField v-slot="{ componentField }" :name="props.name">
    <FormItem class="relative">
      <FormLabel>
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <Input
          v-bind="componentField"
          :type="inputType"
          :placeholder="props.placeholder"
          :class="props.type === 'password' ? 'pr-10' : ''"
          :autocomplete="props.type === 'password' ? 'current-password' : 'on'"
        />
        <Button
          v-if="props.type === 'password'"
          type="button"
          variant="ghost"
          size="sm"
          class="absolute inset-y-0 right-0 flex items-center px-3"
          @click="togglePasswordVisibility"
          :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
          :aria-pressed="showPassword"
        >
          <EyeOff v-if="showPassword" class="h-4 w-4" />
          <Eye v-else class="h-4 w-4" />
        </Button>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
