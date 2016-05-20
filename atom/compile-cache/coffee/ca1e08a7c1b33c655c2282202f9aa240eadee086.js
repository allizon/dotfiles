(function() {
  var DiffDetailsDataManager;

  module.exports = DiffDetailsDataManager = (function() {
    function DiffDetailsDataManager() {
      this.invalidate();
    }

    DiffDetailsDataManager.prototype.liesBetween = function(hunk, row) {
      return (hunk.start <= row && row <= hunk.end);
    };

    DiffDetailsDataManager.prototype.isDifferentHunk = function() {
      if ((this.previousSelectedHunk != null) && (this.previousSelectedHunk.start != null) && (this.selectedHunk != null) && (this.selectedHunk.start != null)) {
        return this.selectedHunk.start !== this.previousSelectedHunk.start;
      }
      return true;
    };

    DiffDetailsDataManager.prototype.getSelectedHunk = function(currentRow) {
      var isDifferent;
      if ((this.selectedHunk == null) || this.selectedHunkInvalidated || !this.liesBetween(this.selectedHunk, currentRow)) {
        this.updateLineDiffDetails();
        this.updateSelectedHunk(currentRow);
      }
      this.selectedHunkInvalidated = false;
      isDifferent = this.isDifferentHunk();
      this.previousSelectedHunk = this.selectedHunk;
      return {
        selectedHunk: this.selectedHunk,
        isDifferent: isDifferent
      };
    };

    DiffDetailsDataManager.prototype.updateSelectedHunk = function(currentRow) {
      var hunk, _i, _len, _ref, _results;
      this.selectedHunk = null;
      if (this.lineDiffDetails != null) {
        _ref = this.lineDiffDetails;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          hunk = _ref[_i];
          if (this.liesBetween(hunk, currentRow)) {
            this.selectedHunk = hunk;
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    DiffDetailsDataManager.prototype.updateLineDiffDetails = function() {
      if ((this.lineDiffDetails == null) || this.lineDiffDetailsInvalidated) {
        this.prepareLineDiffDetails(this.repo, this.path, this.text);
      }
      this.lineDiffDetailsInvalidated = false;
      return this.lineDiffDetails;
    };

    DiffDetailsDataManager.prototype.prepareLineDiffDetails = function(repo, path, text) {
      var hunk, kind, line, newEnd, newLineNumber, newLines, newStart, oldLineNumber, oldLines, oldStart, rawLineDiffDetails, _i, _len, _ref, _results;
      this.lineDiffDetails = null;
      repo = repo.getRepo(path);
      repo.getLineDiffDetails(repo.relativize(path), text);
      rawLineDiffDetails = repo.getLineDiffDetails(repo.relativize(path), text);
      if (rawLineDiffDetails == null) {
        return;
      }
      this.lineDiffDetails = [];
      hunk = null;
      _results = [];
      for (_i = 0, _len = rawLineDiffDetails.length; _i < _len; _i++) {
        _ref = rawLineDiffDetails[_i], oldStart = _ref.oldStart, newStart = _ref.newStart, oldLines = _ref.oldLines, newLines = _ref.newLines, oldLineNumber = _ref.oldLineNumber, newLineNumber = _ref.newLineNumber, line = _ref.line;
        if (!(oldLines === 0 && newLines > 0)) {
          if ((hunk == null) || (newStart !== hunk.start)) {
            newEnd = null;
            kind = null;
            if (newLines === 0 && oldLines > 0) {
              newEnd = newStart;
              kind = "d";
            } else {
              newEnd = newStart + newLines - 1;
              kind = "m";
            }
            hunk = {
              start: newStart,
              end: newEnd,
              oldLines: [],
              newLines: [],
              newString: "",
              oldString: "",
              kind: kind
            };
            this.lineDiffDetails.push(hunk);
          }
          if (newLineNumber >= 0) {
            hunk.newLines.push(line);
            _results.push(hunk.newString += line);
          } else {
            hunk.oldLines.push(line);
            _results.push(hunk.oldString += line);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    DiffDetailsDataManager.prototype.invalidate = function(repo, path, text) {
      this.repo = repo;
      this.path = path;
      this.text = text;
      this.selectedHunkInvalidated = true;
      this.lineDiffDetailsInvalidated = true;
      return this.invalidatePreviousSelectedHunk();
    };

    DiffDetailsDataManager.prototype.invalidatePreviousSelectedHunk = function() {
      return this.previousSelectedHunk = null;
    };

    return DiffDetailsDataManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9naXQtZGlmZi1kZXRhaWxzL2xpYi9kYXRhLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDUixJQUFBLGdDQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSxxQ0FHQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sR0FBUCxHQUFBO2FBQ1gsQ0FBQSxJQUFJLENBQUMsS0FBTCxJQUFjLEdBQWQsSUFBYyxHQUFkLElBQXFCLElBQUksQ0FBQyxHQUExQixFQURXO0lBQUEsQ0FIYixDQUFBOztBQUFBLHFDQU1BLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFHLG1DQUFBLElBQTJCLHlDQUEzQixJQUE0RCwyQkFBNUQsSUFBK0UsaUNBQWxGO0FBQ0UsZUFBTyxJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsS0FBdUIsSUFBQyxDQUFBLG9CQUFvQixDQUFDLEtBQXBELENBREY7T0FBQTtBQUVBLGFBQU8sSUFBUCxDQUhlO0lBQUEsQ0FOakIsQ0FBQTs7QUFBQSxxQ0FXQSxlQUFBLEdBQWlCLFNBQUMsVUFBRCxHQUFBO0FBQ2YsVUFBQSxXQUFBO0FBQUEsTUFBQSxJQUFJLDJCQUFELElBQW1CLElBQUMsQ0FBQSx1QkFBcEIsSUFBK0MsQ0FBQSxJQUFFLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFkLEVBQTRCLFVBQTVCLENBQW5EO0FBQ0UsUUFBQSxJQUFDLENBQUEscUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixVQUFwQixDQURBLENBREY7T0FBQTtB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

//# sourceURL=/Users/alholt/.atom/packages/git-diff-details/lib/data-manager.coffee
