import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import { dts } from "rollup-plugin-dts";
import css from "rollup-plugin-import-css";

const packageJson = require("./package.json");
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const tailwindConfig = require("./tailwind.config.js");

export default [
  {
    input: "src/index.ts",
    external: ["react", "react-dom"],
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      postcss({
        config: {
          path: "./postcss.config.js",
        },
        extensions: [".css"],
        plugins: [tailwindcss(tailwindConfig)],
        minimize: true,
        inject: {
          insertAt: "top",
        },
        extract: true,
      }),
      css(),
      resolve(),
      commonjs(),
      // typescript({ jsx: "react", tsconfig: "./tsconfig.json" }),
      terser(),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript', 'jsx'],  
      }),
    ],
  },
  // {
  //   input: "dist/esm/index.d.ts",
  //   output: [{ file: "dist/index.d.ts", format: "esm" }],
  //   plugins: [dts()],
  //   external: [/\.css$/],
  // },
];
