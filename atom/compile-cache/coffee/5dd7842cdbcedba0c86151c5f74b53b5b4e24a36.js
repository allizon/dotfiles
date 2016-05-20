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
          this.debug('Killed child', child.pid);
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
      var args, dir, err, splitCmd, startTime;
      view.clear();
      this.stop();
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
        if (!fs.statSync(dir).isDirectory()) {
          dir = p.dirname(dir);
        }
        this.child = spawn(cmd, args, {
          cwd: dir
        });
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
            view.footer('Exited with code=' + code + ' in ' + ((new Date - startTime) / 1000) + ' seconds');
            return _this.child = null;
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
      return view.footer('Running: ' + cmd + ' ' + editor.getPath());
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9hdG9tLXJ1bm5lci9saWIvYXRvbS1ydW5uZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLE1BQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsS0FGakMsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FKTixDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxNQUFSLENBTEosQ0FBQTs7QUFBQSxFQU9BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBUGpCLENBQUE7O0FBQUEsRUFTTTs0QkFDSjs7QUFBQSx5QkFBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxvQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDJFQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7S0FERixDQUFBOztBQUFBLHlCQVFBLEdBQUEsR0FDRTtBQUFBLE1BQUEsR0FBQSxFQUFLLG1CQUFMO0FBQUEsTUFDQSxLQUFBLEVBQU8sZUFEUDtLQVRGLENBQUE7O0FBQUEseUJBWUEsbUJBQUEsR0FDRTtBQUFBLE1BQUEsYUFBQSxFQUFlLE9BQWY7QUFBQSxNQUNBLEtBQUEsRUFBTyx1RUFEUDtBQUFBLE1BRUEsVUFBQSxFQUFZLFNBRlo7S0FiRixDQUFBOztBQUFBLHlC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

//# sourceURL=/Users/alholt/.atom/packages/atom-runner/lib/atom-runner.coffee
