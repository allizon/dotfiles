" All keybindings should go here. (Plugin *settings* go in plugins.vimrc, but
" any keybindings go here, capice?)

let mapleader=","

"""""
" Dispatch/Make/Shell commands
" Kicks this off in the background so I can keep working while this processes...
nnoremap <LEADER>ct :Dispatch! make -f ~/code/mcdn-portal/allistuff/Makefile ctags<CR>

" easier to reach "99" than "shift-ZZ"
nnoremap 99 ZZ
nnoremap Q :q!<CR>

"""""
" General
nmap <LEADER>v :edit ~/.config/nvim/init.vim<CR>
nmap <LEADER>S :source ~/.config/nvim/init.vim<CR>
nmap <LEADER>Ca ggVGy

" Buffers/windows - uses j/k for next/previous
nnoremap B :CtrlPBuffer<CR>
nnoremap <F5>    :b#<CR>
nnoremap <TAB>   :bnext<CR>
nnoremap <S-TAB> :bprev<CR>
nnoremap <C-x>   :bdelete<CR>

" nnoremap <LEADER>w :wincmd w<CR>
" nnoremap <LEADER>wj :wincmd w<CR>
" nnoremap <LEADER>wk :wincmd W<CR>
let mapleader=";"
nnoremap <LEADER>wn :wincmd w<CR>
nnoremap <LEADER>wp :wincmd W<CR>
nnoremap <LEADER>wc :close<CR>
nnoremap <LEADER>wh :split<CR>
nnoremap <LEADER>wv :vsplit<CR>
nnoremap <LEADER>wr <C-W>x
nnoremap <LEADER>wq :qa<CR>


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
" vim-fugitive (Git wrapper) and vim-gitgutter
let mapleader=";"
nnoremap <silent> <LEADER>gs :Gstatus<CR>
nnoremap <silent> <LEADER>gd :Gdiff<cr>
" nnoremap <silent> <LEADER>dg :diffget<cr>
" nnoremap <silent> <LEADER>dp :diffput<cr>
" close git diff window
nnoremap <silent> <LEADER>gx <c-w>h<c-w>c

nmap )h <Plug>GitGutterNextHunk
nmap (h <Plug>GitGutterPrevHunk
nmap <Leader>ha <Plug>GitGutterStageHunk
nmap <Leader>hr <Plug>GitGutterUndoHunk
nmap <Leader>ht <Plug>GitGutterLineHighlightsToggle
nmap <Leader>hv <Plug>GitGutterPreviewHunk


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
nnoremap <silent> Th :Tclose<CR>
nnoremap <silent> Tx :Tclose<CR>
" clear terminal
nnoremap <silent> Tl :Tclear<CR>
" kills the current job (send a <c-c>)
nnoremap <silent> Tc :Tkill<CR>
nnoremap <silent> Tr :TestNearest<CR>
nnoremap <silent> Tp :TestLast<CR>
nnoremap <silent> Tt :T <up><CR>

" Rails commands
command! Troutes :T rake routes
command! -nargs=+ Troute :T rake routes | ag <args>
command! Tmigrate :T rake db:migrate


"""""
" vim-test
let mapleader=";"
nmap <silent> <LEADER>r :TestNearest<CR>
nmap <silent> <LEADER>R :TestFile<CR>
nmap <silent> <LEADER>a :TestSuite<CR>
nmap <silent> <LEADER>l :TestLast<CR>
" nmap <silent> <LEADER>g :TestVisit<CR>


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


"""""
" vim-taskwarrior
" nnoremap <silent> Tw :TW<CR>
