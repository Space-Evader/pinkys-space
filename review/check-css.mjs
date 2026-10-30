import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const relative of ["assets/space.css", "assets/fashion.css", "assets/hotline.css"]) {
  const stylesheet = path.join(root, relative);
  postcss.parse(fs.readFileSync(stylesheet, "utf8"), { from: stylesheet });
}

let inlineCount = 0;
for (const relative of ["index.html", "fashion.html", "checkout.html", "review/editor.html"]) {
  const filename = path.join(root, relative);
  const html = fs.readFileSync(filename, "utf8");
  for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) {
    postcss.parse(match[1], { from: filename + "#inline-style-" + (++inlineCount) });
  }
}
console.log("PASS: project stylesheet and " + inlineCount + " inline stylesheet(s) parse with the pinned PostCSS dependency.");
