# == Todo.txt Stuff
alias t="clear && todo.sh"
alias ta="clear && todo.sh add"
alias tf="clear && todo.sh ls"
alias today="clear && todo.sh ls @today"
alias tak="clear && todo.sh ls @aka"

taa () {
  todo.sh add "[@aka][$(git_branch_id)] $1"
}

tj () {
  clear
  todo.sh ls $(git_branch_id)
}
