import {defineConfig} from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // テストファイルの拡張子パターン
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "jsdom", // ブラウザ環境をシミュレート
  },
  resolve: {
    alias: {
      // "@/xxx" を "src/xxx" に解決する（Next.jsの設定に合わせる）
      "@": path.resolve(__dirname, "src"),
    },
  },
});
