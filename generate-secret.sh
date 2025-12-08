#!/bin/bash

# Generate secure SECRET_KEY for deployment

echo "========================================="
echo "   SECRET_KEY Generator"
echo "========================================="
echo ""

SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))")

echo "Your SECRET_KEY:"
echo ""
echo "$SECRET_KEY"
echo ""
echo "========================================="
echo ""
echo "Copy this key and use it in:"
echo "- Render: Environment Variables"
echo "- Railway: Variables"
echo "- Any other deployment platform"
echo ""
echo "⚠️  Keep this secret! Never commit to Git!"
echo "========================================="
