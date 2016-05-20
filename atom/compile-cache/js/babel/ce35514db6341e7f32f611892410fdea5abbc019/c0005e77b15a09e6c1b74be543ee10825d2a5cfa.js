"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  config: {
    rubyExecutablePath: {
      type: "string",
      "default": "ruby"
    },
    ignoredExtensions: {
      type: 'array',
      "default": ['erb', 'md'],
      items: {
        type: 'string'
      }
    }
  },

  activate: function activate() {
    // We are now using steelbrain's package dependency package to install our
    //  dependencies.
    require("atom-package-deps").install();
  },

  provideLinter: function provideLinter() {
    var helpers = require("atom-linter");
    var Path = require("path");
    var regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/;
    return {
      name: "Ruby",
      grammarScopes: ["source.ruby", "source.ruby.rails", "source.ruby.rspec"],
      scope: "file",
      lintOnFly: true,
      lint: function lint(activeEditor) {
        var command = atom.config.get("linter-ruby.rubyExecutablePath");
        var ignored = atom.config.get("linter-ruby.ignoredExtensions");
        var filePath = activeEditor.getPath();
        var fileExtension = Path.extname(filePath).substr(1);

        for (var extension of ignored) {
          if (fileExtension === extension) return [];
        }

        return helpers.exec(command, ['-wc', '-Ku'], { stdin: activeEditor.getText(), stream: 'stderr' }).then(function (output) {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            var matches = regex.exec(line);
            if (matches === null) {
              return;
            }
            toReturn.push({
              range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(matches[1] - 1)),
              type: matches[2],
              text: matches[3],
              filePath: filePath
            });
          });
          return toReturn;
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGhvbHQvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1YnkvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRztBQUNiLFFBQU0sRUFBRTtBQUNOLHNCQUFrQixFQUFFO0FBQ2xCLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsTUFBTTtLQUNoQjtBQUNELHFCQUFpQixFQUFFO0FBQ2pCLFVBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO0FBQ3RCLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtHQUNGOztBQUVELFVBQVEsRUFBRSxvQkFBTTs7O0FBR2QsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDeEM7O0FBRUQsZUFBYSxFQUFFLHlCQUFNO0FBQ25CLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsUUFBTSxLQUFLLEdBQUcsNkJBQTZCLENBQUM7QUFDNUMsV0FBTztBQUNMLFVBQUksRUFBRSxNQUFNO0FBQ1osbUJBQWEsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQztBQUN4RSxXQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBSSxFQUFFLGNBQUMsWUFBWSxFQUFLO0FBQ3RCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNqRSxZQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEMsWUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZELGFBQUssSUFBSSxTQUFTLElBQUksT0FBTyxFQUFFO0FBQzdCLGNBQUksYUFBYSxLQUFLLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQztTQUM1Qzs7QUFFRCxlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDN0csY0FBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLGdCQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUM1QyxnQkFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxnQkFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO0FBQ3BCLHFCQUFPO2FBQ1I7QUFDRCxvQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLG1CQUFLLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztBQUNuRixrQkFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEIsa0JBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLHNCQUFRLEVBQUUsUUFBUTthQUNuQixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7QUFDSCxpQkFBTyxRQUFRLENBQUM7U0FDakIsQ0FBQyxDQUFDO09BQ0o7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWxob2x0Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJ5L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBydWJ5RXhlY3V0YWJsZVBhdGg6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcInJ1YnlcIlxuICAgIH0sXG4gICAgaWdub3JlZEV4dGVuc2lvbnM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiBbJ2VyYicsICdtZCddLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYWN0aXZhdGU6ICgpID0+IHtcbiAgICAvLyBXZSBhcmUgbm93IHVzaW5nIHN0ZWVsYnJhaW4ncyBwYWNrYWdlIGRlcGVuZGVuY3kgcGFja2FnZSB0byBpbnN0YWxsIG91clxuICAgIC8vICBkZXBlbmRlbmNpZXMuXG4gICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyOiAoKSA9PiB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoXCJhdG9tLWxpbnRlclwiKTtcbiAgICBjb25zdCBQYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG4gICAgY29uc3QgcmVnZXggPSAvLis6KFxcZCspOlxccyooLis/KVssOl1cXHMoLispLztcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJSdWJ5XCIsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXCJzb3VyY2UucnVieVwiLCBcInNvdXJjZS5ydWJ5LnJhaWxzXCIsIFwic291cmNlLnJ1YnkucnNwZWNcIl0sXG4gICAgICBzY29wZTogXCJmaWxlXCIsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoYWN0aXZlRWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItcnVieS5ydWJ5RXhlY3V0YWJsZVBhdGhcIik7XG4gICAgICAgIGNvbnN0IGlnbm9yZWQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItcnVieS5pZ25vcmVkRXh0ZW5zaW9uc1wiKTtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gUGF0aC5leHRuYW1lKGZpbGVQYXRoKS5zdWJzdHIoMSk7XG5cbiAgICAgICAgZm9yIChsZXQgZXh0ZW5zaW9uIG9mIGlnbm9yZWQpIHtcbiAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZXh0ZW5zaW9uKSByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGVscGVycy5leGVjKGNvbW1hbmQsIFsnLXdjJywgJy1LdSddLCB7c3RkaW46IGFjdGl2ZUVkaXRvci5nZXRUZXh0KCksIHN0cmVhbTogJ3N0ZGVycid9KS50aGVuKG91dHB1dCA9PiB7XG4gICAgICAgICAgdmFyIHRvUmV0dXJuID0gW107XG4gICAgICAgICAgb3V0cHV0LnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHJlZ2V4LmV4ZWMobGluZSk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b1JldHVybi5wdXNoKHtcbiAgICAgICAgICAgICAgcmFuZ2U6IGhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcihhY3RpdmVFZGl0b3IsIE51bWJlci5wYXJzZUludCgobWF0Y2hlc1sxXSAtIDEpKSksXG4gICAgICAgICAgICAgIHR5cGU6IG1hdGNoZXNbMl0sXG4gICAgICAgICAgICAgIHRleHQ6IG1hdGNoZXNbM10sXG4gICAgICAgICAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19
//# sourceURL=/Users/alholt/.atom/packages/linter-ruby/lib/main.js
