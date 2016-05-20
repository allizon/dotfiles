import sublime, sublime_plugin
import os
import subprocess

class RubocopCommand(sublime_plugin.EventListener):
  # Replace this with the path to your Rubocop bin (obviously)
  RUBOCOP_BIN = '/Users/alholt/.rvm/gems/ruby-2.0.0-p576/bin/rubocop'

  def on_post_save_async(self, view):
    if view.file_name().endswith('rb'):
      self.set_status('Running through Rubocop...')
      cmd_a = [ self.RUBOCOP_BIN + ' --format simple ' + view.file_name() ]
      p = subprocess.Popen(cmd_a, stdout = subprocess.PIPE,
        stderr = subprocess.STDOUT, shell = True)
      if p.stdout is not None:
        self.process_results(p.stdout.readlines())
      else:
        self.set_status('No Rubocop issues found.')

  def process_results(self, data):
    sublime.status_message(data[-1].decode('utf-8'))
    for row in data:
      row = row.decode('utf-8')
      if len(row) > 1:
        print(row)

  def set_status(self, message):
    print(message)
    sublime.status_message(message)
