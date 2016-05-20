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
        title: 'Show Output Pane',
        description: 'Displays the output pane when running commands. Uncheck to hide output.',
        type: 'boolean',
        "default": true,
        order: 1
      },
      paneSplitDirection: {
        title: 'Pane Split Direction',
        description: 'The direction to split when opening the output pane.',
        type: 'string',
        "default": 'Right',
        "enum": ['Right', 'Down', 'Up', 'Left']
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

    AtomRunner.prototype.splitFuncDefault = 'splitRight';

    AtomRunner.prototype.splitFuncs = {
      Right: 'splitRight',
      Left: 'splitLeft',
      Up: 'splitUp',
      Down: 'splitDown'
    };

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
      var cmd, dir, dirfunc, editor, pane, panes, path, view, _ref;
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
          dir = atom.config.get('atom-runner.paneSplitDirection');
          dirfunc = this.splitFuncs[dir] || this.splitFuncDefault;
          pane = panes[panes.length - 1][dirfunc](view);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9hdG9tLXJ1bm5lci9saWIvYXRvbS1ydW5uZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLE1BQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsS0FGakMsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FKTixDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxNQUFSLENBTEosQ0FBQTs7QUFBQSxFQU9BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBUGpCLENBQUE7O0FBQUEsRUFTTTs0QkFDSjs7QUFBQSx5QkFBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxrQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHlFQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7QUFBQSxNQU1BLGtCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHNEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLE9BSFQ7QUFBQSxRQUlBLE1BQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLElBQWxCLEVBQXdCLE1BQXhCLENBSk47T0FQRjtLQURGLENBQUE7O0FB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

//# sourceURL=/Users/alholt/.atom/packages/atom-runner/lib/atom-runner.coffee
