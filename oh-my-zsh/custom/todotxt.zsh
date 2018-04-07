# == Todo.txt Stuff
alias t="clear && task"
alias tl="t long"
alias ta="t add"
alias tc="t calendar"
alias tm="t modify"
alias tbd="t burndown.daily"
alias tbm="t burndown.monthly"
alias tbw="t burndown.weekly"
alias tak="t project:akamai"

taa () {
  task add project:akamai [$(git_branch_id)] $1
}

tj () {
  clear
  task $(git_branch_id)
}

tpush () {
  current_dir=$(pwd)
  cd ~/.task
  gac "Task backup"
  g push origin master
  cd $current_dir
}
