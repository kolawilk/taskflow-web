#!/bin/bash

SCREENSHOTS_DIR="screenshots"
rm -rf "$SCREENSHOTS_DIR"
mkdir -p "$SCREENSHOTS_DIR"

BASE_URL="http://localhost:5178"
VIEWPORTS=("1366x768:macbook-air" "768x1024:ipad")

# Define pages as path:name pairs
PATHS=(
  "/"
  "/projects"
  "/projects/1"
  "/features/1"
  "/tasks/1"
  "/inbox"
  "/settings"
)

NAMES=(
  "dashboard"
  "project-list"
  "project-detail"
  "feature-detail"
  "task-detail"
  "inbox"
  "settings"
)

for viewport in "${VIEWPORTS[@]}"; do
  WIDTH=$(echo "$viewport" | cut -d':' -f1 | cut -d'x' -f1)
  HEIGHT=$(echo "$viewport" | cut -d':' -f1 | cut -d'x' -f2)
  NAME=$(echo "$viewport" | cut -d':' -f2)
  
  echo "Taking light mode screenshots for $NAME viewport..."
  
  for i in "${!PATHS[@]}"; do
    URL="${BASE_URL}${PATHS[$i]}"
    NAME_PART="${NAMES[$i]}"
    
    playwright screenshot "$URL" "$SCREENSHOTS_DIR/01-${NAME_PART}-light-${NAME}.png" \
      --viewport-size="$WIDTH,$HEIGHT" \
      --wait-for-timeout=1000 \
      --color-scheme=light
    
    echo "  Saved: 01-${NAME_PART}-light-${NAME}.png"
  done
  
  echo "Taking dark mode screenshots for $NAME viewport..."
  
  for i in "${!PATHS[@]}"; do
    URL="${BASE_URL}${PATHS[$i]}"
    NAME_PART="${NAMES[$i]}"
    
    playwright screenshot "$URL" "$SCREENSHOTS_DIR/01-${NAME_PART}-dark-${NAME}.png" \
      --viewport-size="$WIDTH,$HEIGHT" \
      --wait-for-timeout=1000 \
      --color-scheme=dark
    
    echo "  Saved: 01-${NAME_PART}-dark-${NAME}.png"
  done
done

echo ""
echo "All screenshots saved to $SCREENSHOTS_DIR/"
