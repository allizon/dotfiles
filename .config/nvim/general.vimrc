" Any settings or configuration that don't really belong anywhere else can
" live here.

if &shell =~# 'fish$'
  set shell=zsh
endif

set number
set showmatch " Shows matching bracket
" set nocompatible
set hidden    " Change buffers without saving
set cursorline
set nowrap

set hlsearch          " don't highlight search term
set incsearch         " DO highlight matches during text completion
nmap \q :nohlsearch<CR>
" nnoremap <CR> :nohlsearch<CR>

filetype plugin indent on
set autowrite

" vim-better-whitespace
autocmd BufEnter * EnableStripWhitespaceOnSave

autocmd BufEnter *.md SoftPencil
autocmd BufEnter *.md set expandtab

" Clipboard integration
function! ClipboardYank()
  call system('pbcopy', @@)
endfunction
function! ClipboardPaste()
  let @@ = system('pbpaste')
endfunction

vnoremap <silent> x x:call ClipboardYank()<cr>
vnoremap <silent> y y:call ClipboardYank()<cr>
vnoremap <silent> d d:call ClipboardYank()<cr>
nnoremap <silent> Y :call ClipboardPaste()<cr>p

onoremap <silent> x x:call ClipboardYank()<cr>
onoremap <silent> y y:call ClipboardYank()<cr>
onoremap <silent> d d:call ClipboardYank()<cr>

" Command Window improvements
" nnoremap : q:i
nnoremap / q/i
nnoremap ? q?i
autocmd CmdwinEnter * nnoremap <buffer> <F5> :let g:CmdWindowLineMark=line(".")<CR><CR>q::execute "normal ".g:CmdWindowLineMark."G"<CR>
" autocmd CmdwinEnter * nnoremap <buffer> qq <C-c>
