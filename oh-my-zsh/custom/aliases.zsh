export zconf="$HOME/.oh-my-zsh/custom"
alias ez="$CURRENT_EDITOR $zconf/aliases.zsh"
alias sz="source ~/.zshrc"

# Personal convenience scripts
export dropbox="$HOME/Dropbox"
export txt="$dropbox/@TXT"
export journal="$txt/journal"

# "today journal"
jtoday () { gvi $journal/$(date +%Y-%m-%d).md }

alias wow-backup="$dropbox/scripts/wow-backup.zsh"
alias dot-backup="$dropbox/scripts/backup-to-remote.zsh"

EDITOR='nvim'
CURRENT_EDITOR='nvim'
export nvim="$HOME/.config/nvim"
alias ed="$CURRENT_EDITOR"
alias gvi="nyaovim"

alias hyed="bash -c 'exec env ${EDITOR:=nvim} ~/.hyper.js'"
alias s='subl'

alias show_hidden="defaults write com.apple.Finder AppleShowAllFiles YES && killall Finder"
alias h='history'
eval "$(thefuck --alias)"

export neosnippets="cd /Users/alholt/.local/share/nvim/plugged/neosnippet-snippets/neosnippets"
export st3pack="$HOME/Library/Application\ Support/Sublime\ Text\ 3/Packages/User"

# Set up external boxes so they're usable!
function pushprofile {
  TEMPLATE=~/.profile.template
  TARGET=${1:-lab}
  scp $TEMPLATE $TARGET:~/.profile
  pushvimfiles $TARGET
}

function pushvimfiles {
  VIM_DIR=~/.vim
  VIMRC=~/.vimrc
  TARGET=${1:-lab}
  scp $VIMRC $TARGET:~/.vimrc
  ssh $TARGET "mkdir ~/.vim"
  # scp -r $VIM_DIR/* $TARGET:~/.vim
  rsync -q $VIM_DIR $TARGET:~/.vim --exclude "*/.git/*" --exclude "bundle/command-t/data/benchmark.yml"
}


## get top process eating memory
alias psmem='ps aux | sort -nr -k 4'
alias psmem10='ps aux | sort -nr -k 4 | head -10'

## get top process eating cpu ##
alias pscpu='ps aux | sort -nr -k 3'
alias pscpu10='ps aux | sort -nr -k 3 | head -10'

## set some other defaults ##
alias df='df -H'
alias du='du -ch'

alias ll='ls -alFH'
alias la='ls -A'
alias l='ls -CF'
alias grep='egrep -irn'

alias wf='ssh -A wf'

function killit () {
  # Kills any process that matches a regexp passed to it
  ps aux | ack -v "ack" | ack "$@" | awk '{print $2}' | xargs kill -9
}

export RUBY_DEP_GEM_SILENCE_WARNINGS=1
export DISABLE_DATABASE_ENVIRONMENT_CHECK=1
