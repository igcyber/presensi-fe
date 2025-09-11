<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";
import { useFormContext } from "vee-validate";
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

const props = defineProps<Props>();

const { isFieldDirty } = useFormContext();

// Password visibility toggle
const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }
  return props.type || "text";
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <FormField v-slot="{ componentField }" :name="props.name" :validate-on-blur="!isFieldDirty(props.name)">
    <FormItem>
      <FormLabel>
        {{ props.label }}
        <span v-if="props.required" class="text-red-500">*</span>
      </FormLabel>
      <FormControl>
        <div class="relative">
          <Input
            v-bind="componentField"
            :type="inputType"
            :placeholder="props.placeholder"
            :class="props.type === 'password' ? 'pr-10' : ''"
          />
          <Button
            v-if="props.type === 'password'"
            type="button"
            variant="ghost"
            size="sm"
            class="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            @click="togglePasswordVisibility"
            :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
          >
            <EyeOff v-if="showPassword" class="h-4 w-4" />
            <Eye v-else class="h-4 w-4" />
          </Button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
