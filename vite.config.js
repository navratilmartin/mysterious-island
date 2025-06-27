import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                islandLevel: resolve(__dirname, "src/levels/island/index.html"),
                pirateLevel: resolve(__dirname, "src/levels/pirate-level/index.html"),
                end: resolve(__dirname, "src/levels/end-screen/index.html"),
            },
        },
    },
    server: {
        port: 4173,
    }
});
