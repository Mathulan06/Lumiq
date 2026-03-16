import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { componentTagger } from "lovable-tagger";

const MY_PHOTOS_DIR = path.resolve(__dirname, "my photos");
const ASSETS_DIR = path.resolve(__dirname, "src/assets/my-photos");
const VALID_CATEGORIES = ["landscape", "portrait", "nature", "street"];
const IMAGE_EXTS = [".jpg", ".jpeg", ".heic", ".png", ".webp"];

// Read EXIF orientation from a file via sips
function getOrientation(filePath: string): number {
  try {
    const out = execSync(`sips -g orientation "${filePath}" 2>/dev/null`).toString();
    const m = out.match(/orientation:\s*(\d+)/);
    return m ? parseInt(m[1]) : 1;
  } catch {
    return 1;
  }
}

// Map EXIF orientation → sips -r degrees (counter-clockwise)
function rotationArg(orientation: number): string {
  switch (orientation) {
    case 3: return "-r 180";
    case 6: return "-r -90"; // shot in portrait, tilted right
    case 8: return "-r 90";  // shot in portrait, tilted left
    default: return "";
  }
}

function photoSyncPlugin(): Plugin {
  return {
    name: "photo-sync",
    configureServer(server) {
      // Ensure category folders exist on both sides
      VALID_CATEGORIES.forEach((cat) => {
        fs.mkdirSync(path.join(MY_PHOTOS_DIR, cat), { recursive: true });
        fs.mkdirSync(path.join(ASSETS_DIR, cat), { recursive: true });
        server.watcher.add(path.join(MY_PHOTOS_DIR, cat));
      });

      server.watcher.on("add", (filePath) => {
        if (!filePath.startsWith(MY_PHOTOS_DIR)) return;
        const rel = path.relative(MY_PHOTOS_DIR, filePath);
        const parts = rel.split(path.sep);
        if (parts.length !== 2) return; // ignore root-level or nested files
        const [category, filename] = parts;
        if (!VALID_CATEGORIES.includes(category)) return;
        const ext = path.extname(filename).toLowerCase();
        if (!IMAGE_EXTS.includes(ext)) return;

        const baseName = path.basename(filename, path.extname(filename));
        const destPath = path.join(ASSETS_DIR, category, `${baseName}.jpg`);

        try {
          const rot = rotationArg(getOrientation(filePath));
          execSync(
            `sips ${rot} -s format jpeg --resampleWidth 1600 "${filePath}" --out "${destPath}" 2>/dev/null`
          );
          server.ws.send({ type: "full-reload" });
          server.config.logger.info(
            `\x1b[36m[photo-sync]\x1b[0m ✓ Added ${category}/${baseName}.jpg${rot ? ` (auto-rotated)` : ""}`
          );
        } catch {
          server.config.logger.error(
            `[photo-sync] Failed to process: ${filename}`
          );
        }
      });

      server.watcher.on("unlink", (filePath) => {
        if (!filePath.startsWith(MY_PHOTOS_DIR)) return;
        const rel = path.relative(MY_PHOTOS_DIR, filePath);
        const parts = rel.split(path.sep);
        if (parts.length !== 2) return;
        const [category, filename] = parts;
        if (!VALID_CATEGORIES.includes(category)) return;

        const baseName = path.basename(filename, path.extname(filename));
        const destPath = path.join(ASSETS_DIR, category, `${baseName}.jpg`);

        if (fs.existsSync(destPath)) {
          fs.unlinkSync(destPath);
          server.ws.send({ type: "full-reload" });
          server.config.logger.info(
            `\x1b[36m[photo-sync]\x1b[0m ✗ Removed ${category}/${baseName}.jpg`
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  assetsInclude: ["**/*.JPG", "**/*.JPEG", "**/*.HEIC"],
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    photoSyncPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
