export portal="$HOME/code/mcdn-portal"

alias amake="make -f $portal/allistuff/Makefile"

alias mp="cd $portal"
alias mpn="cd ${portal}-new/"
alias mpt="cd ${portal}-test/"

alias rcop='rubocop --format simple'

alias guard='bundle exec guard'
alias gz='bundle exec guard -g zeus -c'
alias gs='bundle exec guard -g spring -c'

alias rc='rails console'
alias rt='time rails test'
alias rtc='rails console test --sandbox'

alias z='zeus'
alias zs='zeus server'
alias zspec='time z rspec --color --format documentation'
alias kill_zeus='pkill -9 "zeus.*" && pkill -9 "fsevents-wrapper$"'

alias bi='bundle install'
alias p4b='RAILS_ENV=test scripts/p4_bridge.rb'

alias kill_spring='pkill -9 "spring *"'

alias taildev='tail -f log/development.log | ack AJ'
alias tailtest='tail -f log/test.log | ack AJ'

alias psql='/Applications/Postgres.app/Contents/Versions/9.4/bin/psql'
alias repost='/Applications/Postgres.app/Contents/MacOS/Postgres restart -D ~/Library/Application\ Support/Postgres/var/ -m fast -s'
alias pg='pgcli portal'

function ztest() {
  CODE_DIR='/Users/alholt/code/mcdn-portal'
  RUBY_CMD='/Users/alholt/.rvm/rubies/ruby-2.2.5/bin/ruby'
  ZEUS_BIN="$CODE_DIR/bin/zeus"
  TEST_DIR="$CODE_DIR/test"
  $RUBY_CMD -Itest $ZEUS_BIN test $CODE_DIR/$1
}
