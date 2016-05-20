(function() {
  var AtomGitDiffDetailsView, DiffDetailsDataManager, Highlights, Housekeeping, Point, Range, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  Highlights = require('highlights');

  DiffDetailsDataManager = require('./data-manager');

  Housekeeping = require('./housekeeping');

  module.exports = AtomGitDiffDetailsView = (function(_super) {
    __extends(AtomGitDiffDetailsView, _super);

    function AtomGitDiffDetailsView() {
      this.notifyContentsModified = __bind(this.notifyContentsModified, this);
      return AtomGitDiffDetailsView.__super__.constructor.apply(this, arguments);
    }

    Housekeeping.includeInto(AtomGitDiffDetailsView);

    AtomGitDiffDetailsView.content = function() {
      return this.div({
        "class": "git-diff-details-outer"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "git-diff-details-main-panel",
            outlet: "mainPanel"
          }, function() {
            return _this.div({
              "class": "editor",
              outlet: "contents"
            });
          });
          return _this.div({
            "class": "git-diff-details-button-panel",
            outlet: "buttonPanel"
          }, function() {
            _this.button({
              "class": 'btn btn-primary inline-block-tight',
              click: "copy"
            }, 'Copy');
            return _this.button({
              "class": 'btn btn-error inline-block-tight',
              click: "undo"
            }, 'Undo');
          });
        };
      })(this));
    };

    AtomGitDiffDetailsView.prototype.initialize = function(editor) {
      this.editor = editor;
      this.editorView = atom.views.getView(this.editor);
      this.initializeHousekeeping();
      this.preventFocusOut();
      this.highlighter = new Highlights();
      this.diffDetailsDataManager = new DiffDetailsDataManager();
      this.showDiffDetails = false;
      this.lineDiffDetails = null;
      return this.updateCurrentRow();
    };

    AtomGitDiffDetailsView.prototype.preventFocusOut = function() {
      this.buttonPanel.on('mousedown', function() {
        return false;
      });
      return this.mainPanel.on('mousedown', function() {
        return false;
      });
    };

    AtomGitDiffDetailsView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    AtomGitDiffDetailsView.prototype.updateCurrentRow = function() {
      var newCurrentRow, _ref1, _ref2;
      newCurrentRow = ((_ref1 = this.getActiveTextEditor()) != null ? (_ref2 = _ref1.getCursorBufferPosition()) != null ? _ref2.row : void 0 : void 0) + 1;
      if (newCurrentRow !== this.currentRow) {
        this.currentRow = newCurrentRow;
        return true;
      }
      return false;
    };

    AtomGitDiffDetailsView.prototype.notifyContentsModified = function() {
      if (this.editor.isDestroyed()) {
        return;
      }
      this.diffDetailsDataManager.invalidate(this.repositoryForPath(this.editor.getPath()), this.editor.getPath(), this.editor.getText());
      if (this.showDiffDetails) {
        return this.updateDiffDetailsDisplay();
      }
    };

    AtomGitDiffDetailsView.prototype.updateDiffDetails = function() {
      this.diffDetailsDataManager.invalidatePreviousSelectedHunk();
      this.updateCurrentRow();
      return this.updateDiffDetailsDisplay();
    };

    AtomGitDiffDetailsView.prototype.toggleShowDiffDetails = function() {
      this.showDiffDetails = !this.showDiffDetails;
      return this.updateDiffDetails();
    };

    AtomGitDiffDetailsView.prototype.closeDiffDetails = function() {
      this.showDiffDetails = false;
      return this.updateDiffDetails();
    };

    AtomGitDiffDetailsView.prototype.notifyChangeCursorPosition = function() {
      var currentRowChanged;
      if (this.showDiffDetails) {
        currentRowChanged = this.updateCurrentRow();
        if (currentRowChanged) {
          return this.updateDiffDetailsDisplay();
        }
      }
    };

    AtomGitDiffDetailsView.prototype.copy = function() {
      var selectedHunk;
      selectedHunk = this.diffDetailsDataManager.getSelectedHunk(this.currentRow).selectedHunk;
      if (selectedHunk != null) {
        atom.clipboard.write(selectedHunk.oldString);
        if (atom.config.get('git-diff-details.closeAfterCopy')) {
          return this.closeDiffDetails();
        }
      }
    };

    AtomGitDiffDetailsView.prototype.undo = function() {
      var buffer, selectedHunk;
      selectedHunk = this.diffDetailsDataManager.getSelectedHunk(this.currentRow).selectedHunk;
      if ((selectedHunk != null) && (buffer = this.editor.getBuffer())) {
        if (selectedHunk.kind === "m") {
          buffer.deleteRows(selectedHunk.start - 1, selectedHunk.end - 1);
          buffer.insert([selectedHunk.start - 1, 0], selectedHunk.oldString);
        } else {
          buffer.insert([selectedHunk.start, 0], selectedHunk.oldString);
        }
        if (!atom.config.get('git-diff-details.keepViewToggled')) {
          return this.closeDiffDetails();
        }
      }
    };

    AtomGitDiffDetailsView.prototype.destroyDecoration = function() {
      var _ref1;
      if ((_ref1 = this.marker) != null) {
        _ref1.destroy();
      }
      return this.marker = null;
    };

    AtomGitDiffDetailsView.prototype.attach = function(position) {
      var range;
      this.destroyDecoration();
      range = new Range(new Point(position - 1, 0), new Point(position - 1, 0));
      this.marker = this.editor.markBufferRange(range);
      return this.editor.decorateMarker(this.marker, {
        type: 'overlay',
        item: this
      });
    };

    AtomGitDiffDetailsView.prototype.populate = function(selectedHunk) {
      var html;
      html = this.highlighter.highlightSync({
        filePath: this.editor.getPath(),
        fileContents: selectedHunk.oldString
      });
      html = html.replace('<pre class="editor editor-colors">', '').replace('</pre>', '');
      return this.contents.html(html);
    };

    AtomGitDiffDetailsView.prototype.updateDiffDetailsDisplay = function() {
      var isDifferent, selectedHunk, _ref1;
      if (this.showDiffDetails) {
        _ref1 = this.diffDetailsDataManager.getSelectedHunk(this.currentRow), selectedHunk = _ref1.selectedHunk, isDifferent = _ref1.isDifferent;
        if (selectedHunk != null) {
          if (!isDifferent) {
            return;
          }
          this.attach(selectedHunk.end);
          this.populate(selectedHunk);
          return;
        } else {
          if (!atom.config.get('git-diff-details.keepViewToggled')) {
            this.closeDiffDetails();
          }
        }
        this.previousSelectedHunk = selectedHunk;
      }
      this.destroyDecoration();
    };

    return AtomGitDiffDetailsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9naXQtZGlmZi1kZXRhaWxzL2xpYi9naXQtZGlmZi1kZXRhaWxzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FEUixDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxnQkFBUixDQUh6QixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUixDQUpmLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiw2Q0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsc0JBQXpCLENBQUEsQ0FBQTs7QUFBQSxJQUVBLHNCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx3QkFBUDtPQUFMLEVBQXNDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sNkJBQVA7QUFBQSxZQUFzQyxNQUFBLEVBQVEsV0FBOUM7V0FBTCxFQUFnRSxTQUFBLEdBQUE7bUJBQzlELEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxRQUFQO0FBQUEsY0FBaUIsTUFB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

//# sourceURL=/Users/alholt/.atom/packages/git-diff-details/lib/git-diff-details-view.coffee
