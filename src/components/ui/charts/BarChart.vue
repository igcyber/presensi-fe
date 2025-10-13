<script setup lang="ts">
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { computed } from "vue";
import { Bar } from "vue-chartjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: number[];
  labels: string[];
  colors?: string[];
  height?: number;
  horizontal?: boolean;
  showLegend?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ec4899"],
  height: 300,
  horizontal: false,
  showLegend: false,
  title: "",
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "Total Views",
      data: props.data,
      backgroundColor: props.colors,
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: props.colors.map((color) => color + "dd"),
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: props.horizontal ? ("y" as const) : ("x" as const),
  plugins: {
    legend: {
      display: props.showLegend,
      position: "top" as const,
      labels: {
        padding: 12,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
        },
      },
    },
    title: {
      display: !!props.title,
      text: props.title,
      font: {
        size: 14,
        family: "'Inter', sans-serif",
        weight: "600" as const,
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: {
        size: 13,
        family: "'Inter', sans-serif",
      },
      bodyFont: {
        size: 14,
        family: "'Inter', sans-serif",
      },
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      displayColors: true,
      callbacks: {
        label: function (context: any) {
          const label = context.dataset.label || "";
          const value = context.parsed.y || context.parsed.x || 0;
          return `${label}: ${value.toLocaleString("id-ID")}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: !props.horizontal,
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
    },
    y: {
      grid: {
        display: props.horizontal,
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        callback: function (value: any) {
          return value.toLocaleString("id-ID");
        },
      },
      beginAtZero: true,
    },
  },
  animation: {
    duration: 750,
    easing: "easeInOutQuart" as const,
  },
}));
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <Bar :data="chartData" :options="chartOptions as any" />
  </div>
</template>
