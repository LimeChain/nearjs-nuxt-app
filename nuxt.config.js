// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default {
  devtools: { enabled: true },

  build: {
    // Set webpack as the builder
    builder: "webpack5",
    // Customize webpack configuration
    extend(config) {
      // Modify webpack config here
      // For example, to add a custom loader:
      config.module.rules.push({
        test: /\.csv$/,
        loader: "csv-loader",
      });

      // Return the modified config
      return config;
    },
  },

  plugins: [{ src: "~/plugins/near.js", mode: "client" }],

  vite: {
    plugins: [
      nodePolyfills({
        exclude: [
          "assert",
          "buffer",
          "child_process",
          "cluster",
          "dgram",
          "dns",
          "domain",
          "events",
          "fs",
          "http",
          "https",
          "net",
          "os",
          "path",
          "punycode",
          "querystring",
          "readline",
          "stream",
          "string_decoder",
          "timers",
          "tls",
          "tty",
          "url",
          "util",
          "vm",
          "zlib",
        ],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
    ],
  },

  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins?.push(nodePolyfills());
    },
  },

  modules: ["@nuxt/eslint"],
};
