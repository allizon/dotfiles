# Personal convenience scripts
DROPBOX_DIR='~/Dropbox/scripts'
alias wow-backup="$DROPBOX_DIR/wow-backup.zsh"
alias dot-backup="$DROPBOX_DIR/backup-to-remote.zsh"

CURRENT_EDITOR='vi'
alias ed="$CURRENT_EDITOR"
# CURRENT_EDITOR='vim'
# CURRENT_EDITOR='subl'

# Mac OSX aliases - versions in Homebrew
VIM_VERSION='7.4.979'
alias g='/usr/local/Cellar/git/2.8.0/bin/git'
alias vi="/usr/local/Cellar/vim/$VIM_VERSION/bin/vim"
alias vim="/usr/local/Cellar/vim/$VIM_VERSION/bin/vim"

alias vis="vi -S Session.vim"
alias show_hidden="defaults write com.apple.Finder AppleShowAllFiles YES && killall Finder"

alias j="/usr/local/bin/autojump"
[[ -s $(brew --prefix)/etc/profile.d/autojump.sh ]] && . $(brew --prefix)/etc/profile.d/autojump.sh

alias untar="tar -xzvf"
alias rcop='rubocop --format simple'
alias guard='bundle exec guard'
alias gz='bundle exec guard -g zeus -c'
alias gs='bundle exec guard -g spring -c'
alias bi='bundle install'
alias rt='time z test'
alias p4b='RAILS_ENV=test scripts/p4_bridge.rb'
alias kill_zeus='pkill -9 "zeus.*" && pkill -9 "fsevents-wrapper$"'
alias taildev='tail -f log/development.log | ack AJ'
alias tailtest='tail -f log/test.log | ack AJ'

alias st3pack='cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/User'
alias md='mkdir -pv'

# Allows HEAD^ to work in zsh
setopt NO_NOMATCH

### AKAMAI
alias agent-ext='/usr/bin/ssh-add $HOME/.ssh/external/2016-07-26;'
alias agent-int='/usr/bin/ssh-add $HOME/.ssh/internal/2016-07-26; /usr/bin/ssh-add $HOME/.ssh/govops_lab_key_v2'
alias agent-old='/usr/bin/ssh-add $HOME/.ssh/internal/2016-03-30; /usr/bin/ssh-add $HOME/.ssh/external/2016-03-30'
alias agent-wf='/usr/bin/ssh-add $HOME/.ssh/wf/id_rsa'
alias agent-bb='/usr/bin/ssh-add $HOME/.ssh/bitbucket/2016-05-19'

# alias sshgen_external='ssh-keygen -t rsa -b 2048 -C "`whoami`-external-`date +%Y-%m-%d`" -f ~/.ssh/external/`date +%Y-%m-%d`'
# alias sshgen_internal='ssh-keygen -t rsa -b 2048 -C "`whoami`-internal-`date +%Y-%m-%d`" -f ~/.ssh/internal/`date +%Y-%m-%d`'
# alias sshgen_deployed='ssh-keygen -t rsa -b 2048 -C "`whoami`-deployed-`date +%Y-%m-%d`" -f ~/.ssh/deployed/`date +%Y-%m-%d`'
# alias sshgen_nipr='ssh-keygen -t rsa -b 2048 -C "`whoami`-nipr-`date +%Y-%m-%d`" -f ~/.ssh/nipr/`date +%Y-%m-%d`'
# alias sshgen_sipr='ssh-keygen -t rsa -b 2048 -C "`whoami`-sipr-`date +%Y-%m-%d`" -f ~/.ssh/sipr/`date +%Y-%m-%d`'

function akakeygen {
  todays_date=`date +"%Y-%m-%d"`
  ssh-keygen -t rsa -b 2048 -E md5 -C "`whoami`-$1-${todays_date}" -f ~/.ssh/$1/${todays_date};
}

# Run akakeyconnect in one window, then run akakeyconfirm in another
function akakeyconnect {
  old_date="$1"
  for key_type in internal external; do
    ssh -i ~/.ssh/${key_type}/${old_date} kv${key_type}@ssh-keyrotation.akamai.com;
  done
}

function akakeyconfirm {
  todays_date=`date +"%Y-%m-%d"`
  for key_type in internal external; do
    ssh-keygen -l -E md5 -C "`whoami`-$1-${todays_date}" -f ~/.ssh/${key_type}/${todays_date}.pub
  done
}

alias mp="cd ~/code/mcdn-portal/"

alias push='git push origin master'
alias pull='git pull origin master'
alias merge_develop='g fetch origin develop && g merge FETCH_HEAD'
alias git_cleanup='g branch -d $(git branch --merged)'
function go_get {
  echo 'Fetching repo '$1
  git fetch origin $1
  git co $1
}


function gac { git aa && git ci -m "$1" }
function gdv { git co develop }
function gfe { git co "feature/MCDNPORTAL-$1" }
function gbf { git co "bugfix/MCDNPORTAL-$1" }
function gff {
  branch="feature/MCDNPORTAL-$1"
  git fetch origin "$branch"
  git co "$branch"
}
function gfb {
  branch="bugfix/MCDNPORTAL-$1"
  git fetch origin "$branch"
  git co "$branch"
}

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

# Webpack and push FEE version of portal to lab box
function make_push {
  mp
  cd frontend
  webpack
  cd ..
  make rsync-deployed
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


alias psql='/Applications/Postgres.app/Contents/Versions/9.4/bin/psql'
alias repost='/Applications/Postgres.app/Contents/MacOS/Postgres restart -D ~/Library/Application\ Support/Postgres/var/ -m fast -s'
alias pdb='psql portal'
alias rake='bundle exec rake'
alias rr='bundle exec rake routes'
alias rkick='killit rails && rs -d'
alias thin='bundle exec thin start -d -p 3001'

alias z='zeus'
alias ztest='time z test'
# alias zspec='time z rake spec'
alias zspec='time z rspec --color --format documentation'

alias vdb='psql vulcan'
alias v='cd ~/git/vulcan'

export ZCUSTOM="~/.oh-my-zsh/custom/"
alias eza="$CURRENT_EDITOR ~/.oh-my-zsh/custom/aliases.zsh"
# alias sza="source ~/.oh-my-zsh/custom/aliases.zsh"
alias sza="source ~/.zshrc"

function killit () {
  # Kills any process that matches a regexp passed to it
  ps aux | ack -v "ack" | ack "$@" | awk '{print $2}' | xargs kill -9
}

export P4CONFIG=".perforce"
export P4USER="alholt"
export P4HOST="perforce:1666"
export P4PORT="rsh:/usr/local/bin/crackpipe ssh -2 -a -c blowfish -l p4ssh -q -x perforce.akamai.com /bin/true"
export P4EDITOR="vi"
export P4IGNORE="~/.myp4ignore"
