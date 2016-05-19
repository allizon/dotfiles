if has("gui_running")
  set lines=60
  set columns=120
  set linespace=3       " space it out a little more (easier to read)

  " colo desert
  " colo dw_blue
  " colo dw_cyan
  " colo dw_green
  " colo dw_purple
  " colo dw_orange
  " colo dw_red
  " colo koehler
  " colo slate2
  " colo zenburn

  " set background=dark " or =light
  colo slate2

  " Automatically reload vim when changing this file
  autocmd! bufwritepost gui.vim source %
else
  " colo slate2
  set background=dark
  " set background=light
  colo solarized
endif
