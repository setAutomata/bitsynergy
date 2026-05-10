import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    css: false,
  },
  resolve: {
    alias: [
      {
        // Redirect pdfjs-dist to the legacy build for Node compatibility
        find: "pdfjs-dist",
        replacement: path.resolve(
          __dirname,
          "node_modules/pdfjs-dist/legacy/build/pdf.mjs",
        ),
      },
      {
        // Matches .svg, .png, etc, even if they have ?query at the end
        find: /.*\.(svg|png|jpg|jpeg|gif|webp)(\?react)?$/,
        replacement: path.resolve(
          __dirname,
          "./src/__tests__/mocks/fileMock.ts",
        ),
      },
    ],
  },
});
