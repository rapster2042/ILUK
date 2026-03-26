#!/bin/bash

# Script to prepare icons for GitHub CDN hosting
# This creates a simple structure for uploading to a public GitHub repository

echo "=== Independent Life UK - Icon CDN Setup ==="
echo ""
echo "This script helps you set up icons on GitHub as a free CDN"
echo ""

# Create a temporary directory for the icon repo
TEMP_DIR="/tmp/independent-life-icons"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Copy all icon files
echo "Copying icon files..."
cp /workspace/app-8a0fiym6u1a9/public/icon-*.png "$TEMP_DIR/"
cp /workspace/app-8a0fiym6u1a9/public/apple-touch-icon.png "$TEMP_DIR/"
cp /workspace/app-8a0fiym6u1a9/public/favicon.png "$TEMP_DIR/"

# Create README
cat > "$TEMP_DIR/README.md" << 'EOF'
# Independent Life UK - PWA Icons

This repository hosts the PWA icons for the Independent Life UK application.

## Icons

- `icon-72.png` (72x72) - Android small icon
- `icon-96.png` (96x96) - Android medium icon
- `icon-128.png` (128x128) - Chrome Web Store
- `icon-144.png` (144x144) - Windows tile
- `icon-152.png` (152x152) - iPad touch icon
- `icon-192.png` (192x192) - Android home screen (PWA required)
- `icon-384.png` (384x384) - Android splash screen
- `icon-512.png` (512x512) - Android splash screen (PWA required)
- `apple-touch-icon.png` (180x180) - iOS home screen
- `favicon.png` (32x32) - Browser favicon

## Usage

These icons are served via GitHub's raw content CDN:

```
https://raw.githubusercontent.com/[USERNAME]/independent-life-icons/main/icon-192.png
```

## License

These icons are part of the Independent Life UK application developed for SAHA.
EOF

echo ""
echo "✅ Icons prepared in: $TEMP_DIR"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Create a new PUBLIC repository on GitHub:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: independent-life-icons"
echo "   - Description: PWA icons for Independent Life UK"
echo "   - Make it PUBLIC (important!)"
echo "   - Click 'Create repository'"
echo ""
echo "2. Upload files to GitHub:"
echo "   - Click 'uploading an existing file'"
echo "   - Drag and drop all files from: $TEMP_DIR"
echo "   - Or use command line:"
echo ""
echo "     cd $TEMP_DIR"
echo "     git init"
echo "     git add ."
echo "     git commit -m 'Add PWA icons'"
echo "     git branch -M main"
echo "     git remote add origin https://github.com/[YOUR-USERNAME]/independent-life-icons.git"
echo "     git push -u origin main"
echo ""
echo "3. Get the raw URLs:"
echo "   - Format: https://raw.githubusercontent.com/[USERNAME]/independent-life-icons/main/icon-192.png"
echo "   - Replace [USERNAME] with your GitHub username"
echo ""
echo "4. Update manifest.webmanifest with the new URLs"
echo ""
echo "📁 Files ready in: $TEMP_DIR"
ls -lh "$TEMP_DIR"
