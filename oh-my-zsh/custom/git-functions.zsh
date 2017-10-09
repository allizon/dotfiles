setopt NO_NOMATCH

function git_stash_staged {
  ##Stash everything temporarily.  Keep staged files, discard everything else after stashing.
  git stash --keep-index

  #Stash everything that remains (only the staged files should remain)  This is the stash we want to keep, so give it a name.
  git stash save "$1"

  #Apply the original stash to get us back to where we started.
  git stash apply stash@{1}

  #Create a temporary patch to reverse the originally staged changes and apply it
  git stash show -p | git apply -R

  #Delete the temporary stash
  git stash drop stash@{1}
  clear
  git stash list
  echo
  git status
}
alias gss="git_stash_staged"

alias gst='clear && git status'
alias gstash='git aa && git stash save ' $1
alias push='git push origin HEAD'
alias pull='git pull origin HEAD'
alias merge_develop='g fetch origin develop && g merge FETCH_HEAD'
alias git_cleanup='g branch -d $(git branch --merged)'

function go_get {
  git_fetch_and_co "feature/MCDNPORTAL-$1" ||
    git_fetch_and_co "bugfix/MCDNPORTAL-$1" ||
    git_fetch_and_co "feature/GCDSEAMS-$1" ||
    git_fetch_and_co "bugfix/GCDSEAMS-$1" ||
    git_fetch_and_co "release/$1"
  # rake db:migrate
  g pull
}
alias gget='go_get'

function git_fetch_and_co {
  echo "Trying to fetch repo $1..."
  git co $1 || git fetch origin $1 && git co $1
}

function gac { git aa && git ci -m "$1" }

# not really using these....
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
