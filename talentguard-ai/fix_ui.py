"""
Strip emojis from all JSX/JS files in frontend/src
and fix retention planner status bug
"""
import pathlib, re

# Emoji unicode ranges to strip
EMOJI_RE = re.compile(
    "[\U00002600-\U000027FF"   # Misc symbols, dingbats
    "\U0001F300-\U0001F9FF"   # Misc symbols and pictographs, emoticons
    "\U0001FA00-\U0001FA6F"   # Chess/symbols extended
    "\U0001FA70-\U0001FAFF"   # Symbols extended-A
    "\u2702-\u27B0"
    "\u24C2-\U0001F251"
    "]+",
    flags=re.UNICODE
)

# Process all JSX/JS files in src
src = pathlib.Path("frontend/src")
count = 0
for f in src.rglob("*.jsx"):
    original = f.read_text(encoding="utf-8")
    cleaned = EMOJI_RE.sub("", original)
    if cleaned != original:
        f.write_text(cleaned, encoding="utf-8")
        print(f"Cleaned emojis: {f.name}")
        count += 1
    else:
        print(f"No emojis: {f.name}")

for f in src.rglob("*.js"):
    if "node_modules" in str(f):
        continue
    original = f.read_text(encoding="utf-8")
    cleaned = EMOJI_RE.sub("", original)
    if cleaned != original:
        f.write_text(cleaned, encoding="utf-8")
        print(f"Cleaned emojis: {f.name}")
        count += 1

print(f"\nTotal files modified: {count}")

# Fix retention planner status values
rp_path = pathlib.Path("frontend/src/pages/RetentionPlanner.jsx")
rp = rp_path.read_text(encoding="utf-8")

# Fix isPending check: PENDING_APPROVAL not pending
rp = rp.replace(
    "const isPending = d.status === 'pending';",
    "const isPending = d.status === 'PENDING_APPROVAL' || d.status === 'pending';"
)
# Fix status-based filtering display
rp = rp.replace("status-${d.status}", "status-${(d.status || '').toLowerCase().replace(/_/g, '_')}")

rp_path.write_text(rp, encoding="utf-8")
print("\nFixed retention planner status check")
print("Done!")
