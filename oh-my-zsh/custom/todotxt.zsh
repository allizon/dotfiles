# == Todo.txt Stuff
alias t="clear && todo.sh"
alias today="clear && todo.sh ls @today"
alias tak="clear && todo.sh ls @aka"

taa () {
  todo.sh add "[@aka][$(git_branch_id)] $1"
}

tj () {
  clear
  branch_name="$(git symbolic-ref --short HEAD)"
  todo.sh ls git_branch_id
}

