setopt NO_NOMATCH

autoload -U git_branch_id
autoload -U git_stash_staged

gac () { git aa && git ci -m "[$(git_branch_id)] $1" }
gcim () { git ci -m "[$(git_branch_id)] $1" }

alias gss="git_stash_staged"
alias gst='clear && git status'
alias gstash='git aa && git stash save ' $1
alias push='git push origin HEAD'
alias pull='git pull origin HEAD'
alias merge_develop='g fetch origin develop && g merge FETCH_HEAD'
alias git_cleanup='g branch -d $(git branch --merged)'

go_get() {
  git_fetch_and_co "feature/MCDNPORTAL-$1" ||
    git_fetch_and_co "bugfix/MCDNPORTAL-$1" ||
    git_fetch_and_co "feature/GCDSEAMS-$1" ||
    git_fetch_and_co "bugfix/GCDSEAMS-$1" ||
    git_fetch_and_co "release/$1"
  # rake db:migrate
  git pull
}
alias gget='go_get'

git_fetch_and_co() {
  echo "Trying to fetch repo $1..."
  git co $1 || git fetch origin $1 && git co $1
}

