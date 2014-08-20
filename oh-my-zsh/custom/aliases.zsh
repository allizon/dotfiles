# Mac OSX aliases
alias vi="/usr/local/Cellar/vim/7.4.253/bin/vim"
alias vim="/usr/local/Cellar/vim/7.4.253/bin/vim"
alias vis="vi -S Session.vim"
alias show_hidden="defaults write com.apple.Finder AppleShowAllFiles YES && killall Finder"

alias g='/usr/bin/git'

alias md='mkdir -pv'

# autoload -U compinit && compinit
# Autocomplete for 'g' as well
# complete -o default -o nospace -F _git g

alias push='git push origin master'
alias pull='git pull origin master'

alias pushprofile2="scp ~/.profile.template lab2:~/.profile"
function pushprofile {
  scp ~/.profile.template lab:~/.profile
  # scp ~/.ssh/root.keys lab:~/.ssh/root.keys
  # scp ~/.vimrc lab:~/.vimrc
  # ssh lab "mkdir ~/.vim"
  # scp -r ~/.vim/* lab:~/.vim
  # rsync ~/.vim lab:~/.vim --exclude "*/.git/*"
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
alias lab2='ssh -2A root@172.26.116.8'
alias lab='ssh lab'
alias sqa='ssh sqa'
alias ccu='ssh -2A restccu'
alias dev='ssh -A alholt@bos-lp6ii'
alias wf='ssh -A wf'

alias labsync='~/rsync.rb'

alias sync="p4 sync"
alias p4o="p4 opened"
alias p4s="p4 submit"
function p4e { p4 edit $1 && vi $1 }
function p4r { p4 revert $1 }
function p4d { p4 diff $1 }

alias agent-ext='/usr/bin/ssh-add $HOME/.ssh/external/2014-06-17;'
alias agent-int='/usr/bin/ssh-add $HOME/.ssh/internal/2014-06-17; /usr/bin/ssh-add $HOME/.ssh/govops/govops_lab_key_v2'
alias agent-old='/usr/bin/ssh-add $HOME/.ssh/internal/2014-02-19; /usr/bin/ssh-add $HOME/.ssh/external/2014-02-19'
alias agent-wf='/usr/bin/ssh-add $HOME/.ssh/wf/id_rsa'

# alias sshgen_external='ssh-keygen -t rsa -b 2048 -C "`whoami`-external-`date +%Y-%m-%d`" -f ~/.ssh/external/`date +%Y-%m-%d`'
# alias sshgen_internal='ssh-keygen -t rsa -b 2048 -C "`whoami`-internal-`date +%Y-%m-%d`" -f ~/.ssh/internal/`date +%Y-%m-%d`'
# alias sshgen_deployed='ssh-keygen -t rsa -b 2048 -C "`whoami`-deployed-`date +%Y-%m-%d`" -f ~/.ssh/deployed/`date +%Y-%m-%d`'
# alias sshgen_nipr='ssh-keygen -t rsa -b 2048 -C "`whoami`-nipr-`date +%Y-%m-%d`" -f ~/.ssh/nipr/`date +%Y-%m-%d`'
# alias sshgen_sipr='ssh-keygen -t rsa -b 2048 -C "`whoami`-sipr-`date +%Y-%m-%d`" -f ~/.ssh/sipr/`date +%Y-%m-%d`'

function akakeygen {
  ssh-keygen -t rsa -b 2048 -C "`whoami`-$1-`date +%Y-%m-%d`" -f ~/.ssh/$1/`date +%Y-%m-%d`
}

alias repost='/Applications/Postgres.app/Contents/MacOS/bin/pg_ctl restart -D ~/Library/Application\ Support/Postgres/var/ -m fast -s'
alias pdb='psql portal'
alias rake='bundle exec rake'
alias rr='bundle exec rake routes'
alias rkick='killit rails && rs -d'
alias thin='bundle exec thin start -d -p 3001'

alias z='zeus'

alias vdb='psql vulcan'
alias v='cd ~/git/vulcan'

export ZCUSTOM="~/.oh-my-zsh/custom/"
alias eza="vi ~/.oh-my-zsh/custom/aliases.zsh"
# alias sza="source ~/.oh-my-zsh/custom/aliases.zsh"
alias sza="source ~/.zshrc"

function p () {
  echo 'Switching to mcdn-portal '$1
  case $1 in
    rel)  cd ~/p4/releases;;
    3.4)  cd ~/git/mcdn-portal-3.4/;;
    3.3)  cd ~/git/mcdn-portal-3.3/;;
    3.2)  cd ~/git/mcdn-portal-3.2/;;
    "")   cd ~/git;;
    *)    cd ~/git;;
  esac
}

function pp4 () {
  echo 'Switching to mcdn-portal '$1
  case $1 in
    rel)  cd ~/p4/releases;;
    3.3)  cd ~/p4/mcdn-portal-3.3/akamai/mcdn-portal;;
    3.2)  cd ~/p4/mcdn-portal-3.2/akamai/mcdn-portal;;
  esac
}

function killit () {
  # Kills any process that matches a regexp passed to it
  ps aux | ack -v "ack" | ack "$@" | awk '{print $2}' | xargs kill -9
}
