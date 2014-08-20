# Path to your oh-my-zsh configuration.
ZSH=/Users/alholt/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# ZSH_THEME="arrow"
ZSH_THEME="clean"
# ZSH_THEME="jispwoso"
# time that oh-my-zsh is loaded.
# ZSH_THEME="random"

# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# Set this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Uncomment this to disable bi-weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment to change how often to auto-update? (in days)
# export UPDATE_ZSH_DAYS=13

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want to disable command autocorrection
# DISABLE_CORRECTION="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# Uncomment following line if you want to disable marking untracked files under
# VCS as dirty. This makes repository status check for large repositories much,
# much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment following line if you want to the command execution time stamp shown
# in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
plugins=(git github rails osx ruby)
# Example format: plugins=(rails git textmate ruby lighthouse)

source $ZSH/oh-my-zsh.sh

# User configuration

export PATH="/usr/local/bin:/opt/local/bin:/opt/local/sbin:/Users/alholt/pear/bin:/Applications/Postgres.app/Contents/MacOS/bin:/bin:/sbin:/usr/bin:/usr/sbin:/Users/alholt/bin:/opt/local/bin"
# export MANPATH="/usr/local/man:$MANPATH"

# # Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/dsa_id"

# bindkey -v
# export KEYTIMEOUT=1
# function zle-line-init zle-keymap-select {
#   VIM_PROMPT="%{$fg_bold[yellow]%} [% VIM]% %{$reset_color%}"
#   RPS1="${${KEYMAP/vicmd/$VIM_PROMPT}/(main|viins)/} $EPS1"
#   zle reset-prompt
# }
# zle -N zle-line-init
# zle -N zle-keymap-select

# # Use vim cli mode
# bindkey '^P' up-history
# bindkey '^N' down-history

# # backspace and ^h working even after
# # returning from command mode
# bindkey '^?' backward-delete-char
# bindkey '^h' backward-delete-char

# # ctrl-w removed word backwards
# bindkey '^w' backward-kill-word

# # ctrl-r starts searching history backward
# bindkey '^r' history-incremental-search-backward


eval "$(rbenv init -)"
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

export P4CONFIG=.perforce
export P4EDITOR=vi
export P4USER=alholt
export P4PORT="rsh:ssh -2 -q -a -x -l p4ssh perforce.akamai.com"
export P4CLIENT=alholt_mac
export P4DIFF="/Applications/p4merge.app/Contents/Resources/launchp4merge"
export P4MERGE="/Applications/p4merge.app/Contents/Resources/launchp4merge"
export P4RESOLVE="/Applications/p4merge.app/Contents/Resources/launchp4merge"

# export RAILS_ENV="development"