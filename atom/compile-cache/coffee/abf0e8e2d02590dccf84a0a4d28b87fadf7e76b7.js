(function() {
  var CompositeDisposable, Housekeeping, Mixin, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require("fs-plus");

  path = require("path");

  Mixin = require('mixto');

  module.exports = Housekeeping = (function(_super) {
    __extends(Housekeeping, _super);

    function Housekeeping() {
      return Housekeeping.__super__.constructor.apply(this, arguments);
    }

    Housekeeping.prototype.initializeHousekeeping = function() {
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          _this.cancelUpdate();
          _this.destroyDecoration();
          return _this.subscriptions.dispose();
        };
      })(this)));
      if (this.repositoryForPath(this.editor.getPath())) {
        this.subscribeToRepository();
        this.subscriptions.add(this.editor.onDidStopChanging(this.notifyContentsModified));
        this.subscriptions.add(this.editor.onDidChangePath(this.notifyContentsModified));
        this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
          return function() {
            return _this.notifyChangeCursorPosition();
          };
        })(this)));
        this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
          return function() {
            return _this.subscribeToRepository();
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:toggle-git-diff-details', (function(_this) {
          return function() {
            return _this.toggleShowDiffDetails();
          };
        })(this)));
        this.subscriptions.add(atom.commands.add("atom-text-editor", 'git-diff-details:close-git-diff-details', (function(_this) {
          return function(e) {
            if (_this.showDiffDetails) {
              return _this.closeDiffDetails();
            } else {
              return e.abortKeyBinding();
            }
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:undo', (function(_this) {
          return function(e) {
            if (_this.showDiffDetails) {
              return _this.undo();
            } else {
              return e.abortKeyBinding();
            }
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:copy', (function(_this) {
          return function(e) {
            if (_this.showDiffDetails) {
              return _this.copy();
            } else {
              return e.abortKeyBinding();
            }
          };
        })(this)));
        return this.scheduleUpdate();
      } else {
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:toggle-git-diff-details', function(e) {
          return e.abortKeyBinding();
        }));
        this.subscriptions.add(atom.commands.add("atom-text-editor", 'git-diff-details:close-git-diff-details', function(e) {
          return e.abortKeyBinding();
        }));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:undo', function(e) {
          return e.abortKeyBinding();
        }));
        return this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:copy', function(e) {
          return e.abortKeyBinding();
        }));
      }
    };

    Housekeeping.prototype.repositoryForPath = function(goalPath) {
      var directory, i, _i, _len, _ref;
      _ref = atom.project.getDirectories();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        directory = _ref[i];
        if (goalPath === directory.getPath() || directory.contains(goalPath)) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    };

    Housekeeping.prototype.subscribeToRepository = function() {
      var repository;
      if (repository = this.repositoryForPath(this.editor.getPath())) {
        this.subscriptions.add(repository.onDidChangeStatuses((function(_this) {
          return function() {
            return _this.scheduleUpdate();
          };
        })(this)));
        return this.subscriptions.add(repository.onDidChangeStatus((function(_this) {
          return function(changedPath) {
            if (changedPath === _this.editor.getPath()) {
              return _this.scheduleUpdate();
            }
          };
        })(this)));
      }
    };

    Housekeeping.prototype.unsubscribeFromCursor = function() {
      var _ref;
      if ((_ref = this.cursorSubscription) != null) {
        _ref.dispose();
      }
      return this.cursorSubscription = null;
    };

    Housekeeping.prototype.cancelUpdate = function() {
      return clearImmediate(this.immediateId);
    };

    Housekeeping.prototype.scheduleUpdate = function() {
      this.cancelUpdate();
      return this.immediateId = setImmediate(this.notifyContentsModified);
    };

    return Housekeeping;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9naXQtZGlmZi1kZXRhaWxzL2xpYi9ob3VzZWtlZXBpbmcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBSlIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLG1DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwyQkFBQSxzQkFBQSxHQUF3QixTQUFBLEdBQUE7QUFDdEIsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFxQixJQUFBLG1CQUFBLENBQUEsQ0FBckIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3RDLFVBQUEsS0FBQyxDQUFBLFlBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQUhzQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLENBQW5CLENBREEsQ0FBQTtBQU1BLE1BQUEsSUFBRyxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENB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

//# sourceURL=/Users/alholt/.atom/packages/git-diff-details/lib/housekeeping.coffee
