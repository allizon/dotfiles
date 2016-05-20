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
              "class": "editor git-diff-editor",
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9naXQtZGlmZi1kZXRhaWxzL2xpYi9naXQtZGlmZi1kZXRhaWxzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FEUixDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxnQkFBUixDQUh6QixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUixDQUpmLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiw2Q0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsc0JBQXpCLENBQUEsQ0FBQTs7QUFBQSxJQUVBLHNCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx3QkFBUDtPQUFMLEVBQXNDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sNkJBQVA7QUFBQSxZQUFzQyxNQUFBLEVBQVEsV0FBOUM7V0FBTCxFQUFnRSxTQUFBLEdBQUE7bUJBQzlELEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyx3QkFBUDtBQUFBLGNBQWlDLE1B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

//# sourceURL=/Users/alholt/.atom/packages/git-diff-details/lib/git-diff-details-view.coffee
