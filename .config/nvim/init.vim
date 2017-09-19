call plug#begin('~/.local/share/nvim/plugged')
	" Plug 'ap/vim-buftabline'
	" Plug 'mxw/vim-jsx'
	" Plug 'SirVer/ultisnips'
	"
	Plug 'kien/ctrlp.vim'
	Plug 'scrooloose/nerdtree'
	Plug 'tpope/vim-bundler'
	Plug 'tpope/vim-commentary'
	Plug 'tpope/vim-dispatch'
	Plug 'tpope/vim-endwise'
	Plug 'tpope/vim-fugitive'
	Plug 'tpope/vim-markdown'
	Plug 'tpope/vim-obsession'
	Plug 'tpope/vim-rails'
	Plug 'tpope/vim-repeat'
	Plug 'tpope/vim-speeddating'
	Plug 'tpope/vim-sleuth'
	Plug 'tpope/vim-surround'
	Plug 'reedes/vim-pencil'
	Plug 'janko-m/vim-test'
	Plug 'vim-syntastic/syntastic'
	Plug 'vim-ruby/vim-ruby'
	Plug 'mattn/emmet-vim'
	Plug 'Xuyuanp/nerdtree-git-plugin'
	Plug 'bling/vim-airline'
	Plug 'airblade/vim-gitgutter'
	Plug 'raimondi/delimitmate'
	Plug 'terryma/vim-multiple-cursors'
	Plug 'kassio/neoterm'
	Plug 'godlygeek/tabular'
	Plug 'junegunn/vim-easy-align'
	Plug 'ntpeters/vim-better-whitespace'
	Plug 'mhartington/oceanic-next'
	Plug 'mileszs/ack.vim'
	Plug 'junegunn/goyo.vim'
	Plug 'kana/vim-textobj-user'
	Plug 'nelstrom/vim-textobj-rubyblock'
	Plug 'freitass/todo.txt-vim'

	" Completion plugins
	Plug 'valloric/youcompleteme'
	Plug 'Shougo/neocomplete'
	Plug 'Shougo/neosnippet'
	Plug 'Shougo/neosnippet-snippets'
	Plug 'Shougo/context_filetype.vim'

	" Javascript
	Plug 'pangloss/vim-javascript'
	Plug 'posva/vim-vue'
call plug#end()

filetype plugin indent on
set autowrite

if (has("termguicolors"))
  set termguicolors
endif
colorscheme OceanicNext

let mapleader=","

""" vim-pencil
augroup pencil
  autocmd!
  autocmd FileType markdown,mkd call pencil#init({'wrap': 'soft'})
  autocmd FileType text         call pencil#init()
  autocmd BufRead  todo.txt     :PFormatOff
augroup END

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

set number
set showmatch " Shows matching bracket
" set nocompatible
set hidden    " Change buffers without saving
set cursorline

set hlsearch          " don't highlight search term
set incsearch         " DO highlight matches during text completion
nmap \q :nohlsearch<CR>
nnoremap <CR> :nohlsearch<CR>

nmap <LEADER>v :tabedit ~/.config/nvim/init.vim<CR>
nmap <LEADER>S :source ~/.config/nvim/init.vim<CR>
nmap <LEADER>Ca ggVGy

nnoremap <LEADER>n :bnext<CR>
nnoremap <LEADER>m :bprev<CR>
nmap <LEADER>w <C-W>w
nmap <LEADER>W <C-W>W

" ### NERDTree and CtrlP
" autocmd vimenter * NERDTree
let mapleader=";"
let g:NERDTreeQuitOnOpen = 1
let g:NERDTreeWinSize = 40
nmap <LEADER>t   :NERDTreeFind<CR>
nmap <LEADER>p   :CtrlP<CR>
nmap <LEADER>b   :CtrlPBuffer<CR>
let mapleader=","

" nmap <LEADER>s   :Gstatus<CR>
" let mapleader="."
nnoremap <LEADER>gs :Gstatus<CR>
nnoremap <LEADER>gd :Gdiff<cr>
" close git diff window
nnoremap <LEADER>gx <c-w>h<c-w>c
" let mapleader=","

" let g:ctrlp_map = "<c-p>"
" let g:ctrlp_root_markers=["Gemfile", "Rakefile"]
let g:ctrlp_custom_ignore = '\.git$\|\vendor/*|\.sass-cache/*|\.meteor/*|output/*|build/*|node_modules/*|tmp/*|public/uploads/*|doc/*'
" let g:ctrlp_working_path_mode = 'ra'
let g:ctrlp_match_window_bottom = 0
let g:ctrlp_dotfiles = 0
let g:ctrlp_switch_buffer = 0
let g:ctrlp_match_window_reversed = 0
" set wildignore+=*/tmp/*,*.so,*.swp,*.zip

" UltiSnips
" Trigger configuration. Do not use <tab> if you use https://github.com/Valloric/YouCompleteMe.
" let g:UltiSnipsExpandTrigger="<c-i>"
let g:UltiSnipsExpandTrigger="<tab>"
let g:UltiSnipsJumpForwardTrigger="<tab>"
let g:UltiSnipsJumpBackwardTrigger="<s-tab>"

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"
let g:UltiSnipsUsePythonVersion = 2

""" Neosnippets
let g:neosnippet#snippets_directory = "/Users/alholt/.local/share/nvim/plugged/neosnippet-snippets/neosnippets"
let g:neosnippet#scope_aliases = {}
let g:neosnippet#scope_aliases['ruby'] = 'ruby,ruby-rails'
let g:neosnippet#scope_aliases['javascript'] = 'javascript,vue'

" Plugin key-mappings.
" Note: It must be "imap" and "smap".  It uses <Plug> mappings.
imap <C-k>     <Plug>(neosnippet_expand_or_jump)
smap <C-k>     <Plug>(neosnippet_expand_or_jump)
xmap <C-k>     <Plug>(neosnippet_expand_target)

" Ctrl-Space
" let mapleader=";"
" let g:CtrlSpaceDefaultMappingKey = "<M-space> "
" let g:CtrlSpaceGlobCommand = 'ag -l --nocolor -g ""'
" nnoremap <silent><C-p> :CtrlSpace O<CR>
" nnoremap <LEADER>; :CtrlSpace<CR>
" let mapleader=","

" vim-test
let mapleader="."
let test#strategy="neoterm"
" let test#ruby#use_binstubs=0
nmap <silent> <LEADER>r :TestNearest<CR>
nmap <silent> <LEADER>R :TestFile<CR>
nmap <silent> <LEADER>a :TestSuite<CR>
nmap <silent> <LEADER>l :TestLast<CR>
nmap <silent> <LEADER>g :TestVisit<CR>
let mapleader=","

" NeoTerm
let g:neoterm_position = 'horizontal'
let g:neoterm_automap_keys = ',tt'
let g:neoterm_keep_term_open = 0

nnoremap <silent> <f10> :TREPLSendFile<cr>
nnoremap <silent> <f9> :TREPLSendLine<cr>
vnoremap <silent> <f9> :TREPLSendSelection<cr>

" Useful maps
" hide/close terminal
nnoremap <silent> Th :call neoterm#close()<cr>
" clear terminal
nnoremap <silent> Tl :call neoterm#clear()<cr>
" kills the current job (send a <c-c>)
nnoremap <silent> Tc :call neoterm#kill()<cr>

" Rails commands
command! Troutes :T rake routes
command! -nargs=+ Troute :T rake routes | ag <args>
command! Tmigrate :T rake db:migrate

" Git commands
" command! -nargs=+ Tg :T git <args>

" === /NeoTerm

" Tabularize
nmap <LEADER>f= :Tabularize /=<CR>
vmap <LEADER>f= :Tabularize /=<CR>
nmap <LEADER>f: :Tabularize /:\zs<CR>
vmap <LEADER>f: :Tabularize /:\zs<CR>

" vim-better-whitespace
autocmd BufEnter * EnableStripWhitespaceOnSave

" ack.vim
nmap <LEADER>a :Ack <C-r><C-W><CR>
let g:ackprg = 'ag --nogroup --nocolor --column'

" EasyAlign
" Start interactive EasyAlign in visual mode (e.g. vipga)
xmap ga <Plug>(EasyAlign)

" Start interactive EasyAlign for a motion/text object (e.g. gaip)
nmap ga <Plug>(EasyAlign)

" Kicks this off in the background so I can keep working while this processes...
nnoremap <LEADER>ct :Dispatch! make -f ~/code/mcdn-portal/alli.makefile ctags<CR>
