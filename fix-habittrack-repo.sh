#!/usr/bin/env bash
# Run this from the ROOT of your HabitTrack-ai-integrted repo clone.
# It fixes two real bugs:
#   1. backend/config/db.js crashes with an unhandled TypeError on startup
#      if MONGO_URI isn't set, instead of the intended clean error message.
#   2. frontend/ is missing a package.json — the actual Vite project is
#      nested one folder deeper, so `cd frontend && npm install` (as the
#      README instructs) fails with ENOENT.
set -euo pipefail

if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "Run this script from the repo root (the folder containing backend/ and frontend/)."
  exit 1
fi

echo "==> Fixing backend/config/db.js (crash on missing MONGO_URI)..."
python3 - <<'PY'
import re
path = "backend/config/db.js"
with open(path) as f:
    content = f.read()

old = '''import mongoose from "mongoose";
console.log(process.env.MONGO_URI.replace(/:(.*?)@/, ":******@"));
export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(uri);'''

new = '''import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined");
    }

    console.log(uri.replace(/:(.*?)@/, ":******@"));

    const conn = await mongoose.connect(uri);'''

if old not in content:
    print("  (skipped: file doesn't match expected content — may already be fixed)")
else:
    content = content.replace(old, new)
    with open(path, "w") as f:
        f.write(content)
    print("  done.")
PY

echo "==> Fixing frontend/ folder structure (nested Vite project)..."
if [ -d "frontend/ai-habit-tracker-ui-boilerplate-code" ]; then
  rm -f frontend/package-lock.json   # stray empty lockfile at the wrong level
  # move tracked + dotfiles up one level
  find "frontend/ai-habit-tracker-ui-boilerplate-code" -mindepth 1 -maxdepth 1 -exec mv -t frontend/ {} +
  rmdir "frontend/ai-habit-tracker-ui-boilerplate-code"
  echo "  done."
else
  echo "  (skipped: nested folder not found — may already be fixed)"
fi

echo ""
echo "All done. Verify with:"
echo "  cd frontend && npm install && npm run dev"
echo "  cd ../backend && npm install && npm run dev"
echo ""
echo "Then review the changes and commit:"
echo "  git add -A && git commit -m 'Fix db.js startup crash and flatten frontend folder structure'"
