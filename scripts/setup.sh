#!/bin/bash

# Neoma Package Template Setup Script
# This script replaces placeholders with your package details

set -e

echo "🚀 Neoma Package Template Setup"
echo "================================"
echo

# Prompt for package details
read -p "Package name (e.g., 'garmr', 'validation'): " PACKAGE_NAME
read -p "Package description: " PACKAGE_DESCRIPTION
read -p "Repository URL (e.g., https://github.com/shipdventures/neoma-garmr): " REPO_URL

echo
echo "📝 Replacing placeholders..."

# Find and replace in all relevant files
find . -type f \( -name "*.json" -o -name "*.md" -o -name "*.ts" -o -name "*.yml" \) -exec sed -i '' "s|{{PACKAGE_NAME}}|$PACKAGE_NAME|g" {} +
find . -type f \( -name "*.json" -o -name "*.md" -o -name "*.ts" -o -name "*.yml" \) -exec sed -i '' "s|{{PACKAGE_DESCRIPTION}}|$PACKAGE_DESCRIPTION|g" {} +
find . -type f \( -name "*.json" -o -name "*.md" -o -name "*.ts" -o -name "*.yml" \) -exec sed -i '' "s|{{REPO_URL}}|$REPO_URL|g" {} +

echo "✅ Placeholders replaced"

# Rename directory
echo "📁 Renaming libs/PACKAGE_NAME to libs/$PACKAGE_NAME..."
mv libs/PACKAGE_NAME "libs/$PACKAGE_NAME"

echo "✅ Directory renamed"

# Clean up setup script
echo "🧹 Removing setup script..."
rm -rf scripts

echo
echo "✅ Setup complete!"
echo
echo "Next steps:"
echo "  1. npm install"
echo "  2. npm test (start building with TDD)"
echo "  3. npm run test:e2e (add E2E tests)"
echo
echo "Happy coding! 🎉"
