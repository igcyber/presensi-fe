<script setup lang="ts">
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { computed } from "vue";
import { Bar } from "vue-chartjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface Props {
  datasets: Dataset[];
  labels: string[];
  height?: number;
  showLegend?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  showLegend: true,
  title: "",
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset) => ({
    ...dataset,
    borderRadius: 8,
    borderSkipped: false,
  })),
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
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
          return `${context.dataset.label}: ${context.parsed.y.toLocaleString("id-ID")}`;
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
    },
    y: {
      stacked: true,
      grid: {
        display: true,
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

