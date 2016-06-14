#!/bin/zsh
echo "Backing stuff up!"

HOME_DIR='/Users/alholt'
DOTFILES_DIR="$HOME_DIR/code/dotfiles/"
DROPBOX_DIR="$HOME_DIR/Dropbox/scripts/"
ZSH_TARGET="$DOTFILES_DIR/oh-my-zsh"
ZSH_SOURCE="$HOME_DIR/.oh-my-zsh"
VIM_SOURCE="$HOME_DIR/.vim/"
ATOM_SOURCE="$HOME_DIR/.atom/"
SUBLIME_SOURCE="$HOME_DIR//Library/Application Support/Sublime Text 3/Packages/User/"
BACKUP_STRING="Automated backup `date +%Y-%m-%d`"

echo "Copying scripts..."
cp $DROPBOX_DIR/* $DOTFILES_DIR/scripts/

echo "Copying Git config..."
cp $HOME_DIR/.gitconfig $DOTFILES_DIR

echo "Copying ZSH files..."
cd $DOTFILES_DIR
cp $ZSH_SOURCE/custom/aliases.zsh $ZSH_TARGET/custom/
cp $HOME_DIR/.zshrc $ZSH_TARGET

echo "Pushing to remote..."
git aa && git ci -m $BACKUP_STRING && git push bb

echo "Pushing modified Sublime files to their own repo..."
cd $SUBLIME_SOURCE
git aa && git ci -m $BACKUP_STRING && git push bb

echo "Pushing modified Vim files to their own repo..."
cd $VIM_SOURCE
git aa && git ci -m $BACKUP_STRING && git push bb

echo "Pushing modified Atom files to their own repo..."
cd $ATOM_SOURCE
git aa && git ci -m $BACKUP_STRING && git push origin

echo
echo "Done!"