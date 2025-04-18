
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"
import AutoImport from "unplugin-auto-import/vite"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      overlay: true,
      clientPort: mode === 'production' ? 443 : undefined,
      protocol: mode === 'production' ? 'wss' : 'ws',
      timeout: 5000,
      reconnect: true,
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    AutoImport({
      imports: [
        "react",
        "react-router-dom",
        {
          "@tanstack/react-query": [
            "useQuery",
            "useMutation",
            "useQueryClient",
            "useInfiniteQuery",
          ],
          "@/shared/hooks/use-toast": ["useToast", "toast"],
          "lucide-react": [
            "Home",
            "Settings",
            "Menu",
            "Info",
            "Search",
            "User",
            "LogOut",
            "Plus",
            "X",
            "Check",
          ],
        },
      ],
      dirs: [
        "./src/features/**/components/**",
        "./src/features/**/hooks",
        "./src/features/**/stores",
        "./src/components/**",
        "./src/hooks",
        "./src/stores",
        "./src/utils",
      ],
      dts: "./src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      }
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@features": path.resolve(__dirname, "./src/features"),
    }
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          tanstack: ["@tanstack/react-query"],
        },
      },
    },
  }
}))
