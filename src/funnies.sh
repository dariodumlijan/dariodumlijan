#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TMP_DIR="$REPO_ROOT/tmp"
README_PATH="$REPO_ROOT/README.md"

mkdir -p "$TMP_DIR"

FEED_URL="https://workchronicles.substack.com/feed"

echo "Downloading RSS feed via RSS2JSON API..."
# Use RSS2JSON API to bypass Cloudflare - much more reliable
RSS2JSON_URL="https://api.rss2json.com/v1/api.json?rss_url=$FEED_URL"

curl -sS "$RSS2JSON_URL" -o "$TMP_DIR/response.json" || {
  echo "Failed to download RSS feed via API, exiting gracefully"
  exit 0
}

# Extract the first item's enclosure URL from JSON without jq
# Read the file and extract the first enclosure link using grep and sed
IMAGE_URL=$(grep -o '"enclosure":{[^}]*}' "$TMP_DIR/response.json" | head -1 | grep -o '"link":"[^"]*"' | sed 's/"link":"//;s/"$//')


if [ -z "$IMAGE_URL" ]; then
  echo "No <enclosure> url found in the latest post"
  exit 0
fi

echo "Found image URL: $IMAGE_URL"

if [ -f "$README_PATH" ]; then
  # Use different sed syntax depending on platform
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "/alt=\"latest_post\"/s|src=\"[^\"]*\"|src=\"$IMAGE_URL\"|" "$README_PATH"
  else
    sed -i "/alt=\"latest_post\"/s|src=\"[^\"]*\"|src=\"$IMAGE_URL\"|" "$README_PATH"
  fi
  
  echo "README.md updated successfully!"
else
  echo "README.md not found at $README_PATH, nothing to update"
fi
