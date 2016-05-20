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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGhvbHQvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1YnkvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRztBQUNiLFFBQU0sRUFBRTtBQUNOLHNCQUFrQixFQUFFO0FBQ2xCLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsTUFBTTtLQUNoQjtBQUNELHFCQUFpQixFQUFFO0FBQ2pCLFVBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO0FBQ3RCLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtHQUNGOztBQUVELFVBQVEsRUFBRSxvQkFBTTs7O0FBR2QsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDeEM7O0FBRUQsZUFBYSxFQUFFLHlCQUFNO0FBQ25CLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsUUFBTSxLQUFLLEdBQUcsNkJBQTZCLENBQUM7QUFDNUMsV0FBTztBQUNMLFVBQUksRUFBRSxNQUFNO0FBQ1osbUJBQWEsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQztBQUN4RSxXQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBSSxFQUFFLGNBQUMsWUFBWSxFQUFLO0FBQ3RCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNqRSxZQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEMsWUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZELGFBQUssSUFBSSxTQUFTLElBQUksT0FBTyxFQUFFO0FBQzdCLGNBQUksYUFBYSxLQUFLLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQztTQUM1Qzs7QUFFRCxlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN0RyxjQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQzVDLGdCQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLGdCQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7QUFDcEIscUJBQU87YUFDUjtBQUNELG9CQUFRLENBQUMsSUFBSSxDQUFDO0FBQ1osbUJBQUssRUFBRSxPQUFPLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO0FBQ25GLGtCQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNoQixrQkFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEIsc0JBQVEsRUFBRSxRQUFRO2FBQ25CLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztBQUNILGlCQUFPLFFBQVEsQ0FBQztTQUNqQixDQUFDLENBQUM7T0FDSjtLQUNGLENBQUM7R0FDSDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9hbGhvbHQvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1YnkvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHJ1YnlFeGVjdXRhYmxlUGF0aDoge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwicnVieVwiXG4gICAgfSxcbiAgICBpZ25vcmVkRXh0ZW5zaW9uczoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IFsnZXJiJywgJ21kJ10sXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZTogKCkgPT4ge1xuICAgIC8vIFdlIGFyZSBub3cgdXNpbmcgc3RlZWxicmFpbidzIHBhY2thZ2UgZGVwZW5kZW5jeSBwYWNrYWdlIHRvIGluc3RhbGwgb3VyXG4gICAgLy8gIGRlcGVuZGVuY2llcy5cbiAgICByZXF1aXJlKFwiYXRvbS1wYWNrYWdlLWRlcHNcIikuaW5zdGFsbCgpO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXI6ICgpID0+IHtcbiAgICBjb25zdCBoZWxwZXJzID0gcmVxdWlyZShcImF0b20tbGludGVyXCIpO1xuICAgIGNvbnN0IFBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcbiAgICBjb25zdCByZWdleCA9IC8uKzooXFxkKyk6XFxzKiguKz8pWyw6XVxccyguKykvO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIlJ1YnlcIixcbiAgICAgIGdyYW1tYXJTY29wZXM6IFtcInNvdXJjZS5ydWJ5XCIsIFwic291cmNlLnJ1YnkucmFpbHNcIiwgXCJzb3VyY2UucnVieS5yc3BlY1wiXSxcbiAgICAgIHNjb3BlOiBcImZpbGVcIixcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IChhY3RpdmVFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IGF0b20uY29uZmlnLmdldChcImxpbnRlci1ydWJ5LnJ1YnlFeGVjdXRhYmxlUGF0aFwiKTtcbiAgICAgICAgY29uc3QgaWdub3JlZCA9IGF0b20uY29uZmlnLmdldChcImxpbnRlci1ydWJ5Lmlnbm9yZWRFeHRlbnNpb25zXCIpO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGFjdGl2ZUVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBQYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnN1YnN0cigxKTtcblxuICAgICAgICBmb3IgKGxldCBleHRlbnNpb24gb2YgaWdub3JlZCkge1xuICAgICAgICAgIGlmIChmaWxlRXh0ZW5zaW9uID09PSBleHRlbnNpb24pIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZWxwZXJzLmV4ZWMoY29tbWFuZCwgWyctd2MnXSwge3N0ZGluOiBhY3RpdmVFZGl0b3IuZ2V0VGV4dCgpLCBzdHJlYW06ICdzdGRlcnInfSkudGhlbihvdXRwdXQgPT4ge1xuICAgICAgICAgIHZhciB0b1JldHVybiA9IFtdO1xuICAgICAgICAgIG91dHB1dC5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSByZWdleC5leGVjKGxpbmUpO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9SZXR1cm4ucHVzaCh7XG4gICAgICAgICAgICAgIHJhbmdlOiBoZWxwZXJzLnJhbmdlRnJvbUxpbmVOdW1iZXIoYWN0aXZlRWRpdG9yLCBOdW1iZXIucGFyc2VJbnQoKG1hdGNoZXNbMV0gLSAxKSkpLFxuICAgICAgICAgICAgICB0eXBlOiBtYXRjaGVzWzJdLFxuICAgICAgICAgICAgICB0ZXh0OiBtYXRjaGVzWzNdLFxuICAgICAgICAgICAgICBmaWxlUGF0aDogZmlsZVBhdGhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==
//# sourceURL=/Users/alholt/.atom/packages/linter-ruby/lib/main.js
