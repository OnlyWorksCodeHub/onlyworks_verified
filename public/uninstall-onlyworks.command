#!/bin/bash

echo "================================================"
echo "  OnlyWorks Desktop Uninstaller"
echo "================================================"
echo ""
echo "This will completely remove OnlyWorks Desktop"
echo "and all its data from your Mac."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "Quitting OnlyWorks Desktop..."
killall "OnlyWorks Desktop" 2>/dev/null
sleep 1

echo "Removing application..."
rm -rf "/Applications/OnlyWorks Desktop.app"

echo "Removing app data..."
rm -rf ~/Library/Application\ Support/OnlyWorks\ Desktop
rm -rf ~/Library/Application\ Support/screenshot-app

echo "Removing preferences..."
rm -f ~/Library/Preferences/com.onlyworks.desktop.plist

echo "Removing caches..."
rm -rf ~/Library/Caches/com.onlyworks.desktop

echo "Removing logs..."
rm -rf ~/Library/Logs/OnlyWorks\ Desktop

echo "Removing user settings..."
rm -rf ~/.config/Electron

echo ""
echo "================================================"
echo "  Uninstall complete!"
echo "================================================"
echo ""
echo "OnlyWorks Desktop has been removed from your Mac."
echo "You can now close this window."
echo ""
