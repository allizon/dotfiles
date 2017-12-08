" All plugin settings and configuration go here.

"""""
" vim-pencil
augroup pencil
  autocmd!
  autocmd FileType markdown,mkd call pencil#init({'wrap': 'soft'})
  autocmd FileType text         call pencil#init()
  autocmd BufRead  todo.txt     :PFormatOff
augroup END

"""""
" Ctrl-P
" let g:ctrlp_map = "<c-p>"
" let g:ctrlp_root_markers=["Gemfile", "Rakefile"]
let g:ctrlp_custom_ignore = '\.git$\|\vendor/*|\.sass-cache/*|\.meteor/*|output/*|build/*|node_modules/*|tmp/*|public/uploads/*|doc/*'
" let g:ctrlp_working_path_mode = 'ra'
let g:ctrlp_match_window_bottom = 0
let g:ctrlp_dotfiles = 0
let g:ctrlp_switch_buffer = 0
let g:ctrlp_match_window_reversed = 0
" set wildignore+=*/tmp/*,*.so,*.swp,*.zip


"""""
" NERDTree
let g:NERDTreeQuitOnOpen = 1
let g:NERDTreeWinSize = 60


"""""
" UltiSnips
" Trigger configuration. Do not use <tab> if you use https://github.com/Valloric/YouCompleteMe.
let g:UltiSnipsExpandTrigger="<c-j>"
let g:UltiSnipsListSnippets="<m-k>"
" let g:UltiSnipsExpandTrigger="<tab>"
let g:UltiSnipsJumpForwardTrigger="<tab>"
let g:UltiSnipsJumpBackwardTrigger="<s-tab>"

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsSnippetDirectories=["/Users/alholt/.config/nvim/UltiSnips"]
let g:UltiSnipsEditSplit="normal"
let g:UltiSnipsUsePythonVersion = 2


"""""
" NeoTerm
let g:neoterm_position = 'horizontal'
let g:neoterm_automap_keys = ',tt'
let g:neoterm_keep_term_open = 0


"""""
" YouCompleteMe
let g:ycm_key_list_stop_completion = ['<C-y>']


"""""
" Neosnippets
let g:neosnippet#snippets_directory = "/Users/alholt/.local/share/nvim/plugged/neosnippet-snippets/neosnippets"
let g:neosnippet#scope_aliases = {}
let g:neosnippet#scope_aliases['ruby'] = 'ruby,ruby-rails'
let g:neosnippet#scope_aliases['javascript'] = 'javascript,vue'


"""""
" vim-test
let test#strategy="neoterm"


"""""
" ack
let g:ackprg = 'ag --nogroup --nocolor --column'

"""""
" Airline
" let g:airline#extensions#tabline#enabled = 1
