#!/bin/zsh
echo "Backing stuff up!"

HOME_DIR='/Users/alholt'
DOTFILES_DIR="$HOME_DIR/code/dotfiles/"
DROPBOX_DIR="$HOME_DIR/Dropbox/scripts/"
ZSH_TARGET="$DOTFILES_DIR/oh-my-zsh"
ZSH_SOURCE="$HOME_DIR/.oh-my-zsh"
VIM_TARGET="$DOTFILES_DIR/vim/"
VIM_SOURCE="$HOME_DIR/.vim/"

echo "Copying scripts..."
cp $DROPBOX_DIR/* $DOTFILES_DIR/scripts/

echo "Copying Git config..."
cp $HOME_DIR/.gitconfig $DOTFILES_DIR

# Copy dotfiles to github directory
echo "Copying ZSH files..."
cd $DOTFILES_DIR
cp $ZSH_SOURCE/custom/aliases.zsh $ZSH_TARGET/custom/
cp $HOME_DIR/.zshrc $ZSH_TARGET

# Push .vim to github
echo "Copying Vim files..."
cp $HOME_DIR/.vimrc $VIM_TARGET
cp -R $VIM_SOURCE/* $VIM_TARGET
ls -la $VIM_TARGET

echo "Pushing to remote..."
git aa
git ci -m "Automated backup `date +%Y-%m-%d`"
git push bb

echo "Done!"