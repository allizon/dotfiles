#!/bin/bash

# Zip up all files in Interface and WTF - name with date
DROPBOX_DIR='/Users/alholt/Dropbox/WoW'
ARCHIVE_NAME='wow-interface-backup'
WOW_DIR='/Applications/World of Warcraft'
INTERFACE_DIR="$WOW_DIR/Interface/"
WTF_DIR="$WOW_DIR/WTF/"
ZIPFILE="$DROPBOX_DIR/$ARCHIVE_NAME-`date +%Y-%m-%d`.tar.gz" # rubyzip needs string, not pathname

# Remove any existing archives from Dropbox
echo 'Removing existing backups...'
rm "$DROPBOX_DIR/$ARCHIVE_NAME*.tar.gz" &> /dev/null

# Create new archive in Dropbox
echo 'Creating archive...'
tar -cvzf $ZIPFILE "$INTERFACE_DIR" "$WTF_DIR" &> /dev/null
echo "WoW interface backed up! ($ZIPFILE)"
