<script setup lang="ts">
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
import moment from "moment";
import { useField } from "vee-validate";
import { computed, provide } from "vue";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FIELD_NAME_CONTEXT_KEY } from "@/components/ui/form/useFormField";
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

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Pilih tanggal",
  required: false,
  disabled: false,
  readonly: false,
  autocomplete: "off",
});

provide(FIELD_NAME_CONTEXT_KEY, props.name);

const { value, errorMessage, setValue } = useField(props.name);

const calendarValue = computed(() => {
  if (!value.value) return undefined;

  return new CalendarDate(moment(value.value).year(), moment(value.value).month() + 1, moment(value.value).date());
});

const handleChange = (v: DateValue | undefined) => {
  if (!v) {
    setValue("", false);
    return;
  }

  const dateString = moment({
    year: v.year,
    month: v.month - 1,
    day: v.day,
  }).format("YYYY-MM-DD");

  setValue(dateString, false);
};
</script>

<template>
  <FormItem class="flex flex-col">
    <FormLabel :name="props.name">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive">*</span>
    </FormLabel>

    <Popover>
      <PopoverTrigger as-child class="!w-full">
        <FormControl :name="props.name">
          <Button
            variant="outline"
            :disabled="props.disabled || props.readonly"
            :class="
              cn(
                'w-[240px] border ps-3 text-start font-normal',
                errorMessage &&
                  '!border-destructive !ring-destructive focus-visible:ring-destructive hover:!border-destructive !text-white',
                !errorMessage && '!border-primary',
              )
            "
            :aria-invalid="!!errorMessage"
            :aria-describedby="props.description ? `${props.name}-description` : undefined"
          >
            <span>
              {{ value ? moment(value).format("DD MMMM YYYY") : props.placeholder }}
            </span>
            <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
          </Button>
          <input hidden />
        </FormControl>
      </PopoverTrigger>

      <PopoverContent class="w-auto p-0">
        <Calendar
          :model-value="calendarValue"
          :calendar-label="props.label"
          initial-focus
          :min-value="new CalendarDate(1900, 1, 1)"
          :max-value="today(getLocalTimeZone())"
          @update:model-value="handleChange"
        />
      </PopoverContent>
    </Popover>

    <FormDescription v-if="props.description" :name="props.name" :id="`${props.name}-description`">
      {{ props.description }}
    </FormDescription>
    <FormMessage :name="props.name" />
  </FormItem>
</template>
