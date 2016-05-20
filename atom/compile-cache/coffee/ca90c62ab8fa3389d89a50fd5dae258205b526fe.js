(function() {
  var AtomRunner, AtomRunnerView, ConfigObserver, fs, p, spawn, url,
    __slice = [].slice;

  ConfigObserver = require('atom').ConfigObserver;

  spawn = require('child_process').spawn;

  fs = require('fs');

  url = require('url');

  p = require('path');

  AtomRunnerView = require('./atom-runner-view');

  AtomRunner = (function() {
    function AtomRunner() {}

    AtomRunner.prototype.config = {
      showOutputWindow: {
        title: 'Show Output Window',
        description: 'Displays the output window when running commands. Uncheck to hide output.',
        type: 'boolean',
        "default": true,
        order: 1
      }
    };

    AtomRunner.prototype.cfg = {
      ext: 'runner.extensions',
      scope: 'runner.scopes'
    };

    AtomRunner.prototype.defaultExtensionMap = {
      'spec.coffee': 'mocha',
      'ps1': 'c:\\windows\\sysnative\\windowspowershell\\v1.0\\powershell.exe -file',
      '_test.go': 'go test'
    };

    AtomRunner.prototype.defaultScopeMap = {
      coffee: 'coffee',
      js: 'node',
      ruby: 'ruby',
      python: 'python',
      go: 'go run',
      shell: 'bash',
      powershell: 'c:\\windows\\sysnative\\windowspowershell\\v1.0\\powershell.exe -noninteractive -noprofile -c -'
    };

    AtomRunner.prototype.extensionMap = null;

    AtomRunner.prototype.scopeMap = null;

    AtomRunner.prototype.debug = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.debug.apply(console, ['[atom-runner]'].concat(__slice.call(args)));
    };

    AtomRunner.prototype.initEnv = function() {
      var out, pid, shell, _ref;
      if (process.platform === 'darwin') {
        _ref = [process.env.SHELL || 'bash', ''], shell = _ref[0], out = _ref[1];
        this.debug('Importing ENV from', shell);
        pid = spawn(shell, ['--login', '-c', 'env']);
        pid.stdout.on('data', function(chunk) {
          return out += chunk;
        });
        pid.on('error', (function(_this) {
          return function() {
            return _this.debug('Failed to import ENV from', shell);
          };
        })(this));
        pid.on('close', (function(_this) {
          return function() {
            var line, match, _i, _len, _ref1, _results;
            _ref1 = out.split('\n');
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              line = _ref1[_i];
              match = line.match(/^(\S+?)=(.+)/);
              if (match) {
                _results.push(process.env[match[1]] = match[2]);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        })(this));
        return pid.stdin.end();
      }
    };

    AtomRunner.prototype.destroy = function() {
      atom.config.unobserve(this.cfg.ext);
      return atom.config.unobserve(this.cfg.scope);
    };

    AtomRunner.prototype.activate = function() {
      this.initEnv();
      atom.config.setDefaults(this.cfg.ext, this.defaultExtensionMap);
      atom.config.setDefaults(this.cfg.scope, this.defaultScopeMap);
      atom.config.observe(this.cfg.ext, (function(_this) {
        return function() {
          return _this.extensionMap = atom.config.get(_this.cfg.ext);
        };
      })(this));
      atom.config.observe(this.cfg.scope, (function(_this) {
        return function() {
          return _this.scopeMap = atom.config.get(_this.cfg.scope);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:file', (function(_this) {
        return function() {
          return _this.run(false);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:selection', (function(_this) {
        return function() {
          return _this.run(true);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:stop', (function(_this) {
        return function() {
          return _this.stop();
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:close', (function(_this) {
        return function() {
          return _this.stopAndClose();
        };
      })(this));
      return atom.commands.add('.atom-runner', 'run:copy', (function(_this) {
        return function() {
          return atom.clipboard.write(window.getSelection().toString());
        };
      })(this));
    };

    AtomRunner.prototype.run = function(selection) {
      var cmd, editor, pane, panes, path, view, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      path = editor.getPath();
      cmd = this.commandFor(editor, selection);
      if (cmd == null) {
        console.warn("No registered executable for file '" + path + "'");
        return;
      }
      if (atom.config.get('atom-runner.showOutputWindow')) {
        _ref = this.runnerView(), pane = _ref.pane, view = _ref.view;
        if (view == null) {
          view = new AtomRunnerView(editor.getTitle());
          panes = atom.workspace.getPanes();
          pane = panes[panes.length - 1].splitRight(view);
        }
      } else {
        view = {
          mocked: true,
          append: function(text, type) {
            if (type === 'stderr') {
              return console.error(text);
            } else {
              return console.log(text);
            }
          },
          scrollToBottom: function() {},
          clear: function() {},
          footer: function() {}
        };
      }
      if (!view.mocked) {
        view.setTitle(editor.getTitle());
        pane.activateItem(view);
      }
      return this.execute(cmd, editor, view, selection);
    };

    AtomRunner.prototype.stop = function(view) {
      if (this.child) {
        if (view == null) {
          view = this.runnerView().view;
        }
        if (view && (view.isOnDom() != null)) {
          view.append('^C', 'stdin');
        } else {
          this.debug('Killed child', this.child.pid);
        }
        this.child.kill('SIGINT');
        if (this.child.killed) {
          return this.child = null;
        }
      }
    };

    AtomRunner.prototype.stopAndClose = function() {
      var pane, view, _ref;
      _ref = this.runnerView(), pane = _ref.pane, view = _ref.view;
      if (pane != null) {
        pane.removeItem(view);
      }
      return this.stop(view);
    };

    AtomRunner.prototype.execute = function(cmd, editor, view, selection) {
      var args, currentPid, dir, err, splitCmd, startTime;
      this.stop();
      view.clear();
      args = [];
      if (editor.getPath()) {
        editor.save();
        if (!selection) {
          args.push(editor.getPath());
        }
      }
      splitCmd = cmd.split(/\s+/);
      if (splitCmd.length > 1) {
        cmd = splitCmd[0];
        args = splitCmd.slice(1).concat(args);
      }
      try {
        dir = atom.project.getPaths()[0] || '.';
        try {
          if (!fs.statSync(dir).isDirectory()) {
            throw new Error("Bad dir");
          }
        } catch (_error) {
          dir = p.dirname(dir);
        }
        this.child = spawn(cmd, args, {
          cwd: dir
        });
        currentPid = this.child.pid;
        this.child.on('error', (function(_this) {
          return function(err) {
            if (err.message.match(/\bENOENT$/)) {
              view.append('Unable to find command: ' + cmd + '\n', 'stderr');
              view.append('Are you sure PATH is configured correctly?\n\n', 'stderr');
              view.append('ENV PATH: ' + process.env.PATH + '\n\n', 'stderr');
            }
            view.append(err.stack, 'stderr');
            view.scrollToBottom();
            return _this.child = null;
          };
        })(this));
        this.child.stderr.on('data', (function(_this) {
          return function(data) {
            view.append(data, 'stderr');
            return view.scrollToBottom();
          };
        })(this));
        this.child.stdout.on('data', (function(_this) {
          return function(data) {
            view.append(data, 'stdout');
            return view.scrollToBottom();
          };
        })(this));
        this.child.on('close', (function(_this) {
          return function(code, signal) {
            var time;
            if (_this.child && _this.child.pid === currentPid) {
              time = (new Date - startTime) / 1000;
              view.footer("Exited with code=" + code + " in " + time + " seconds");
              return view.scrollToBottom();
            }
          };
        })(this));
      } catch (_error) {
        err = _error;
        view.append(err.stack, 'stderr');
        view.scrollToBottom();
        this.stop();
      }
      startTime = new Date;
      if (selection) {
        this.child.stdin.write(editor.getLastSelection().getText());
      } else if (!editor.getPath()) {
        this.child.stdin.write(editor.getText());
      }
      this.child.stdin.end();
      return view.footer("Running: " + cmd + " " + (editor.getPath()) + " (pid " + this.child.pid + ")");
    };

    AtomRunner.prototype.commandFor = function(editor, selection) {
      var boundary, ext, name, scope, shebang, _i, _j, _len, _len1, _ref, _ref1;
      shebang = this.commandForShebang(editor);
      if (shebang != null) {
        return shebang;
      }
      if (!selection) {
        if (editor.getPath() != null) {
          _ref = Object.keys(this.extensionMap).sort(function(a, b) {
            return b.length - a.length;
          });
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ext = _ref[_i];
            boundary = ext.match(/^\b/) ? '' : '\\b';
            if (editor.getPath().match(boundary + ext + '$')) {
              return this.extensionMap[ext];
            }
          }
        }
      }
      scope = editor.getLastCursor().getScopeDescriptor().scopes[0];
      _ref1 = Object.keys(this.scopeMap);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        if (scope.match('^source\\.' + name + '\\b')) {
          return this.scopeMap[name];
        }
      }
    };

    AtomRunner.prototype.commandForShebang = function(editor) {
      var match;
      match = editor.lineTextForBufferRow(0).match(/^#!\s*(.+)/);
      return match && match[1];
    };

    AtomRunner.prototype.runnerView = function() {
      var pane, view, _i, _j, _len, _len1, _ref, _ref1;
      _ref = atom.workspace.getPanes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        _ref1 = pane.getItems();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          view = _ref1[_j];
          if (view instanceof AtomRunnerView) {
            return {
              pane: pane,
              view: view
            };
          }
        }
      }
      return {
        pane: null,
        view: null
      };
    };

    return AtomRunner;

  })();

  module.exports = new AtomRunner;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9hdG9tLXJ1bm5lci9saWIvYXRvbS1ydW5uZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLE1BQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsS0FGakMsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FKTixDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxNQUFSLENBTEosQ0FBQTs7QUFBQSxFQU9BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBUGpCLENBQUE7O0FBQUEsRUFTTTs0QkFDSjs7QUFBQSx5QkFBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxvQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDJFQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7S0FERixDQUFBOztBQUFBLHlCQVFBLEdBQUEsR0FDRTtBQUFBLE1BQUEsR0FBQSxFQUFLLG1CQUFMO0FBQUEsTUFDQSxLQUFBLEVBQU8sZUFEUDtLQVRGLENBQUE7O0FBQUEseUJBWUEsbUJBQUEsR0FDRTtBQUFBLE1BQUEsYUFBQSxFQUFlLE9BQWY7QUFBQSxNQUNBLEtBQUEsRUFBTyx1RUFEUDtBQUFBLE1BRUEsVUFBQSxFQUFZLFNBRlo7S0FiRixDQUFBOztBQUFBLHlCQWlCQSxlQUFBLEdBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSxRQUFSO0FBQUEsTUFDQSxFQUFBLEVBQUksTUFESjtBQUFBLE1BRUEsSUFBQSxFQUFNLE1BRk47QUFBQSxNQUdBLE1BQUEsRUFBUSxRQUhSO0FBQUEsTUFJQSxFQUFBLEVBQUksUUFKSjtBQUFBLE1BS0EsS0FBQSxFQUFPLE1BTFA7QUFBQSxNQU1BLFVBQUEsRUFBWSxpR0FOWjtLQWxCRixDQUFBOztBQUFBLHlCQTBCQSxZQUFBLEdBQWMsSUExQmQsQ0FBQTs7QUFBQSx5QkEyQkEsUUFBQSxHQUFVLElBM0JWLENBQUE7O0FBQUEseUJBNkJBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLElBQUE7QUFBQSxNQURNLDhEQUNOLENBQUE7YUFBQSxPQUFPLENBQUMsS0FBUixnQkFBYyxDQUFBLGVBQWlCLFNBQUEsYUFBQSxJQUFBLENBQUEsQ0FBL0IsRUFESztJQUFBLENBN0JQLENBQUE7O0FBQUEseUJBZ0NBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLHFCQUFBO0FBQUEsTUFBQSxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLFFBQXZCO0FBQ0UsUUFBQSxPQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFaLElBQXFCLE1BQXRCLEVBQThCLEVBQTlCLENBQWYsRUFBQyxlQUFELEVBQVEsYUFBUixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFQLEVBQTZCLEtBQTdCLENBREEsQ0FBQTtBQUFBLFFBRUEsR0FBQSxHQUFNLEtBQUEsQ0FBTSxLQUFOLEVBQWEsQ0FBQyxTQUFELEVBQVksSUFBWixFQUFrQixLQUFsQixDQUFiLENBRk4sQ0FBQTtBQUFBLFFBR0EsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFYLENBQWMsTUFBZCxFQUFzQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxHQUFBLElBQU8sTUFBbEI7UUFBQSxDQUF0QixDQUhBLENBQUE7QUFBQSxRQUlBLEdBQUcsQ0FBQyxFQUFKLENBQU8sT0FBUCxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDZCxLQUFDLENBQUEsS0FBRCxDQUFPLDJCQUFQLEVBQW9DLEtBQXBDLEVBRGM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQixDQUpBLENBQUE7QUFBQSxRQU1BLEdBQUcsQ0FBQyxFQUFKLENBQU8sT0FBUCxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNkLGdCQUFBLHNDQUFBO0FBQUE7QUFBQTtpQkFBQSw0Q0FBQTsrQkFBQTtBQUNFLGNBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsY0FBWCxDQUFSLENBQUE7QUFDQSxjQUFBLElBQW9DLEtBQXBDOzhCQUFBLE9BQU8sQ0FBQyxHQUFJLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBTixDQUFaLEdBQXdCLEtBQU0sQ0FBQSxDQUFBLEdBQTlCO2VBQUEsTUFBQTtzQ0FBQTtlQUZGO0FBQUE7NEJBRGM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQixDQU5BLENBQUE7ZUFVQSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQVYsQ0FBQSxFQVhGO09BRE87SUFBQSxDQWhDVCxDQUFBOztBQUFBLHlCQThDQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUEzQixDQUFBLENBQUE7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUEzQixFQUZPO0lBQUEsQ0E5Q1QsQ0FBQTs7QUFBQSx5QkFrREEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsR0FBRyxDQUFDLEdBQTdCLEVBQWtDLElBQUMsQ0FBQSxtQkFBbkMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUE3QixFQUFvQyxJQUFDLENBQUEsZUFBckMsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUF6QixFQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM1QixLQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsS0FBQyxDQUFBLEdBQUcsQ0FBQyxHQUFyQixFQURZO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUF6QixFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM5QixLQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixLQUFDLENBQUEsR0FBRyxDQUFDLEtBQXJCLEVBRGtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsQ0FMQSxDQUFBO0FBQUEsTUFPQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLFVBQXBDLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQVBBLENBQUE7QUFBQSxNQVFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZUFBcEMsRUFBcUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsR0FBRCxDQUFLLElBQUwsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJELENBUkEsQ0FBQTtBQUFBLE1BU0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxVQUFwQyxFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhELENBVEEsQ0FBQTtBQUFBLE1BVUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxXQUFwQyxFQUFpRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxZQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpELENBVkEsQ0FBQTthQVdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixjQUFsQixFQUFrQyxVQUFsQyxFQUE4QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFxQixDQUFDLFFBQXRCLENBQUEsQ0FBckIsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QyxFQVpRO0lBQUEsQ0FsRFYsQ0FBQTs7QUFBQSx5QkFpRUEsR0FBQSxHQUFLLFNBQUMsU0FBRCxHQUFBO0FBQ0gsVUFBQSwwQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFDQSxNQUFBLElBQWMsY0FBZDtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFHQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUhQLENBQUE7QUFBQSxNQUlBLEdBQUEsR0FBTSxJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVosRUFBb0IsU0FBcEIsQ0FKTixDQUFBO0FBS0EsTUFBQSxJQUFPLFdBQVA7QUFDRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWMscUNBQUEsR0FBcUMsSUFBckMsR0FBMEMsR0FBeEQsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxDQUZGO09BTEE7QUFTQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixDQUFIO0FBQ0UsUUFBQSxPQUFlLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBZixFQUFDLFlBQUEsSUFBRCxFQUFPLFlBQUEsSUFBUCxDQUFBO0FBQ0EsUUFBQSxJQUFPLFlBQVA7QUFDRSxVQUFBLElBQUEsR0FBVyxJQUFBLGNBQUEsQ0FBZSxNQUFNLENBQUMsUUFBUCxDQUFBLENBQWYsQ0FBWCxDQUFBO0FBQUEsVUFDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FEUixDQUFBO0FBQUEsVUFFQSxJQUFBLEdBQU8sS0FBTSxDQUFBLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBZixDQUFpQixDQUFDLFVBQXhCLENBQW1DLElBQW5DLENBRlAsQ0FERjtTQUZGO09BQUEsTUFBQTtBQU9FLFFBQUEsSUFBQSxHQUNFO0FBQUEsVUFBQSxNQUFBLEVBQVEsSUFBUjtBQUFBLFVBQ0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNOLFlBQUEsSUFBRyxJQUFBLEtBQVEsUUFBWDtxQkFDRSxPQUFPLENBQUMsS0FBUixDQUFjLElBQWQsRUFERjthQUFBLE1BQUE7cUJBR0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLEVBSEY7YUFETTtVQUFBLENBRFI7QUFBQSxVQU1BLGNBQUEsRUFBZ0IsU0FBQSxHQUFBLENBTmhCO0FBQUEsVUFPQSxLQUFBLEVBQU8sU0FBQSxHQUFBLENBUFA7QUFBQSxVQVFBLE1BQUEsRUFBUSxTQUFBLEdBQUEsQ0FSUjtTQURGLENBUEY7T0FUQTtBQTJCQSxNQUFBLElBQUEsQ0FBQSxJQUFXLENBQUMsTUFBWjtBQUNFLFFBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFNLENBQUMsUUFBUCxDQUFBLENBQWQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixJQUFsQixDQURBLENBREY7T0EzQkE7YUErQkEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxHQUFULEVBQWMsTUFBZCxFQUFzQixJQUF0QixFQUE0QixTQUE1QixFQWhDRztJQUFBLENBakVMLENBQUE7O0FBQUEseUJBbUdBLElBQUEsR0FBTSxTQUFDLElBQUQsR0FBQTtBQUNKLE1BQUEsSUFBRyxJQUFDLENBQUEsS0FBSjs7VUFDRSxPQUFRLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBYSxDQUFDO1NBQXRCO0FBQ0EsUUFBQSxJQUFHLElBQUEsSUFBUyx3QkFBWjtBQUNFLFVBQUEsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLE9BQWxCLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sY0FBUCxFQUF1QixJQUFDLENBQUEsS0FBSyxDQUFDLEdBQTlCLENBQUEsQ0FIRjtTQURBO0FBQUEsUUFLQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxRQUFaLENBTEEsQ0FBQTtBQU1BLFFBQUEsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVY7aUJBQ0UsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQURYO1NBUEY7T0FESTtJQUFBLENBbkdOLENBQUE7O0FBQUEseUJBOEdBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLGdCQUFBO0FBQUEsTUFBQSxPQUFlLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBZixFQUFDLFlBQUEsSUFBRCxFQUFPLFlBQUEsSUFBUCxDQUFBOztRQUNBLElBQUksQ0FBRSxVQUFOLENBQWlCLElBQWpCO09BREE7YUFFQSxJQUFDLENBQUEsSUFBRCxDQUFNLElBQU4sRUFIWTtJQUFBLENBOUdkLENBQUE7O0FBQUEseUJBbUhBLE9BQUEsR0FBUyxTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsSUFBZCxFQUFvQixTQUFwQixHQUFBO0FBQ1AsVUFBQSwrQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFBLEdBQU8sRUFIUCxDQUFBO0FBSUEsTUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBSDtBQUNFLFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFBLENBQUE7QUFDQSxRQUFBLElBQStCLENBQUEsU0FBL0I7QUFBQSxVQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFWLENBQUEsQ0FBQTtTQUZGO09BSkE7QUFBQSxNQU9BLFFBQUEsR0FBVyxHQUFHLENBQUMsS0FBSixDQUFVLEtBQVYsQ0FQWCxDQUFBO0FBUUEsTUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQXJCO0FBQ0UsUUFBQSxHQUFBLEdBQU0sUUFBUyxDQUFBLENBQUEsQ0FBZixDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sUUFBUSxDQUFDLEtBQVQsQ0FBZSxDQUFmLENBQWlCLENBQUMsTUFBbEIsQ0FBeUIsSUFBekIsQ0FEUCxDQURGO09BUkE7QUFXQTtBQUNFLFFBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUF4QixJQUE4QixHQUFwQyxDQUFBO0FBQ0E7QUFDRSxVQUFBLElBQUcsQ0FBQSxFQUFNLENBQUMsUUFBSCxDQUFZLEdBQVosQ0FBZ0IsQ0FBQyxXQUFqQixDQUFBLENBQVA7QUFDRSxrQkFBVSxJQUFBLEtBQUEsQ0FBTSxTQUFOLENBQVYsQ0FERjtXQURGO1NBQUEsY0FBQTtBQUlFLFVBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxPQUFGLENBQVUsR0FBVixDQUFOLENBSkY7U0FEQTtBQUFBLFFBTUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFBLENBQU0sR0FBTixFQUFXLElBQVgsRUFBaUI7QUFBQSxVQUFBLEdBQUEsRUFBSyxHQUFMO1NBQWpCLENBTlQsQ0FBQTtBQUFBLFFBT0EsVUFBQSxHQUFhLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FQcEIsQ0FBQTtBQUFBLFFBUUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsT0FBVixFQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsR0FBRCxHQUFBO0FBQ2pCLFlBQUEsSUFBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQVosQ0FBa0IsV0FBbEIsQ0FBSDtBQUNFLGNBQUEsSUFBSSxDQUFDLE1BQUwsQ0FBWSwwQkFBQSxHQUE2QixHQUE3QixHQUFtQyxJQUEvQyxFQUFxRCxRQUFyRCxDQUFBLENBQUE7QUFBQSxjQUNBLElBQUksQ0FBQyxNQUFMLENBQVksZ0RBQVosRUFBOEQsUUFBOUQsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsTUFBTCxDQUFZLFlBQUEsR0FBZSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQTNCLEdBQWtDLE1BQTlDLEVBQXNELFFBQXRELENBRkEsQ0FERjthQUFBO0FBQUEsWUFJQSxJQUFJLENBQUMsTUFBTCxDQUFZLEdBQUcsQ0FBQyxLQUFoQixFQUF1QixRQUF2QixDQUpBLENBQUE7QUFBQSxZQUtBLElBQUksQ0FBQyxjQUFMLENBQUEsQ0FMQSxDQUFBO21CQU1BLEtBQUMsQ0FBQSxLQUFELEdBQVMsS0FQUTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CLENBUkEsQ0FBQTtBQUFBLFFBZ0JBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQWQsQ0FBaUIsTUFBakIsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLElBQUQsR0FBQTtBQUN2QixZQUFBLElBQUksQ0FBQyxNQUFMLENBQVksSUFBWixFQUFrQixRQUFsQixDQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLGNBQUwsQ0FBQSxFQUZ1QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLENBaEJBLENBQUE7QUFBQSxRQW1CQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFkLENBQWlCLE1BQWpCLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxJQUFELEdBQUE7QUFDdkIsWUFBQSxJQUFJLENBQUMsTUFBTCxDQUFZLElBQVosRUFBa0IsUUFBbEIsQ0FBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxjQUFMLENBQUEsRUFGdUI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQW5CQSxDQUFBO0FBQUEsUUFzQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsT0FBVixFQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUNqQixnQkFBQSxJQUFBO0FBQUEsWUFBQSxJQUFHLEtBQUMsQ0FBQSxLQUFELElBQVUsS0FBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLEtBQWMsVUFBM0I7QUFDRSxjQUFBLElBQUEsR0FBUSxDQUFDLEdBQUEsQ0FBQSxJQUFBLEdBQVcsU0FBWixDQUFBLEdBQXlCLElBQWpDLENBQUE7QUFBQSxjQUNBLElBQUksQ0FBQyxNQUFMLENBQWEsbUJBQUEsR0FBbUIsSUFBbkIsR0FBd0IsTUFBeEIsR0FBOEIsSUFBOUIsR0FBbUMsVUFBaEQsQ0FEQSxDQUFBO3FCQUVBLElBQUksQ0FBQyxjQUFMLENBQUEsRUFIRjthQURpQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CLENBdEJBLENBREY7T0FBQSxjQUFBO0FBNkJFLFFBREksWUFDSixDQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTCxDQUFZLEdBQUcsQ0FBQyxLQUFoQixFQUF1QixRQUF2QixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxjQUFMLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBRkEsQ0E3QkY7T0FYQTtBQUFBLE1BNENBLFNBQUEsR0FBWSxHQUFBLENBQUEsSUE1Q1osQ0FBQTtBQTZDQSxNQUFBLElBQUcsU0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBYixDQUFtQixNQUFNLENBQUMsZ0JBQVAsQ0FBQSxDQUF5QixDQUFDLE9BQTFCLENBQUEsQ0FBbkIsQ0FBQSxDQURGO09BQUEsTUFFSyxJQUFHLENBQUEsTUFBTyxDQUFDLE9BQVAsQ0FBQSxDQUFKO0FBQ0gsUUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFiLENBQW1CLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBbkIsQ0FBQSxDQURHO09BL0NMO0FBQUEsTUFpREEsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBYixDQUFBLENBakRBLENBQUE7YUFrREEsSUFBSSxDQUFDLE1BQUwsQ0FBYSxXQUFBLEdBQVcsR0FBWCxHQUFlLEdBQWYsR0FBaUIsQ0FBQyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUQsQ0FBakIsR0FBbUMsUUFBbkMsR0FBMkMsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFsRCxHQUFzRCxHQUFuRSxFQW5ETztJQUFBLENBbkhULENBQUE7O0FBQUEseUJBd0tBLFVBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxTQUFULEdBQUE7QUFFVixVQUFBLHFFQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGlCQUFELENBQW1CLE1BQW5CLENBQVYsQ0FBQTtBQUNBLE1BQUEsSUFBa0IsZUFBbEI7QUFBQSxlQUFPLE9BQVAsQ0FBQTtPQURBO0FBSUEsTUFBQSxJQUFJLENBQUEsU0FBSjtBQUVFLFFBQUEsSUFBRyx3QkFBSDtBQUNFOzs7QUFBQSxlQUFBLDJDQUFBOzJCQUFBO0FBQ0UsWUFBQSxRQUFBLEdBQWMsR0FBRyxDQUFDLEtBQUosQ0FBVSxLQUFWLENBQUgsR0FBeUIsRUFBekIsR0FBaUMsS0FBNUMsQ0FBQTtBQUNBLFlBQUEsSUFBRyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsS0FBakIsQ0FBdUIsUUFBQSxHQUFXLEdBQVgsR0FBaUIsR0FBeEMsQ0FBSDtBQUNFLHFCQUFPLElBQUMsQ0FBQSxZQUFhLENBQUEsR0FBQSxDQUFyQixDQURGO2FBRkY7QUFBQSxXQURGO1NBRkY7T0FKQTtBQUFBLE1BYUEsS0FBQSxHQUFRLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxrQkFBdkIsQ0FBQSxDQUEyQyxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBYjNELENBQUE7QUFjQTtBQUFBLFdBQUEsOENBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUcsS0FBSyxDQUFDLEtBQU4sQ0FBWSxZQUFBLEdBQWUsSUFBZixHQUFzQixLQUFsQyxDQUFIO0FBQ0UsaUJBQU8sSUFBQyxDQUFBLFFBQVMsQ0FBQSxJQUFBLENBQWpCLENBREY7U0FERjtBQUFBLE9BaEJVO0lBQUEsQ0F4S1osQ0FBQTs7QUFBQSx5QkE0TEEsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEdBQUE7QUFDakIsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQThCLENBQUMsS0FBL0IsQ0FBcUMsWUFBckMsQ0FBUixDQUFBO2FBQ0EsS0FBQSxJQUFVLEtBQU0sQ0FBQSxDQUFBLEVBRkM7SUFBQSxDQTVMbkIsQ0FBQTs7QUFBQSx5QkFnTUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsNENBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7d0JBQUE7QUFDRTtBQUFBLGFBQUEsOENBQUE7MkJBQUE7QUFDRSxVQUFBLElBQW1DLElBQUEsWUFBZ0IsY0FBbkQ7QUFBQSxtQkFBTztBQUFBLGNBQUMsSUFBQSxFQUFNLElBQVA7QUFBQSxjQUFhLElBQUEsRUFBTSxJQUFuQjthQUFQLENBQUE7V0FERjtBQUFBLFNBREY7QUFBQSxPQUFBO2FBR0E7QUFBQSxRQUFDLElBQUEsRUFBTSxJQUFQO0FBQUEsUUFBYSxJQUFBLEVBQU0sSUFBbkI7UUFKVTtJQUFBLENBaE1aLENBQUE7O3NCQUFBOztNQVZGLENBQUE7O0FBQUEsRUFpTkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsR0FBQSxDQUFBLFVBak5qQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/alholt/.atom/packages/atom-runner/lib/atom-runner.coffee
