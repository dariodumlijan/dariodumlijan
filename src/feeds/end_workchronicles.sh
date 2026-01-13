#!/usr/bin/env bash
set -euo pipefail

CREDITS="Check out more comics by [Work Chronicles](https://workchronicles.substack.com)"
FEED_URL="https://workchronicles.substack.com/feed"

REQUEST_URL="https://api.rss2json.com/v1/api.json?rss_url=$FEED_URL"
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
