"""Dependency-free source validation for the editable website entrypoints.

Run from any directory with Python 3 and Node on PATH. The preserved historical
HTML page is intentionally outside structural validation; it remains a baseline
artifact. No network calls, browser, Pillow, or another project's packages are used.
"""

from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent.parent
ENTRYPOINTS = ("index.html", "fashion.html", "checkout.html", "review/editor.html")
VOID_TAGS = frozenset(
    "area base br col embed hr img input link meta param source track wbr".split()
)
NODE = shutil.which("node")


def require(condition, message):
    if not condition:
        raise ValueError(message)


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.stack = []
        self.ids = set()
        self.references = []
        self.aria_references = []
        self.inline_scripts = []
        self.script = None
        self.cards = 0
        self.photo_indices = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        line = self.getpos()[0]
        if "id" in attrs:
            identifier = attrs["id"]
            require(identifier, f"{self.path}:{line}: empty id")
            require(identifier not in self.ids, f"{self.path}:{line}: duplicate id {identifier}")
            self.ids.add(identifier)
        for attr in ("aria-labelledby", "aria-describedby"):
            if attrs.get(attr):
                self.aria_references.extend((line, item) for item in attrs[attr].split())
        if tag == "img":
            require("alt" in attrs, f"{self.path}:{line}: image lacks alt attribute")
        if tag == "a" and attrs.get("target") == "_blank":
            require("noopener" in attrs.get("rel", "").split(), f"{self.path}:{line}: external window lacks noopener")
        for attr in ("href", "src"):
            if attrs.get(attr):
                self.references.append((line, attrs[attr]))
        if attrs.get("srcset"):
            for candidate in attrs["srcset"].split(","):
                parts = candidate.strip().split()
                require(1 <= len(parts) <= 2, f"{self.path}:{line}: malformed srcset candidate")
                if len(parts) == 2:
                    require(re.fullmatch(r"(?:[1-9][0-9]*w|(?:[0-9]+(?:\.[0-9]+)?)x)", parts[1]), f"{self.path}:{line}: malformed srcset descriptor")
                self.references.append((line, parts[0]))
        classes = attrs.get("class", "").split()
        if "portfolio-card" in classes:
            self.cards += 1
        if "portfolio-open" in classes:
            require(tag == "a" and attrs.get("href"), f"{self.path}:{line}: portfolio image lacks native link")
            require(attrs.get("data-photo", "").isdigit(), f"{self.path}:{line}: invalid portfolio image reference")
            self.photo_indices.append(int(attrs["data-photo"]))
        if tag == "script" and not attrs.get("src"):
            self.script = []
        if tag not in VOID_TAGS:
            self.stack.append((tag, line))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        line = self.getpos()[0]
        require(self.stack, f"{self.path}:{line}: unexpected closing tag {tag}")
        require(self.stack[-1][0] == tag, f"{self.path}:{line}: closing {tag}, expected {self.stack[-1][0]}")
        self.stack.pop()
        if tag == "script" and self.script is not None:
            self.inline_scripts.append("".join(self.script))
            self.script = None

    def handle_data(self, data):
        if self.script is not None:
            self.script.append(data)

    def finish(self):
        self.close()
        require(not self.stack, f"{self.path}: unclosed tags {self.stack}")
        for line, identifier in self.aria_references:
            require(identifier in self.ids, f"{self.path}:{line}: missing ARIA target {identifier}")


def node_check(source=None, path=None):
    command = [NODE, "--check"]
    if path is not None:
        command.append(str(path))
    result = subprocess.run(command, input=source, text=True, capture_output=True, cwd=ROOT)
    require(result.returncode == 0, f"JavaScript syntax failed: {path or 'inline script'}\n{result.stderr}")


def local_reference(base, value):
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        require(parsed.scheme in ("https", "http", "mailto", "tel"), f"{base}: unsupported URL scheme in {value}")
        return None
    path = unquote(parsed.path)
    target = (ROOT / path.lstrip("/") if path.startswith("/") else base.parent / path).resolve() if path else base
    require(target.is_relative_to(ROOT), f"{base}: local reference escapes project: {value}")
    require(target.is_file(), f"{base}: missing local file: {value}")
    return target, unquote(parsed.fragment)


def content_data():
    # The content files use JavaScript object literals; Node's built-in VM reads
    # them without requiring a bundler or third-party parser.
    script = """
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({ window: {} });
for (const path of ['content/archive.js', 'content/portfolio.js']) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), context, {timeout: 1000});
}
process.stdout.write(JSON.stringify({
  archive: context.window.PINKYS_ARCHIVE,
  portfolio: context.window.PINKYS_PORTFOLIO
}));
"""
    result = subprocess.run([NODE, "-e", script], text=True, capture_output=True, cwd=ROOT)
    require(result.returncode == 0, f"Content data could not be read:\n{result.stderr}")
    return json.loads(result.stdout)


def main():
    require(NODE, "Node is required for JavaScript syntax validation.")
    documents = {}
    for name in ENTRYPOINTS:
        path = ROOT / name
        document = Document(name)
        document.feed(path.read_text(encoding="utf-8"))
        document.finish()
        documents[path] = document
        for script in document.inline_scripts:
            node_check(source=script)
    for directory in ("assets", "content"):
        for path in sorted((ROOT / directory).glob("*.js")):
            node_check(path=path)
    data = content_data()
    require(isinstance(data.get("archive"), list), "Archive data must be a list.")
    dynamic_chapters = {"chapter-" + chapter["id"] for chapter in data["archive"]}
    for path, document in documents.items():
        for line, value in document.references:
            reference = local_reference(path, value)
            if reference is None:
                continue
            target, fragment = reference
            if fragment:
                require(target in documents, f"{document.path}:{line}: anchor target is not a validated page: {value}")
                exists = fragment in documents[target].ids
                # Chapter articles are rendered from archive.js at runtime.
                # Do not require nonexistent static/no-JS copies of every chapter.
                exists = exists or (target == ROOT / "index.html" and fragment in dynamic_chapters)
                require(exists, f"{document.path}:{line}: missing anchor {value}")
        print(f"PASS: {document.path}: balanced HTML, unique IDs, ARIA targets, anchors, files and srcsets")
    portfolio = data.get("portfolio")
    require(isinstance(portfolio, list) and len(portfolio) == 23, "Expected 23 supplied portfolio records.")
    index = documents[ROOT / "index.html"]
    require(index.cards == 23, f"Expected 23 portfolio cards, found {index.cards}.")
    require(sorted(index.photo_indices) == list(range(23)), "Gallery must reference each of the 23 portfolio records exactly once.")
    media = set()
    for photo in portfolio:
        require(photo.get("alt") and photo.get("caption"), f"Missing descriptive metadata: {photo.get('id')}")
        require(isinstance(photo.get("width"), int) and photo["width"] > 0, f"Missing image width: {photo.get('id')}")
        require(isinstance(photo.get("height"), int) and photo["height"] > 0, f"Missing image height: {photo.get('id')}")
        for key in ("image", "full"):
            ref = local_reference(ROOT / "index.html", photo[key])
            require(ref is not None, "Portfolio images must use local files.")
            media.add(ref[0])
        require(isinstance(photo.get("sources"), list) and photo["sources"], f"Missing responsive sources: {photo.get('id')}")
        for source in photo["sources"]:
            require(isinstance(source.get("width"), int) and source["width"] > 0, "Responsive source width must be positive.")
            ref = local_reference(ROOT / "index.html", source["src"])
            require(ref is not None, "Responsive portfolio sources must be local.")
            media.add(ref[0])
    webps = set((ROOT / "assets/portfolio").glob("*.webp"))
    require(len(webps) == 46, f"Expected 46 optimized WebP files, found {len(webps)}.")
    require(media == webps, "Portfolio data and the 46 shipped WebP files differ.")
    for chapter in data["archive"]:
        for entry in chapter.get("entries", []):
            if entry.get("image"):
                local_reference(ROOT / "index.html", entry["image"])
            for source in entry.get("sources", []):
                local_reference(ROOT / "index.html", source["src"])
    print("PASS: external and inline JavaScript syntax; 23 gallery references; 46 local responsive WebP files")

    # Verify the shipped bytes against the recorded provenance, without Pillow
    # or Git. Browser decoding is a separate check in check-browser.mjs.
    import hashlib

    def git_blob_sha(payload):
        header = b"blob " + str(len(payload)).encode("ascii") + b"\0"
        return hashlib.sha1(header + payload).hexdigest()

    provenance = json.loads((ROOT / "review/image-sources.json").read_text(encoding="utf-8"))
    records = provenance.get("records")
    require(isinstance(records, list) and len(records) == 23, "Image provenance must contain 23 records.")
    require(
        {record["id"] for record in records} == {photo["id"] for photo in portfolio},
        "Image provenance record IDs differ from the portfolio.",
    )
    recorded_media = set()
    derivative_count = 0
    for record in records:
        derivatives = record.get("derivatives")
        require(isinstance(derivatives, list), f"Missing provenance derivatives: {record['id']}")
        for derivative in derivatives:
            derivative_count += 1
            ref = local_reference(ROOT / "index.html", derivative["src"])
            require(ref is not None and ref[0] in webps, f"Provenance derivative is not a shipped portfolio WebP: {derivative['src']}")
            path = ref[0]
            require(path not in recorded_media, f"Duplicate provenance derivative: {derivative['src']}")
            recorded_media.add(path)
            payload = path.read_bytes()
            require(len(payload) == derivative["bytes"], f"Derivative byte count changed: {derivative['src']}")
            require(hashlib.sha256(payload).hexdigest() == derivative["sha256"], f"Derivative SHA-256 changed: {derivative['src']}")
            require(git_blob_sha(payload) == derivative["git_blob_sha"], f"Derivative Git blob SHA changed: {derivative['src']}")
            require(
                len(payload) >= 12 and payload[:4] == b"RIFF" and payload[8:12] == b"WEBP",
                f"Invalid RIFF/WebP signature: {derivative['src']}",
            )
            require(
                int.from_bytes(payload[4:8], "little") + 8 == len(payload),
                f"Invalid RIFF/WebP file length: {derivative['src']}",
            )
    require(derivative_count == 46, f"Expected 46 provenance derivatives, found {derivative_count}.")
    require(recorded_media == webps, "Image provenance and the shipped portfolio WebP set differ.")
    for relative, expected in {
        "CNAME": "92f35745295df6e529e320c40716e89909fd135b",
        "pinky-final-wave.html": "1b132b6dcfbbaa4a94f64700f2a8bee058642a47",
    }.items():
        require(git_blob_sha((ROOT / relative).read_bytes()) == expected, f"Preserved baseline file changed: {relative}")
    print("PASS: 23 provenance records, 46 derivative byte counts/hashes/WebP headers, and two preserved baseline blobs")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, KeyError, TypeError, json.JSONDecodeError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        sys.exit(1)
