" Any settings or configuration that don't really belong anywhere else can
" live here.

set number
set showmatch " Shows matching bracket
" set nocompatible
set hidden    " Change buffers without saving
set cursorline

set hlsearch          " don't highlight search term
set incsearch         " DO highlight matches during text completion
nmap \q :nohlsearch<CR>
nnoremap <CR> :nohlsearch<CR>

filetype plugin indent on
set autowrite

" vim-better-whitespace
autocmd BufEnter * EnableStripWhitespaceOnSave

" Clipboard integration
function! ClipboardYank()
  call system('pbcopy', @@)
endfunction
function! ClipboardPaste()
  let @@ = system('pbpaste')
endfunction

vnoremap <silent> y y:call ClipboardYank()<cr>
vnoremap <silent> d d:call ClipboardYank()<cr>
nnoremap <silent> p :call ClipboardPaste()<cr>p

onoremap <silent> y y:call ClipboardYank()<cr>
onoremap <silent> d d:call ClipboardYank()<cr>
