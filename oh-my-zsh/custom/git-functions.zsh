setopt NO_NOMATCH

autoload -U git_branch_id
autoload -U git_stash_staged
autoload -U git_fetch_and_co
autoload -U go_get

alias gac='git aa && git ci -m "[$(git_branch_id)] $1"'
alias gcim='git ci -m "[$(git_branch_id)] $1"'

alias gss="git_stash_staged"
alias gst='clear && git status'
alias gstash='git aa && git stash save ' $1
alias push='git push origin HEAD'
alias pull='git pull origin HEAD'
alias merge_develop='g fetch origin develop && g merge FETCH_HEAD'
alias git_cleanup='g branch -d $(git branch --merged)'
alias gget='go_get'
