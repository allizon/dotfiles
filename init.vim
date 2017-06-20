let mapleader=","

set number
set showmatch " Shows matching bracket
" set nocompatible
set hidden    " Change buffers without saving

call plug#begin('~/.local/share/nvim/plugged')
	" Plug 'ap/vim-buftabline'
	Plug 'janko-m/vim-test'
	" Plug 'kien/ctrlp.vim'
	Plug 'scrooloose/nerdtree'
	Plug 'SirVer/ultisnips'
	Plug 'tpope/vim-commentary'
	Plug 'tpope/vim-endwise'
	Plug 'tpope/vim-fugitive'
	Plug 'tpope/vim-markdown'
	Plug 'tpope/vim-obsession'
	Plug 'tpope/vim-rails'
	Plug 'tpope/vim-repeat'
	Plug 'tpope/vim-sensible'
	Plug 'tpope/vim-sleuth'
	Plug 'tpope/vim-surround'
	Plug 'vim-ruby/vim-ruby'
	Plug 'Xuyuanp/nerdtree-git-plugin'
	Plug 'bling/vim-airline'
	" Plug 'bling/vim-bufferline'
	Plug 'airblade/vim-gitgutter'
	Plug 'vim-ctrlspace/vim-ctrlspace'
call plug#end()

filetype plugin indent on


nnoremap <LEADER>n :bnext<CR>
nnoremap <LEADER>m :bprev<CR>
nmap <LEADER>w <C-W>w
nmap <LEADER>W <C-W>W

" ### NERDTree and CtrlP
" autocmd vimenter * NERDTree
let g:NERDTreeWinSize = 40 
nmap <LEADER>t   :NERDTreeFind<CR>
" nmap <LEADER>p   :CtrlP<CR>
" nmap <LEADER>b   :CtrlPBuffer<CR>
" nmap ;    :CtrlPBuffer<CR>

nmap <LEADER>s   :Gstatus<CR>

let g:ctrlp_map = "<c-p>"
let g:ctrlp_root_markers=["Gemfile", "Rakefile"]
let g:ctrlp_custom_ignore = '\.git$\|\vendor/*|\.sass-cache/*|\.meteor/*|output/*|build/*|node_modules/*|tmp/*|public/uploads/*'
let g:ctrlp_working_path_mode = 'ra'
let g:ctrlp_match_window_bottom = 0
let g:ctrlp_match_window_reversed = 0
set wildignore+=*/tmp/*,*.so,*.swp,*.zip

" Trigger configuration. Do not use <tab> if you use https://github.com/Valloric/YouCompleteMe.
" let g:UltiSnipsExpandTrigger="<c-i>"
let g:UltiSnipsExpandTrigger="<tab>"
let g:UltiSnipsJumpForwardTrigger="<tab>"
let g:UltiSnipsJumpBackwardTrigger="<s-tab>"

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"
let g:UltiSnipsUsePythonVersion = 2

" Ctrl-Space
let g:CtrlSpaceDefaultMappingKey = "<M-space> "
let g:ackprg = 'ag --nogroup --nocolor --column'
let g:CtrlSpaceGlobCommand = 'ag -l --nocolor -g ""'
nnoremap <silent><C-p> :CtrlSpace O<CR>
nnoremap ; :CtrlSpace<CR>

" vim-test
nmap <silent> <leader>r :TestNearest<CR>
nmap <silent> <leader>R :TestFile<CR>
nmap <silent> <leader>a :TestSuite<CR>
nmap <silent> <leader>l :TestLast<CR>
nmap <silent> <leader>g :TestVisit<CR>
