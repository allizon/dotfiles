#!/bin/zsh
echo "Backing stuff up!"

DOTFILES_DIR="$HOME/code/dotfiles/"
DROPBOX_DIR="$dropbox/scripts/"

ZSH_TARGET="$DOTFILES_DIR/oh-my-zsh"
ZSH_SOURCE="$HOME/.oh-my-zsh"
VIM_SOURCE="$HOME/.vim/"
NEOVIM_TARGET="$DOTFILES_DIR/.config/nvim/"
ALLI_MAKEFILE_TARGET="$DOTFILES_DIR/alli.makefile"
ATOM_SOURCE="$HOME/.atom/"
SUBLIME_SOURCE="$HOME/Library/Application Support/Sublime Text 3/Packages/User/"
BACKUP_STRING="Automated backup `date +%Y-%m-%d`"

echo "Copying scripts..."
cp $DROPBOX_DIR/* $DOTFILES_DIR/scripts/

echo "Copying Git config..."
cp $HOME/.gitconfig $DOTFILES_DIR

echo "Copying NeoVim config..."
cp $HOME/.config/nvim/* $NEOVIM_TARGET

echo "Copying custom Portal makefile..."
cp $portal/allistuff/Makefile $DOTFILES_DIR/allistuff/Makefile

echo "Copying ZSH files..."
cd $DOTFILES_DIR
cp $ZSH_SOURCE/custom/* $ZSH_TARGET/custom/
cp $HOME/.zshrc $ZSH_TARGET

echo "Pushing to remote..."
git aa && git ci -m $BACKUP_STRING && git push gh

# echo "Pushing modified Sublime files to their own repo..."
# cd $SUBLIME_SOURCE
# git aa && git ci -m $BACKUP_STRING && git push bb

# echo "Pushing modified Vim files to their own repo..."
# cd $VIM_SOURCE
# git aa && git ci -m $BACKUP_STRING && git push bb

# echo "Pushing modified Atom files to their own repo..."
# cd $ATOM_SOURCE
# git aa && git ci -m $BACKUP_STRING && git push origin

echo
echo "Done!"
