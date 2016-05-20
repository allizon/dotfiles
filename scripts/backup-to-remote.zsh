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

echo "Copying scripts..."
cp $DROPBOX_DIR/* $DOTFILES_DIR/scripts/

echo "Copying Git config..."
cp $HOME_DIR/.gitconfig $DOTFILES_DIR

echo "Copying ZSH files..."
cd $DOTFILES_DIR
cp $ZSH_SOURCE/custom/aliases.zsh $ZSH_TARGET/custom/
cp $HOME_DIR/.zshrc $ZSH_TARGET

echo "Copying Vim files..."
cp $HOME_DIR/.vimrc $VIM_TARGET
cp -R $VIM_SOURCE/* $VIM_TARGET
ls -la $VIM_TARGET

echo "Copying Atom files..."
cp -R $ATOM_SOURCE $ATOM_TARGET
rm -rf $ATOM_TARGET/.git*

echo "Pushing to remote..."
git aa
git ci -m "Automated backup `date +%Y-%m-%d`"
git push bb

echo "Done!"