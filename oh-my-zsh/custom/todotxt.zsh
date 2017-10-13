# == Todo.txt Stuff
alias t="clear && todo.sh"
alias today="clear && todo.sh ls @today"
alias tak="clear && todo.sh ls @akamai"

taa () {
  branch_name="$(git symbolic-ref --short HEAD)"
  todo.sh add "[@akamai][$branch_name] $1"
}

tj () {
  clear
  branch_name="$(git symbolic-ref --short HEAD)"
  todo.sh ls $branch_name
}

