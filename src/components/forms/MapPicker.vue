<script setup lang="ts">
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-vue-next";
import { useField } from "vee-validate";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FIELD_NAME_CONTEXT_KEY } from "@/components/ui/form/useFormField";
import { Input } from "@/components/ui/input";

interface Props {
  latName: string;
  longName: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Pilih Lokasi",
  required: false,
  disabled: false,
  defaultCenter: () => [-0.4191422207962125, 117.16900524248992],
  defaultZoom: 16,
});

provide(FIELD_NAME_CONTEXT_KEY, props.latName);

const { value: latValue, setValue: setLatValue } = useField(props.latName);
const { value: longValue, setValue: setLongValue } = useField(props.longName);

const mapContainer = ref<HTMLDivElement>();
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const isUpdatingFromInput = ref(false);

let mapInstance: L.Map | null = null;
let markerInstance: L.Marker | null = null;

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const initializeMap = () => {
  if (!mapContainer.value) return;

  const currentLat = latValue.value ? parseFloat(String(latValue.value)) : props.defaultCenter[0];
  const currentLong = longValue.value ? parseFloat(String(longValue.value)) : props.defaultCenter[1];

  mapInstance = L.map(mapContainer.value, {
    center: [currentLat, currentLong],
    zoom: props.defaultZoom,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(mapInstance);

  if (latValue.value && longValue.value) {
    const lat = parseFloat(String(latValue.value));
    const long = parseFloat(String(longValue.value));
    if (!isNaN(lat) && !isNaN(long)) {
      markerInstance = L.marker([lat, long], { icon: defaultIcon, draggable: !props.disabled }).addTo(mapInstance);
      markerInstance.on("dragend", handleMarkerDrag);
    }
  }

  mapInstance.on("click", handleMapClick);

  map.value = mapInstance;
  marker.value = markerInstance;
};

const handleMapClick = (e: L.LeafletMouseEvent) => {
  if (props.disabled) return;

  const { lat, lng } = e.latlng;
  isUpdatingFromInput.value = true;
  setLatValue(lat.toString(), false);
  setLongValue(lng.toString(), false);
  isUpdatingFromInput.value = false;

  updateMarker(lat, lng);
};

const handleMarkerDrag = (e: L.DragEndEvent) => {
  if (props.disabled) return;

  const { lat, lng } = e.target.getLatLng();
  isUpdatingFromInput.value = true;
  setLatValue(lat.toString(), false);
  setLongValue(lng.toString(), false);
  isUpdatingFromInput.value = false;
};

const updateMarker = (lat: number, lng: number) => {
  if (!mapInstance) return;

  if (markerInstance) {
    markerInstance.setLatLng([lat, lng]);
  } else {
    markerInstance = L.marker([lat, lng], { icon: defaultIcon, draggable: !props.disabled }).addTo(mapInstance);
    markerInstance.on("dragend", handleMarkerDrag);
    marker.value = markerInstance;
  }

  const currentZoom = mapInstance.getZoom();
  const targetZoom = currentZoom < props.defaultZoom ? props.defaultZoom : currentZoom;
  mapInstance.setView([lat, lng], targetZoom);
  nextTick(() => {
    mapInstance?.invalidateSize();
  });
};

const handleLatInput = (value: string) => {
  if (isUpdatingFromInput.value) return;
  setLatValue(value, false);
};

const handleLongInput = (value: string) => {
  if (isUpdatingFromInput.value) return;
  setLongValue(value, false);
};

watch(
  [latValue, longValue],
  ([newLat, newLong], [oldLat, oldLong]) => {
    if (isUpdatingFromInput.value || !mapInstance) return;

    const lat = newLat ? parseFloat(String(newLat)) : NaN;
    const long = newLong ? parseFloat(String(newLong)) : NaN;

    if (!isNaN(lat) && !isNaN(long)) {
      const oldLatNum = oldLat ? parseFloat(String(oldLat)) : NaN;
      const oldLongNum = oldLong ? parseFloat(String(oldLong)) : NaN;

      if (lat !== oldLatNum || long !== oldLongNum) {
        updateMarker(lat, long);
      }
    }
  },
  { immediate: false },
);

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initializeMap();
      nextTick(() => {
        if (mapInstance) {
          mapInstance.invalidateSize();
        }

        if (mapInstance && mapContainer.value) {
          resizeObserver = new ResizeObserver(() => {
            nextTick(() => {
              mapInstance?.invalidateSize();
            });
          });
          resizeObserver.observe(mapContainer.value);

          mutationObserver = new MutationObserver(() => {
            nextTick(() => {
              mapInstance?.invalidateSize();
            });
          });
          mutationObserver.observe(mapContainer.value, {
            attributes: true,
            attributeFilter: ["style", "class"],
            childList: false,
            subtree: false,
          });
        }
      });
    }, 150);
  });
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
  if (markerInstance) {
    markerInstance.remove();
    markerInstance = null;
  }
});
</script>

<template>
  <FormItem>
    <FormLabel v-if="label" :name="latName">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </FormLabel>

    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <FormLabel :name="latName" class="text-sm font-medium mb-1.5 block">
            Latitude
            <span v-if="required" class="text-destructive">*</span>
          </FormLabel>
          <FormControl :name="latName">
            <div class="relative">
              <MapPin class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                :model-value="(latValue as string) ?? ''"
                @update:model-value="handleLatInput"
                type="text"
                placeholder="-0.4191422207962125"
                :disabled="disabled"
                class="pl-9"
              />
            </div>
          </FormControl>
        </div>
        <div>
          <FormLabel :name="longName" class="text-sm font-medium mb-1.5 block">
            Longitude
            <span v-if="required" class="text-destructive">*</span>
          </FormLabel>
          <FormControl :name="longName">
            <div class="relative">
              <MapPin class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                :model-value="(longValue as string) ?? ''"
                @update:model-value="handleLongInput"
                type="text"
                placeholder="117.16900524248992"
                :disabled="disabled"
                class="pl-9"
              />
            </div>
          </FormControl>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border">
        <div ref="mapContainer" class="h-[280px] w-full" :class="{ 'pointer-events-none opacity-50': disabled }"></div>
      </div>
    </div>

    <FormDescription v-if="description" :name="latName" :id="`${latName}-description`">
      {{ description }}
    </FormDescription>

    <FormMessage :name="latName" />
    <FormMessage :name="longName" />
  </FormItem>
</template>

