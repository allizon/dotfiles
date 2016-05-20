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
    require("atom-package-deps").install("linter-ruby");
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

        return helpers.exec(command, ['-wc'], { stdin: activeEditor.getText(), stream: 'stderr' }).then(function (output) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGhvbHQvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1YnkvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRztBQUNiLFFBQU0sRUFBRTtBQUNOLHNCQUFrQixFQUFFO0FBQ2xCLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsTUFBTTtLQUNoQjtBQUNELHFCQUFpQixFQUFFO0FBQ2pCLFVBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO0FBQ3RCLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtHQUNGOztBQUVELFVBQVEsRUFBRSxvQkFBTTs7O0FBR2QsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0dBQ3JEOztBQUVELGVBQWEsRUFBRSx5QkFBTTtBQUNuQixRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdkMsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFFBQU0sS0FBSyxHQUFHLDZCQUE2QixDQUFDO0FBQzVDLFdBQU87QUFDTCxVQUFJLEVBQUUsTUFBTTtBQUNaLG1CQUFhLEVBQUUsQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUM7QUFDeEUsV0FBSyxFQUFFLE1BQU07QUFDYixlQUFTLEVBQUUsSUFBSTtBQUNmLFVBQUksRUFBRSxjQUFDLFlBQVksRUFBSztBQUN0QixZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2xFLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDakUsWUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3hDLFlBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV2RCxhQUFLLElBQUksU0FBUyxJQUFJLE9BQU8sRUFBRTtBQUM3QixjQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUM7U0FDNUM7O0FBRUQsZUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDdEcsY0FBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLGdCQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUM1QyxnQkFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxnQkFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO0FBQ3BCLHFCQUFPO2FBQ1I7QUFDRCxvQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLG1CQUFLLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztBQUNuRixrQkFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEIsa0JBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLHNCQUFRLEVBQUUsUUFBUTthQUNuQixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7QUFDSCxpQkFBTyxRQUFRLENBQUM7U0FDakIsQ0FBQyxDQUFDO09BQ0o7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWxob2x0Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJ5L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBydWJ5RXhlY3V0YWJsZVBhdGg6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcInJ1YnlcIlxuICAgIH0sXG4gICAgaWdub3JlZEV4dGVuc2lvbnM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiBbJ2VyYicsICdtZCddLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYWN0aXZhdGU6ICgpID0+IHtcbiAgICAvLyBXZSBhcmUgbm93IHVzaW5nIHN0ZWVsYnJhaW4ncyBwYWNrYWdlIGRlcGVuZGVuY3kgcGFja2FnZSB0byBpbnN0YWxsIG91clxuICAgIC8vICBkZXBlbmRlbmNpZXMuXG4gICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoXCJsaW50ZXItcnVieVwiKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyOiAoKSA9PiB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoXCJhdG9tLWxpbnRlclwiKTtcbiAgICBjb25zdCBQYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG4gICAgY29uc3QgcmVnZXggPSAvLis6KFxcZCspOlxccyooLis/KVssOl1cXHMoLispLztcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJSdWJ5XCIsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXCJzb3VyY2UucnVieVwiLCBcInNvdXJjZS5ydWJ5LnJhaWxzXCIsIFwic291cmNlLnJ1YnkucnNwZWNcIl0sXG4gICAgICBzY29wZTogXCJmaWxlXCIsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoYWN0aXZlRWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItcnVieS5ydWJ5RXhlY3V0YWJsZVBhdGhcIik7XG4gICAgICAgIGNvbnN0IGlnbm9yZWQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItcnVieS5pZ25vcmVkRXh0ZW5zaW9uc1wiKTtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gUGF0aC5leHRuYW1lKGZpbGVQYXRoKS5zdWJzdHIoMSk7XG5cbiAgICAgICAgZm9yIChsZXQgZXh0ZW5zaW9uIG9mIGlnbm9yZWQpIHtcbiAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZXh0ZW5zaW9uKSByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGVscGVycy5leGVjKGNvbW1hbmQsIFsnLXdjJ10sIHtzdGRpbjogYWN0aXZlRWRpdG9yLmdldFRleHQoKSwgc3RyZWFtOiAnc3RkZXJyJ30pLnRoZW4ob3V0cHV0ID0+IHtcbiAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBbXTtcbiAgICAgICAgICBvdXRwdXQuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGVzID0gcmVnZXguZXhlYyhsaW5lKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvUmV0dXJuLnB1c2goe1xuICAgICAgICAgICAgICByYW5nZTogaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKGFjdGl2ZUVkaXRvciwgTnVtYmVyLnBhcnNlSW50KChtYXRjaGVzWzFdIC0gMSkpKSxcbiAgICAgICAgICAgICAgdHlwZTogbWF0Y2hlc1syXSxcbiAgICAgICAgICAgICAgdGV4dDogbWF0Y2hlc1szXSxcbiAgICAgICAgICAgICAgZmlsZVBhdGg6IGZpbGVQYXRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/alholt/.atom/packages/linter-ruby/lib/main.js
