syntax on
filetype plugin on

let mapleader=","

" Why isn't this picked up by pathogen automagically?
source $HOME/.vim/bundle/allen-defaults/plugin/aliases.vim

" .vimrc sourcing
autocmd BufWritePost .vimrc source $MYVIMRC
nmap <leader>v :tabedit ~/.vim/bundle/allen-defaults/plugin/defaults.vim<CR>

" Temporary test macros
let @p="v$hS)"
let @c='S"^['

set fileencoding=utf-8
" set clipboard+=unnamed
set isk+=_,$,@,%,$,-        " none of these should be word dividers, so make them not be
set history=1000
set cursorline

set winaltkeys=no
set backspace=2       " makes backspace work normally
set ruler
set display+=lastline
set showcmd
set mousehide         " hides mouse after characters are typed
set mouse=a
set statusline=[%02n]\ %f\ %(\[%M%R%H]%)%=\ %4l,%02c%2V\ %P%*
" set statusline=
" set statusline=%<%f\ (%{&ft})\ %-4(%m%)%=%-19(%3l,%02c%03V%)>
set laststatus=2      " Always display a status line at the bottom of window.
set showmatch         " Show the matching bracket for the last ')'?
set hidden            " Change buffers without saving
set scrolloff=2      " Keep 10 lines at bottom/top of screen
set showtabline=2
set shell=bash
set wildmode=longest,list
set autoread
set clipboard=unnamed

syntax on
filetype plugin on

nmap j gj
nmap J 10gj
nmap k gk
nmap K 10gk

" *** Formatting ***
set number
set autoindent
set cindent
set nosmartindent
set nowrap
set nolbr
set nobackup
set writebackup
" set textwidth=80

" Settings below mean insert tabs, not spaces, at a width of 4
" set noexpandtab
" set tabstop=4
" set shiftwidth=4
" set formatoptions -=a

" Recommendations from PEAR coding standards
set expandtab
set shiftwidth=2
" set softtabstop=4
set tabstop=2

set gdefault          " global on by default in search
set ignorecase
set smartcase
set infercase
set hlsearch          " don't highlight search term
set incsearch         " DO highlight matches during text completion
nmap \q :nohlsearch<CR>
nnoremap <CR> :nohlsearch<CR>


" *** Comments ***
set comments-=s-2:/*,mb:*,ex:*/
set comments+=sr:/*,mb:*,ex:*/
set comments+=://
set comments+=:///

cab   space_paren   :%s/(/( <CR>:%s/)/ )<CR>:%s/(  )/( )<CR>
cab   unspace_paren :%s/( /(<CR>:%s/ )/)<CR>


" for C-like programming, have automatic indentation:
" autocmd FileType php,js,as,asp,cs,actionscript,aspx,html,xml set formatoptions=qrocl
" autocmd FileType c,cpp,php,js,css,cs,as,actionscript set cindent
" autocmd FileType html set nosmartindent


autocmd BufNewFile,BufReadPost *.md set filetype=markdown

" ! ~/.rbenv/shims/rubocop --format simple %

au! BufEnter vcli setfiletype ruby

" Custom filetypes
au! BufEnter *.less,*.sass,*.scss   setfiletype css
" au! BufEnter *.erb                  setfiletype ruby
au! BufEnter *.conf                 setfiletype apache
au! BufEnter *.coffee               setfiletype javascript

" Autocommands
" au! FileType ruby,erb,haml  set expandtab smarttab tabstop=2 shiftwidth=2 nocindent
" au! FileType html           set expandtab smarttab tabstop=2 shiftwidth=2 nocindent nosmartindent
" au! FileType css,js         set expandtab smarttab tabstop=2 shiftwidth=2 nocindent
au! FileType python         set expandtab tabstop=3 shiftwidth=3

" au! BufEnter * cd %:p:h
au! BufWritePost defaults.vim source %
au! BufWritePre * :%s/\s\+$//e

" Strip trailing whitespace on save
au! BufReadPost *
  \ if line("'\"") > 0 && line("'\"") <= line("$") |
  \   exe "normal g'\"" |
  \ endif


" au! BufEnter,BufRead,BufNewFile *.erb         set ft=ruby
" au! BufEnter,BufRead,BufNewFile *.sass,*.scss set ft=css

" autocmd BufEnter *.rb,*.erb,*.haml        set expandtab smarttab tabstop=2 shiftwidth=2 nocindent
" autocmd BufEnter *.css,*.php,*.js         set expandtab smarttab tabstop=2 shiftwidth=2 nocindent
" autocmd BufEnter *.yml,*.scss,*.sass,*.js set expandtab smarttab tabstop=2 shiftwidth=2
" autocmd BufEnter *.py                     set expandtab tabstop=3 shiftwidth=3

" autocmd BufEnter *.css set nocindent


" Set 'g' substitute flag on.
nnoremap Q gq
vnoremap Q gq

imap <C-c> <Esc>
inoremap jj <Esc>

imap <M-j> <Down>
imap <M-k> <Up>
imap <M-h> <Left>
imap <M-l> <Right>
imap <M-Space> ^[ a

cmap <M-j> <Down>
cmap <M-k> <Up>
cmap <M-h> <Left>
cmap <M-l> <Right>



" The completion dictionary is provided by Rasmus:
" http://lerdorf.com/funclist.txt
" set dictionary-=C:\php_function_list.txt dictionary+=C:\php_function_list.txt
" Use the dictionary completion
" set complete-=k complete+=k

" This function determines, wether we are on the start of the line text (then tab indents) or
" if we want to try autocompletion
" function! InsertTabWrapper()
"     let col = col('.') - 1
"     if !col || getline('.')[col - 1] !~ '\k'
"         return "\<tab>"
"     else
"         return "\<c-p>"
"     endif
" endfunction

" Remap the tab key to select action with InsertTabWrapper
" inoremap <TAB> <c-r>=InsertTabWrapper()<cr>


" so $VIM/pyextend.vim
" cab md call MarkdownCurrentFile( )<CR>
" cab htmlify call ReplaceSpecialChars( )<CR>
" cab i18n call I18Nify( )<CR>
" cab i18nx call I18NifyXml( )<CR>
" cab pify call Paragraphify( )<CR>
" cab li call Listify( )<CR>
" cab lispan call Listspanify( )<CR>
" cab span call Spanify( )<CR>
" cab jsmin call JSMinify( )<CR>

" Save session
nmap <Leader>S :mksession
nmap <Leader>L :source

" Move lines up or down
nnoremap <C-j> :m .+1<CR>==
nnoremap <C-k> :m .-2<CR>==
inoremap <C-j> <Esc>:m .+1<CR>==gi
inoremap <C-k> <Esc>:m .-2<CR>==gi
vnoremap <C-j> :m '>+1<CR>gv=gv
vnoremap <C-k> :m '<-2<CR>gv=gv

" *** BUFFER COMMANDS ***
map <F2>    :bp<CR>
map <F3>    :bn<CR>
map <F4>    \be
map <S-F4>  :buffers<CR>
map <F5>    :b#<CR>
map <F6>    :bd<CR>

noremap <S-F7>  :w! %.bak<CR>
noremap <C-H>   :set list!<CR>

" *** WINDOW and TAB COMMANDS ***
map <S-F6>  <C-W><C-C>              " close window
map <F7>    <C-W>W                  " previous window
map <F8>    <C-W>w                  " next window
nmap ,w <C-W>w
nmap ,W <C-W>W

nmap <Leader>U :tabprevious<CR>
nmap <Leader>u :tabnext<CR>
map <c-n> :tabnew<CR>

cab fscr    set go=grb<CR><M-m>
cab fscroff set go=gmrbT<CR><M-r>

" *** SEARCH-N-REPLACE COMMANDS
" map <F9>    :g/\</s//&/g<CR>        " word count... use g-<CTRL-G> instead
" map <F10>   :s/ \{2,\}/ <CR>
map <F10>   :set paste<CR>
map <S-F10> :set nopaste<CR>
set pastetoggle=<F10>
map <F12>   :%s/\r//g<CR>           " strip DOS line breaks

" map <S-F10> :%s/  /    <CR>         " two spaces to four
" map <S-F12> :%s/    /  <CR>         " four spaces to two

" vmap <S-F10> :s/  /    <CR>
" vmap <S-F12> :s/    /  <CR>

cab streol      :%s/\s\+$/<CR>
cab cleanup     :%s/<TAB>/  /<CR>%s/\s\+$/<CR>

cab tab2sp      :%s/<TAB>/  /<CR>
cab maketabs    :set noexpandtab<CR>:%retab!<CR>:set expandtab<CR>
cab tabify      :%retab! 2<CR>

cab mgfm        :0read $VIMHOME/includes/mgfm.md


" have <F1> prompt for a help topic, rather than displaying the introduction
" page, and have it do this from any mode:
nnoremap <F1> :help<Space>
vmap <F1> <C-C><F1>
omap <F1> <C-C><F1>
map! <F1> <C-C><F1>

" tab = next word, b = back one word in normal mode
nmap  <TAB>     W
nmap  <S-TAB>   B
nmap  <S-TAB>   B

" * Keystrokes -- Formatting

" have Q reformat the current paragraph (or selected text if there is any):
nnoremap Q gqap
vnoremap Q gq

" have Y behave analogously to D and C rather than to dd and cc (which is
" already done by yy):
noremap Y y$

nmap <C-N> :enew<CR>
nmap <M-q> :qa<CR>
nmap +    zo
nmap -    zc
vmap -    zf
map  ,m   :mkview<CR>
map  ,l   :loadview<CR>
set fmr=[[[,]]]
set fdm=marker

vmap ,c   :s@^@// @g<CR>
vmap ,d   :s@^// @@g<CR>
nmap ,c   0i// <ESC>
nmap ,d   ^3x<ESC>

" map ;; :%s:::g<LEFT><LEFT><LEFT>

vmap ,s "zdi<SPACE><C-R>z<SPACE><ESC>
vmap ,<SPACE> "zdi<SPACE><C-R>z<SPACE><ESC>
vmap ," "zdi"<C-R>z"<ESC>
vmap ,' "zdi'<C-R>z'<ESC>
vmap ,` "zdi`<C-R>z`<ESC>
vmap ,( "zdi( <C-R>z )<ESC>
vmap ,{ "zdi{{<C-R>z}}<ESC>
vmap ,. "zdi . <C-R>z . <ESC>
vmap ,< "zdi<<C-R>z><ESC>
vmap ,* "zdi/* <C-R>z */<ESC>
vmap ,- "zdi<!-- <C-R>z --><ESC>
vmap ,\ "zdi\<C-R>z\<ESC>
vmap ,[ "zdi[<C-R>z]<ESC>
vmap ,[' "zdi['<C-R>z']<ESC>
vmap ,[" "zdi["<C-R>z"]<ESC>

vnoremap < <gv
vnoremap > >gv

" Move single lines up/down
" noremap <C-K> ddkP
" noremap <C-J> ddp

" ### NERDTree and CtrlP
nmap ,t   :NERDTreeToggle<CR>
nmap ,p   :CtrlP<CR>
nmap ,b   :CtrlPBuffer<CR>
nmap ;    :CtrlPBuffer<CR>

let g:vimrubocop_config = '/Users/alholt/.rbenv/shims/rubocop'
let g:vimrubocop_keymap = 0

set runtimepath^=$VIMRUNTIME/bundle/ctrlp.vim
let g:ctrlp_map = "<c-p>"
let g:ctrlp_root_markers=["Gemfile", "Rakefile"]
let g:ctrlp_custom_ignore = '\.git$\|\vendor/*|\.sass-cache/*|\.meteor/*|output/*|build/*|node_modules/*|tmp/*|public/uploads/*'
let g:ctrlp_working_path_mode = 'ra'
let g:ctrlp_match_window_bottom = 0
let g:ctrlp_match_window_reversed = 0
set wildignore+=*/tmp/*,*.so,*.swp,*.zip

let g:ctrlp_buffer_func = { 'enter': 'MyCtrlPMappings' }

func! MyCtrlPMappings()
  nnoremap <buffer> <silent> <c-0> :call <sid>DeleteBuffer()<cr>
endfunc

func! s:DeleteBuffer()
  let line = getline('.')
  let bufid = line =~ '\[\d\+\*No Name\]$' ? str2nr(matchstr(line, '\d\+'))
        \ : fnamemodify(line[2:], ':p')
  exec "bd" bufid
  exec "norm \<F5>"
endfunc

" For those times you can't write to a readonly file
cmap w!! w !sudo tee %

" Can this go in a project-specific vim file and have it autoload?
" cab pl :Rake! p4:push_lab

nmap <Leader>rs  :! ruby ~/rsync.rb -d<CR>
nmap <Leader>frs :! ruby ~/rsync.rb -d -f<CR>
" nmap <Leader>sc  :! scp % lab:/a/mcdnportal/<CR>

cab v       :cd ~/vulcan<CR>
cab go_v3   :cd ~/p4/mcdn-portal-3.0/akamai/mcdn-portal<CR>
cab go_v31  :cd ~/p4/mcdn-portal-3.1/akamai/mcdn-portal<CR>
cab go_v32  :cd ~/git/mcdn-portal-3.2/<CR>
cab go_v33  :cd ~/git/mcdn-portal-3.3/<CR>

" rspec-vim
" map <Leader>r :call RunCurrentSpecFile()<CR>
" map <Leader>s :call RunNearestSpec()<CR>
" map <Leader>l :call RunLastSpec()<CR>
" map <Leader>a :call RunAllSpecs()<CR>


" let g:snippets_dir = $VIM . "\\vimfiles\\bundle\\vim-snippets\\snippets"
" set shortmess=a

nmap qq :q<CR>

nmap <Leader>p4e :silent !p4 edit %<CR>
nmap <Leader>p4a :silent !p4 add %<CR>
nmap <Leader>p4r :silent !p4 revert %<CR>

function! Tab_Or_Complete()
  if col('.')>1 && strpart( getline('.'), col('.')-2, 3 ) =~ '^\w'
    return "\<C-N>"
  else
    return "\<Tab>"
  endif
endfunction
inoremap <Tab> <C-R>=Tab_Or_Complete()<CR>
set dictionary="/usr/dict/words"

" Trigger configuration. Do not use <tab> if you use https://github.com/Valloric/YouCompleteMe.
" let g:UltiSnipsExpandTrigger="<c-i>"
let g:UltiSnipsExpandTrigger="<tab>"
let g:UltiSnipsJumpForwardTrigger="<tab>"
let g:UltiSnipsJumpBackwardTrigger="<s-tab>"

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"
let g:UltiSnipsUsePythonVersion = 2
