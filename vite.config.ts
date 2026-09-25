import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig } from "vite";

const aliases = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  "@scss": fileURLToPath(new URL("./src/assets/scss", import.meta.url)),
};

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => ({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(root, "index.html"),
        services: path.resolve(root, "pages/services/index.html"),
        cases: path.resolve(root, "pages/cases/index.html"),
        about: path.resolve(root, "pages/about/index.html"),
        blog: path.resolve(root, "pages/blog/index.html"),
        faq: path.resolve(root, "pages/faq/index.html"),
        contacts: path.resolve(root, "pages/contacts/index.html"),
        privacy: path.resolve(root, "pages/privacy/index.html"),
        // ======================== inner services ========================
        faqbots: path.resolve(root, "pages/services/faqbots/index.html"),
        landingpage: path.resolve(root, "pages/services/landingpage/index.html"),
        content: path.resolve(root, "pages/services/content/index.html"),
        quizzes: path.resolve(root, "pages/services/quizzes/index.html"),
        // ================================================================
        err404: path.resolve(root, "pages/error/index.html"),
      },
    },
  },
  resolve: {
    alias: aliases,
  },
  plugins: [],
  css: {
    postcss: "./postcss.config.js",
    devSourcemap: mode === "development",
  },
}));
