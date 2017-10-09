# == VIM stuff
# === Allow in zsh
bindkey -v
bindkey '^P' up-history
bindkey '^N' down-history
bindkey '^?' backward-delete-char
bindkey '^h' backward-delete-char
bindkey '^w' backward-kill-word
bindkey '^r' history-incremental-search-backward

# function zle-line-init zle-keymap-select {
#     VIM_PROMPT="%{$fg_bold[yellow]%} [% NORMAL]% %{$reset_color%}"
#     RPS1="${${KEYMAP/vicmd/$VIM_PROMPT}/(main|viins)/} $(git_custom_status) $EPS1"
#     zle reset-prompt
# }
# zle -N zle-line-init
# zle -N zle-keymap-select
export KEYTIMEOUT=1

# Mac OSX aliases - versions in Homebrew
# VIM_VERSION='7.4.2290'
# VIM_VERSION='8.0.0066'
VIM_VERSION='8.0.0562'
alias g='/usr/local/Cellar/git/2.8.0/bin/git'
# alias vi='/usr/local/bin/mvim'
# alias vim='/usr/local/bin/mvim'
# alias vi="rvm use @global do /usr/local/Cellar/vim/$VIM_VERSION/bin/vim"
# alias vim="rvm use @global do /usr/local/Cellar/vim/$VIM_VERSION/bin/vim"
alias vi='/usr/local/bin/nvim'
alias vim='/usr/local/bin/nvim'
alias mvim="/Applications/mvim"

alias vis="vi -S Session.vim"

