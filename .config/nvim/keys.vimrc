" All keybindings should go here. (Plugin *settings* go in plugins.vimrc, but
" any keybindings go here, capice?)

let mapleader=","


"""""
" Dispatch/Make/Shell commands
" Kicks this off in the background so I can keep working while this processes...
nnoremap <LEADER>ct :Dispatch! make -f ~/code/mcdn-portal/allistuff/Makefile ctags<CR>

" I want this to only be in makrdown docs...
nnoremap ;m :silent !open -a Marked\ 2.app %<CR>


"""""
" General
nmap <LEADER>v :edit ~/.config/nvim/init.vim<CR>
nmap <LEADER>S :source ~/.config/nvim/init.vim<CR>
nmap <LEADER>Ca ggVGy

" Buffers/windows
nnoremap <LEADER>n :bnext<CR>
nnoremap <LEADER>m :bprev<CR>
nmap <LEADER>w <C-W>w
nmap <LEADER>W <C-W>W


"""""
" NERDTree and CtrlP
let mapleader=";"
nmap <LEADER>t   :NERDTreeFind<CR>
nmap <LEADER>p   :CtrlP<CR>
nmap <LEADER>b   :CtrlPBuffer<CR>
let mapleader=","


"""""
" vim-fugitive (Git wrapper)
" nmap <LEADER>s   :Gstatus<CR>
" let mapleader="."
nnoremap <LEADER>gs :Gstatus<CR>
nnoremap <LEADER>gd :Gdiff<cr>
" close git diff window
nnoremap <LEADER>gx <c-w>h<c-w>c
" let mapleader=","


"""""
" UltiSnips
command! Sniped :UltiSnipsEdit
nnoremap <LEADER>e :UltiSnipsEdit<CR>


"""""
" NeoTerm
nnoremap <silent> <f10> :TREPLSendFile<cr>
nnoremap <silent> <f9> :TREPLSendLine<cr>
vnoremap <silent> <f9> :TREPLSendSelection<cr>

" Useful maps
" hide/close terminal
nnoremap <silent> Th :call neoterm#close()<cr>
" clear terminal
nnoremap <silent> Tl :call neoterm#clear()<CR>
" kills the current job (send a <c-c>)
nnoremap <silent> Tc :call neoterm#kill()<cr>

" Rails commands
command! Troutes :T rake routes
command! -nargs=+ Troute :T rake routes | ag <args>
command! Tmigrate :T rake db:migrate


"""""
" vim-test
let mapleader="."
nmap <silent> <LEADER>r :TestNearest<CR>
nmap <silent> <LEADER>R :TestFile<CR>
nmap <silent> <LEADER>a :TestSuite<CR>
nmap <silent> <LEADER>l :TestLast<CR>
nmap <silent> <LEADER>g :TestVisit<CR>
let mapleader=","


"""""
" Tabularize
nmap <LEADER>f= :Tabularize /=<CR>
vmap <LEADER>f= :Tabularize /=<CR>
nmap <LEADER>f: :Tabularize /:\zs<CR>
vmap <LEADER>f: :Tabularize /:\zs<CR>


"""""
" EasyAlign
" Start interactive EasyAlign in visual mode (e.g. vipga)
xmap ga <Plug>(EasyAlign)

" Start interactive EasyAlign for a motion/text object (e.g. gaip)
nmap ga <Plug>(EasyAlign)


"""""
" ack.vim
nmap <LEADER>a :Ack <C-r><C-W><CR>
