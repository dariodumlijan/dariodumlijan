#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TMP_DIR="$REPO_ROOT/tmp"
README_PATH="$REPO_ROOT/README.md"
FEEDS_DIR="$SCRIPT_DIR/feeds"

mkdir -p "$TMP_DIR"

# Function to parse date and convert to comparable format (YYYY-MM-DD)
parse_date() {
    local date_str="$1"
    # Try to extract just the date part (YYYY-MM-DD) from various formats
    # This handles both ISO 8601 and simple YYYY-MM-DD formats
    echo "$date_str" | grep -o '^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}' || echo "1970-01-01"
}

# Variables to store the latest comic info
LATEST_DATE="1970-01-01"
LATEST_IMAGE_URL=""
LATEST_CREDITS=""

echo "Fetching comics from all feeds..."

# Loop through all feed scripts
for feed_script in "$FEEDS_DIR"/*.sh; do
    if [ -f "$feed_script" ]; then
        feed_name=$(basename "$feed_script" .sh)
        echo "Running $feed_name..."
        
        # Run the feed script and capture output
        if output=$("$feed_script" 2>/dev/null); then
            # Parse the output
            IMAGE_URL=$(echo "$output" | grep "^FUNNY_IMAGE_URL=" | cut -d'=' -f2-)
            CREDITS=$(echo "$output" | grep "^FUNNY_CREDITS=" | cut -d'=' -f2-)
            DATE=$(echo "$output" | grep "^FUNNY_DATE=" | cut -d'=' -f2-)
            
            if [ -n "$IMAGE_URL" ] && [ -n "$DATE" ]; then
                # Parse the date to get just YYYY-MM-DD
                PARSED_DATE=$(parse_date "$DATE")
                echo "  Found comic from $PARSED_DATE"
                
                # Compare dates (string comparison works for YYYY-MM-DD format)
                if [[ "$PARSED_DATE" > "$LATEST_DATE" ]] || [[ "$PARSED_DATE" == "$LATEST_DATE" ]]; then
                    LATEST_DATE="$PARSED_DATE"
                    LATEST_IMAGE_URL="$IMAGE_URL"
                    LATEST_CREDITS="$CREDITS"
                    echo "  This is now the latest comic!"
                fi
            else
                echo "  Failed to get valid data from $feed_name"
            fi
        else
            echo "  Failed to run $feed_name"
        fi
    fi
done

if [ -z "$LATEST_IMAGE_URL" ]; then
    echo "No comics found from any feed"
    exit 0
fi

echo ""
echo "Selected latest comic from date: $LATEST_DATE"
echo "Image URL: $LATEST_IMAGE_URL"
echo ""

# Update README.md with the latest comic
if [ -f "$README_PATH" ]; then
    # Create a temporary file with the updated content
    TMP_README="$TMP_DIR/README.tmp"
    
    # Read the README and update both the image URL and credits
    awk -v img="$LATEST_IMAGE_URL" -v credits="$LATEST_CREDITS" '
    {
        # Update the credits line if it starts with "Check out more comics by"
        if ($0 ~ /^Check out more comics by/) {
            print credits
        }
        # Update the image src in the img tag
        else if ($0 ~ /alt="latest_post"/) {
            gsub(/src="[^"]*"/, "src=\"" img "\"")
            print
        }
        else {
            print
        }
    }' "$README_PATH" > "$TMP_README"
    
    # Move the temporary file to replace the original
    mv "$TMP_README" "$README_PATH"

    echo "README.md updated successfully!"
else
    echo "README.md not found at $README_PATH, nothing to update"
fi
