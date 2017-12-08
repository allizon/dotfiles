export plogs="$txt/Logs"
export wlogs="$txt/Work/Logs"

# export wltoday="$wlogs/$(date +"%Y")/$(date +"%m")_$(date +"%B").md"
today_for_logfile () {
  echo "$(date +"%Y")/$(date +"%m")_$(date +"%B")"
}

wltoday () { echo "$wlogs/$(today_for_logfile).md" }
pltoday () { echo "$plogs/$(today_for_logfile).md" }

alias wlo="vi $(wltoday)"
alias wla="echo '*$1' >> $(wltoday)"
alias wlga="echo '* [$(git_branch_id)]$1' >> $(wltoday)"
wlf () { ag $1 $wlogs }

alias plo="vi $(pltoday)"
alias pla="echo '*$1' >> $(pltoday)"
plf () { ag $1 $plogs }


