<script setup lang="ts">
import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";
import { computed } from "vue";
import { Line } from "vue-chartjs";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  data: number[];
  labels: string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  title?: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ["#3b82f6"],
  height: 300,
  showLegend: false,
  title: "",
  label: "Data",
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.data,
      borderColor: props.colors[0],
      backgroundColor: props.colors[0] + "40",
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: props.colors[0],
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
    },
  ],
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
      grid: {
        display: true,
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
    <Line :data="chartData" :options="chartOptions as any" />
  </div>
</template>

