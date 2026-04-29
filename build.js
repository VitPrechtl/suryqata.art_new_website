const fs = require("fs");
const path = require("path");

const SRC = __dirname;
const DIST = path.join(__dirname, "dist");

// Files and folders to include in the build
const INCLUDE = [
  "index.html",
  "gallery.html",
  "style.css",
  "cards.css",
  "header.css",
  "responsivity.css",
  "script.js",
  "artworks",
  "images",
  "gallerycontent",
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST);

// Copy included assets
for (const item of INCLUDE) {
  const srcPath = path.join(SRC, item);
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, path.join(DIST, item));
    console.log(`Copied: ${item}`);
  } else {
    console.warn(`Skipped (not found): ${item}`);
  }
}

console.log("\nBuild complete → dist/");
