" All keybindings should go here. (Plugin *settings* go in plugins.vimrc, but
" any keybindings go here, capice?)

let mapleader=","


"""""
" Dispatch/Make/Shell commands
" Kicks this off in the background so I can keep working while this processes...
nnoremap <LEADER>ct :Dispatch! make -f ~/code/mcdn-portal/allistuff/Makefile ctags<CR>


"""""
" General
nmap <LEADER>v :edit ~/.config/nvim/init.vim<CR>
nmap <LEADER>S :source ~/.config/nvim/init.vim<CR>
nmap <LEADER>Ca ggVGy

" Buffers/windows - uses j/k for next/previous
nnoremap <LEADER>b :CtrlPBuffer<CR>
let mapleader="."
nnoremap <LEADER>bj :bnext<CR>
nnoremap <LEADER>bk :bprev<CR>
nnoremap <LEADER>bd :bdelete<CR>
nnoremap <LEADER>bx :bdelete<CR>
let mapleader=","

nnoremap <LEADER>w :wincmd w<CR>
let mapleader=";"
nnoremap <LEADER>wj :wincmd w<CR>
nnoremap <LEADER>wk :wincmd W<CR>
nnoremap <LEADER>wx :close<CR>
nnoremap <LEADER>wh :split<CR>
nnoremap <LEADER>ws :vsplit<CR>
nnoremap <LEADER>wr <C-W>x
nnoremap <LEADER>wq :qa<CR>
let mapleader=","


"""""
" NERDTree and CtrlP
let mapleader=";"
nnoremap <LEADER>t :NERDTreeFind<CR>
nnoremap <LEADER>p :CtrlP<CR>
let mapleader=","

" Inside NERDTree:
" 	p: jump to parent directory
" 	P: jump to root directory
" 	u: up a parent directory
" 	C: make the selected directory root


"""""
" vim-fugitive (Git wrapper)
nnoremap <LEADER>gs :Gstatus<CR>
nnoremap <LEADER>gd :Gdiff<cr>
" close git diff window
nnoremap <LEADER>gx <c-w>h<c-w>c


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
nnoremap <silent> Th :call neoterm#close()<CR>
nnoremap <silent> Tx :call neoterm#close()<CR>
" clear terminal
nnoremap <silent> Tl :call neoterm#clear()<CR>
" kills the current job (send a <c-c>)
nnoremap <silent> Tc :call neoterm#kill()<CR>

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
