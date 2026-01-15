#!/usr/bin/env bash
set -euo pipefail

CREDITS="Check out more comics by [comiCSS](https://comicss.art)"
FEED_URL="https://comicss.art/rss.xml"

# Check if API key is provided
if [ -z "${RSS2JSON_API_KEY:-}" ]; then
  echo "Error: RSS2JSON_API_KEY environment variable is not set" >&2
  exit 1
fi

ENCODED_FEED_URL=$(printf '%s' "$FEED_URL" | jq -sRr @uri)
REQUEST_URL="https://api.rss2json.com/v1/api.json?rss_url=${ENCODED_FEED_URL}&api_key=${RSS2JSON_API_KEY}&order_by=pubDate&order_dir=desc&count=1"

RESPONSE=$(curl -sS "$REQUEST_URL" 2>/dev/null) || {
  echo "Failed to download RSS feed via API" >&2
  exit 1
}

if echo "$RESPONSE" | grep -q '"status":"error"'; then
  echo "rss2json API returned an error for feed" >&2
  exit 1
fi

IMAGE_URL=$(echo "$RESPONSE" | grep -o '"enclosure":{[^}]*}' | head -1 | grep -o '"link":"[^"]*"' | sed 's/"link":"//;s/"$//')
DATE=$(echo "$RESPONSE" | grep -o '"pubDate":"[^"]*"' | head -1 | sed 's/"pubDate":"//;s/"$//')

if [ -z "$IMAGE_URL" ] || [ -z "$DATE" ]; then
  echo "Failed to extract comic data" >&2
  exit 1
fi

echo "FUNNY_IMAGE_URL=$IMAGE_URL"
echo "FUNNY_CREDITS=$CREDITS"
echo "FUNNY_DATE=$DATE"
