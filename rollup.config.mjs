import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: "src/smartwake-card.ts",
  output: {
    file: "dist/smartwake-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    json(),
  ],
};