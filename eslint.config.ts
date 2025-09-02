import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import { globalIgnores } from "eslint/config";

// ⬇️ Pastikan file bernama eslint.config.ts (bukan eslint.configt.ts)

export default defineConfigWithVueTs(
  // files yang dilint
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  // ignore build outputs
  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  // Vue base rules
  pluginVue.configs["flat/essential"],

  // TS rekomendasi dari @vue/eslint-config-typescript
  vueTsConfigs.recommended,

  // Vitest hanya untuk test files
  {
    ...pluginVitest.configs.recommended,
    files: ["**/__tests__/**", "**/*.test.*", "**/*.spec.*"],
  },

  // Aturan tambahan: jangan ganggu formatting (biar Prettier yang pegang)
  {
    rules: {
      // Hindari “bentrok” opini format
      "max-len": "off",
      quotes: "off",
      semi: "off",
      "no-multiple-empty-lines": "off",

      // Quality of life
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },

  // ⬇️ Letakkan paling AKHIR agar menonaktifkan semua formatting rules yang bisa konflik dgn Prettier
  skipFormatting,
);
