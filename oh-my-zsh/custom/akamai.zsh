### AKAMAI
alias agent-ext='/usr/bin/ssh-add $HOME/.ssh/external/2017-07-13;'
alias agent-int='/usr/bin/ssh-add $HOME/.ssh/internal/2017-07-13; /usr/bin/ssh-add $HOME/.ssh/govops_lab_key_v2'
# alias agent-old='/usr/bin/ssh-add $HOME/.ssh/internal/2016-07-26; /usr/bin/ssh-add $HOME/.ssh/external/2016-03-30'
alias agent-wf='/usr/bin/ssh-add $HOME/Dropbox/wf-2017'
alias agent-bb='/usr/bin/ssh-add $HOME/.ssh/bitbucket/2016-05-19'
alias agent-github='/usr/bin/ssh-add /keybase/private/allizon/github_id_rsa'
function agent-reset {
  ssh-add -D
  agent-int
  agent-bb
  agent-wf
  agent-github
  ssh-add -l
}

# alias sshgen_external='ssh-keygen -t rsa -b 2048 -C "`whoami`-external-`date +%Y-%m-%d`" -f ~/.ssh/external/`date +%Y-%m-%d`'
# alias sshgen_internal='ssh-keygen -t rsa -b 2048 -C "`whoami`-internal-`date +%Y-%m-%d`" -f ~/.ssh/internal/`date +%Y-%m-%d`'
# alias sshgen_deployed='ssh-keygen -t rsa -b 2048 -C "`whoami`-deployed-`date +%Y-%m-%d`" -f ~/.ssh/deployed/`date +%Y-%m-%d`'
# alias sshgen_nipr='ssh-keygen -t rsa -b 2048 -C "`whoami`-nipr-`date +%Y-%m-%d`" -f ~/.ssh/nipr/`date +%Y-%m-%d`'
# alias sshgen_sipr='ssh-keygen -t rsa -b 2048 -C "`whoami`-sipr-`date +%Y-%m-%d`" -f ~/.ssh/sipr/`date +%Y-%m-%d`'

function akakeygen {
  todays_date=`date +"%Y-%m-%d"`
  for key_type in internal external; do
    ssh-keygen -t rsa -b 2048 -E md5 -C "`whoami`-${key_type}-${todays_date}" -f ~/.ssh/${key_type}/${todays_date};
  done
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

