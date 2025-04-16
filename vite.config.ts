
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
      // Use standard hmr in development to avoid WebSocket issues
      overlay: true,
      // Only use wss for production
      clientPort: mode === 'production' ? 443 : undefined,
      protocol: mode === 'production' ? 'wss' : 'ws',
    },
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
            "useQueries",
            "useSuspenseQuery",
            "useSuspenseInfiniteQuery",
            "useSuspenseQueries",
          ],
          "@/auth/store/auth.store": [
            "useAuthStore",
            "selectUser",
            "selectIsAuthenticated",
            "selectUserRoles",
            "selectStatus",
            "selectError",
            "selectIsLoading",
          ],
          "@/shared/stores/ui/store": [
            "useUIStore",
            "selectThemeMode",
            "selectAccentColor",
            "selectLayout",
            "selectPreferences",
          ],
          "@/shared/stores/theme/store": [
            "useThemeStore",
            "selectCurrentTheme",
            "selectThemeTokens",
            "selectThemeComponents",
          ],
          "@/shared/hooks/use-toast": ["useToast", "toast"],
          "lucide-react": [
            "Search",
            "Menu",
            "User",
            "Settings",
            "LayoutDashboard",
            "LogOut",
            "Plus",
            "Minus",
            "ChevronDown",
            "ChevronUp",
            "ChevronLeft",
            "ChevronRight",
            "X",
            "Check",
            "Edit",
            "Trash",
            "Save",
            "Upload",
            "Download",
            "Share",
            "Info",
            "AlertCircle",
            "Bell",
            "Calendar",
            "Clock",
            "Filter",
            "Home",
            "Mail",
            "MessageSquare",
            "MoreHorizontal",
            "MoreVertical",
            "Settings",
            "Star",
          ],
        },
      ],
      dirs: [
        // Feature-based structure - most specific to least specific
        "./src/features/**/components/tabs/**/sections/**",
        "./src/features/**/components/tabs/**",
        "./src/features/**/components/**",
        "./src/features/**/hooks",
        "./src/features/**/stores",
        "./src/features/**/utils",
        "./src/features/**/constants",
        
        // Global components and utilities
        "./src/components/**",
        "./src/hooks",
        "./src/stores",
        "./src/lib",
        "./src/utils",
        "./src/types",
        "./src/constants",
      ],
      dts: "./src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,  // This ensures var is used instead of const in the generated types
      },
      defaultExportByFilename: true,
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
        /\.md$/,
      ],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@constants": path.resolve(__dirname, "./src/constants"),
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
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react-router-dom", 
      "@tanstack/react-query",
      "@supabase/supabase-js",
      "@supabase/postgrest-js"
    ],
    exclude: [],
  },
}))
