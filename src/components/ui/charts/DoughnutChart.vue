<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: number[];
  labels: string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ec4899"],
  height: 300,
  showLegend: true,
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.colors,
      borderWidth: 2,
      borderColor: "#ffffff",
      hoverBorderWidth: 3,
      hoverOffset: 8,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: props.showLegend,
      position: "bottom" as const,
      labels: {
        padding: 16,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        usePointStyle: true,
        pointStyle: "circle",
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
          const label = context.label || "";
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value.toLocaleString("id-ID")} (${percentage}%)`;
        },
      },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
  },
}));
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
