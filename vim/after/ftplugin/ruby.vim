setlocal expandtab
setlocal nosmarttab
setlocal tabstop=2
setlocal shiftwidth=2
setlocal nocindent

imap deb<Tab> ::Rails.logger.debug '[AJH] ' + .inspect<LEFT><LEFT><LEFT><LEFT><LEFT><LEFT><LEFT><LEFT>
imap info<Tab> ::Rails.logger.info '[AJH] ' + .inspect<LEFT><LEFT><LEFT><LEFT><LEFT><LEFT><LEFT><LEFT>
imap pline<Tab> puts __LINE__.inspect<CR>
imap pins<Tab>  puts .inspect<LEFT><LEFT><LEFT><LEFT><LEFT><LEFT><LEFT><LEFT>

" cab rcop  ! ~/.rbenv/shims/rubocop --format simple %
