#!/bin/zsh
echo "Backing stuff up!"

HOME_DIR='/Users/alholt'
DOTFILES_DIR="$HOME_DIR/code/dotfiles/"
DROPBOX_DIR="$HOME_DIR/Dropbox/scripts/"
ZSH_TARGET="$DOTFILES_DIR/oh-my-zsh"
ZSH_SOURCE="$HOME_DIR/.oh-my-zsh"
VIM_TARGET="$DOTFILES_DIR/vim/"
VIM_SOURCE="$HOME_DIR/.vim/"
ATOM_SOURCE="$HOME_DIR/.atom/"
ATOM_TARGET="$DOTFILES_DIR/atom/"
SUBLIME_SOURCE="$HOME_DIR//Library/Application Support/Sublime Text 3/Packages/User/"
SUBLIME_TARGET="$DOTFILES_DIR/sublime/"

echo "Copying scripts..."
cp $DROPBOX_DIR/* $DOTFILES_DIR/scripts/

echo "Copying Git config..."
cp $HOME_DIR/.gitconfig $DOTFILES_DIR

echo "Copying ZSH files..."
cd $DOTFILES_DIR
cp $ZSH_SOURCE/custom/aliases.zsh $ZSH_TARGET/custom/
cp $HOME_DIR/.zshrc $ZSH_TARGET

echo "Copying Sublime files..."
cp -R $SUBLIME_SOURCE $SUBLIME_TARGET
rm -rf $SUBLIME_TARGET/.git/ # keep .gitignore

echo "Pushing to remote..."
git aa
git ci -m "Automated backup `date +%Y-%m-%d`"
git push bb

echo "Pushing modified Vim files to their own repo..."
cd $VIM_SOURCE
git aa
git ci -m "Automated backup `date +%Y-%m-%d`"
git push bb master

echo "Pushing modified Atom files to their own repo..."
cd $ATOM_SOURCE
git aa
git ci -m "Automated backup `date +%Y-%m-%d`"
git push origin master

echo
echo "Done!"