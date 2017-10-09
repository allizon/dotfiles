export P4CONFIG=".perforce"
export P4USER="alholt"
export P4HOST="perforce:1666"
export P4PORT="rsh:ssh -2 -a -l p4source -q -x p4.source.akamai.com /bin/true"
export P4EDITOR="vi"
export P4IGNORE="~/.myp4ignore"

alias sync="p4 sync"
alias p4o="p4 opened"
alias p4s="p4 submit"
function p4e { p4 edit $1 && vi $1 }
function p4r { p4 revert $1 }
function p4d { p4 diff $1 }
