<script setup lang="ts">
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
import moment from "moment";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  name: "date",
  label: "Tanggal",
  placeholder: "Pilih tanggal",
  required: false,
  disabled: false,
  readonly: false,
  autocomplete: "off",
});

// 👉 Satu fungsi universal untuk konversi CalendarDate ⇄ string
const handleUpdateModelValue = (v: DateValue | undefined, onChange: (v: any) => void) => {
  if (!v) return onChange("");

  // Konversi ke string format YYYY-MM-DD (moment lebih sederhana)
  const dateString = moment({
    year: v.year,
    month: v.month - 1, // moment pakai index bulan 0-based
    day: v.day,
  }).format("YYYY-MM-DD");

  onChange(dateString);
};
</script>

<template>
  <FormField v-slot="{ componentField, meta, errorMessage }" :name="name">
    <FormItem class="flex flex-col">
      <FormLabel>{{ label }}</FormLabel>

      {{ meta.valid }}
      <Popover>
        <PopoverTrigger as-child class="!w-full">
          <FormControl>
            <Button
              variant="outline"
              :class="
                cn(
                  'w-[240px] border ps-3 text-start font-normal',
                  errorMessage &&
                    '!border-destructive !ring-destructive focus-visible:ring-destructive hover:!border-destructive !text-white',
                  !errorMessage && '!border-primary',
                )
              "
            >
              <!-- Format tampilannya pakai moment -->
              <span>
                {{ componentField.modelValue ? moment(componentField.modelValue).format("DD MMMM YYYY") : placeholder }}
              </span>
              <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
            </Button>
            <input hidden />
          </FormControl>
        </PopoverTrigger>

        <PopoverContent class="w-auto p-0">
          <Calendar
            :model-value="
              componentField.modelValue
                ? new CalendarDate(
                    moment(componentField.modelValue).year(),
                    moment(componentField.modelValue).month() + 1,
                    moment(componentField.modelValue).date(),
                  )
                : undefined
            "
            :calendar-label="label"
            initial-focus
            :min-value="new CalendarDate(1900, 1, 1)"
            :max-value="today(getLocalTimeZone())"
            @update:model-value="(v) => handleUpdateModelValue(v, componentField.onChange)"
          />
        </PopoverContent>
      </Popover>

      <FormDescription>{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
