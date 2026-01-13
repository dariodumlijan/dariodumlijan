#!/usr/bin/env bash
set -euo pipefail

CREDITS="Check out more comics by [MonkeyUser](https://www.monkeyuser.com)"
FEED_URL="https://www.monkeyuser.com"

RESPONSE=$(curl -sS "$FEED_URL" 2>/dev/null) || {
  echo "Failed to download HTML page"
  exit 1
}

IMAGE_URL=$(echo "$RESPONSE" | grep -o '<img src=/[0-9][^[:space:]>]*\.\(png\|jpg\|jpeg\)' | head -1 | sed 's/<img src=//')
DATE=$(echo "$RESPONSE" | grep -o 'datetime=[^>]*' | head -1 | sed 's/datetime=//;s/T.*//')

if [ -z "$IMAGE_URL" ] || [ -z "$DATE" ]; then
  echo "Failed to extract comic data" >&2
  exit 1
fi

IMAGE_URL="${FEED_URL}${IMAGE_URL}"

echo "FUNNY_IMAGE_URL=$IMAGE_URL"
echo "FUNNY_CREDITS=$CREDITS"
echo "FUNNY_DATE=$DATE"
