(function() {
  var GrammarUtils, _, _base, _ref, _ref1, _ref2;

  _ = require('underscore');

  GrammarUtils = require('../lib/grammar-utils');

  module.exports = {
    '1C (BSL)': {
      'File Based': {
        command: "oscript",
        args: function(context) {
          return ['-encoding=utf-8', context.filepath];
        }
      }
    },
    AppleScript: {
      'Selection Based': {
        command: 'osascript',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'osascript',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Behat Feature': {
      "File Based": {
        command: "behat",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Line Number Based": {
        command: "behat",
        args: function(context) {
          return [context.fileColonLine()];
        }
      }
    },
    Batch: {
      "File Based": {
        command: "",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    C: GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h '" + context.filepath + "' -o /tmp/c.out && /tmp/c.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isLinux() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "cc -Wall -include stdio.h '" + context.filepath + "' -o /tmp/c.out && /tmp/c.out"];
        }
      }
    } : void 0,
    'C++': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -Wc++11-extensions -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : void 0,
    'C# Script File': {
      "File Based": {
        command: "scriptcs",
        args: function(context) {
          return ['-script', context.filepath];
        }
      }
    },
    Clojure: {
      "Selection Based": {
        command: "lein",
        args: function(context) {
          return ['exec', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lein",
        args: function(context) {
          return ['exec', context.filepath];
        }
      }
    },
    CoffeeScript: {
      "Selection Based": {
        command: "coffee",
        args: function(context) {
          return GrammarUtils.CScompiler.args.concat([context.getCode()]);
        }
      },
      "File Based": {
        command: "coffee",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "CoffeeScript (Literate)": {
      'Selection Based': {
        command: 'coffee',
        args: function(context) {
          return GrammarUtils.CScompiler.args.concat([context.getCode()]);
        }
      },
      'File Based': {
        command: 'coffee',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Crystal: {
      "Selection Based": {
        command: "crystal",
        args: function(context) {
          return ['eval', context.getCode()];
        }
      },
      "File Based": {
        command: "crystal",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    D: {
      "File Based": {
        command: "rdmd",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    DOT: {
      "File Based": {
        command: "dot",
        args: function(context) {
          return ['-Tpng', context.filepath, '-o', context.filepath + '.png'];
        }
      }
    },
    Elixir: {
      "Selection Based": {
        command: "elixir",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "elixir",
        args: function(context) {
          return ['-r', context.filepath];
        }
      }
    },
    Erlang: {
      "Selection Based": {
        command: "erl",
        args: function(context) {
          return ['-noshell', '-eval', "" + (context.getCode()) + ", init:stop()."];
        }
      }
    },
    'F#': {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "fsi" : "fsharpi",
        args: function(context) {
          return ['--exec', context.filepath];
        }
      }
    },
    Forth: {
      "File Based": {
        command: "gforth",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Gherkin: {
      "File Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.filepath];
        }
      },
      "Line Number Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.fileColonLine()];
        }
      }
    },
    gnuplot: {
      "File Based": {
        command: "gnuplot",
        args: function(context) {
          return ['-p', context.filepath];
        },
        workingDirectory: (_ref = atom.workspace.getActivePaneItem()) != null ? (_ref1 = _ref.buffer) != null ? (_ref2 = _ref1.file) != null ? typeof _ref2.getParent === "function" ? typeof (_base = _ref2.getParent()).getPath === "function" ? _base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0
      }
    },
    Go: {
      "File Based": {
        command: "go",
        args: function(context) {
          return ['run', context.filepath];
        }
      }
    },
    Groovy: {
      "Selection Based": {
        command: "groovy",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "groovy",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Haskell: {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "ghc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      }
    },
    IcedCoffeeScript: {
      "Selection Based": {
        command: "iced",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "iced",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    ioLanguage: {
      "Selection Based": {
        command: "io",
        args: function(context) {
          return [context.getCode()];
        }
      },
      "File Based": {
        command: "io",
        args: function(context) {
          return ['-e', context.filepath];
        }
      }
    },
    Java: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, className;
          className = context.filename.replace(/\.java$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c javac -Xlint " + context.filename + " && start cmd /k java " + className];
          } else {
            args = ['-c', "javac -d /tmp '" + context.filepath + "' && java -cp /tmp " + className];
          }
          return args;
        }
      }
    },
    JavaScript: {
      "Selection Based": {
        command: "node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Babel ES6 JavaScript': {
      "Selection Based": {
        command: "babel-node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "babel-node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "JavaScript for Automation (JXA)": {
      "Selection Based": {
        command: "osascript",
        args: function(context) {
          return ['-l', 'JavaScript', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "osascript",
        args: function(context) {
          return ['-l', 'JavaScript', context.filepath];
        }
      }
    },
    Julia: {
      "Selection Based": {
        command: "julia",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "julia",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Kotlin: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, jarName, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".kt");
          jarName = tmpFile.replace(/\.kt$/, ".jar");
          args = ['-c', "kotlinc " + tmpFile + " -include-runtime -d " + jarName + " && java -jar " + jarName];
          return args;
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          var args, jarName;
          jarName = context.filename.replace(/\.kt$/, ".jar");
          args = ['-c', "kotlinc " + context.filepath + " -include-runtime -d /tmp/" + jarName + " && java -jar /tmp/" + jarName];
          return args;
        }
      }
    },
    LaTeX: {
      "File Based": {
        command: "latexmk",
        args: function(context) {
          return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', context.filepath];
        }
      }
    },
    'LaTeX Beamer': {
      "File Based": {
        command: "latexmk",
        args: function(context) {
          return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', context.filepath];
        }
      }
    },
    LilyPond: {
      "File Based": {
        command: "lilypond",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lisp: {
      "Selection Based": {
        command: "sbcl",
        args: function(context) {
          var args, statements;
          statements = _.flatten(_.map(GrammarUtils.Lisp.splitStatements(context.getCode()), function(statement) {
            return ['--eval', statement];
          }));
          args = _.union(['--noinform', '--disable-debugger', '--non-interactive', '--quit'], statements);
          return args;
        }
      },
      "File Based": {
        command: "sbcl",
        args: function(context) {
          return ['--noinform', '--script', context.filepath];
        }
      }
    },
    'Literate Haskell': {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    LiveScript: {
      "Selection Based": {
        command: "lsc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lsc",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lua: {
      "Selection Based": {
        command: "lua",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "lua",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    MagicPython: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-u', '-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return ['-u', context.filepath];
        }
      }
    },
    MoonScript: {
      "Selection Based": {
        command: "moon",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "moon",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'mongoDB (JavaScript)': {
      "Selection Based": {
        command: "mongo",
        args: function(context) {
          return ['--eval', context.getCode()];
        }
      },
      "File Based": {
        command: "mongo",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    NCL: {
      "Selection Based": {
        command: "ncl",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          code = code + "\nexit";
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "ncl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    newLISP: {
      "Selection Based": {
        command: "newlisp",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "newlisp",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    NSIS: {
      "Selection Based": {
        command: "makensis",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "makensis",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Objective-C': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h -framework Cocoa " + context.filepath + " -o /tmp/objc-c.out && /tmp/objc-c.out"];
        }
      }
    } : void 0,
    'Objective-C++': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -Wc++11-extensions -Wall -include stdio.h -include iostream -framework Cocoa " + context.filepath + " -o /tmp/objc-cpp.out && /tmp/objc-cpp.out"];
        }
      }
    } : void 0,
    ocaml: {
      "File Based": {
        command: "ocaml",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Pandoc Markdown': {
      "File Based": {
        command: "panzer",
        args: function(context) {
          return [context.filepath, "--output=" + context.filepath + ".pdf"];
        }
      }
    },
    PHP: {
      "Selection Based": {
        command: "php",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.PHP.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "php",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Perl: {
      "Selection Based": {
        command: "perl",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.Perl.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "perl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Perl 6": {
      "Selection Based": {
        command: "perl6",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl6",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Perl 6 FE": {
      "Selection Based": {
        command: "perl6",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl6",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PowerShell: {
      "File Based": {
        command: "powershell",
        args: function(context) {
          return [context.filepath.replace(/\ /g, "` ")];
        }
      }
    },
    Python: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-u', '-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return ['-u', context.filepath];
        }
      }
    },
    R: {
      "Selection Based": {
        command: "Rscript",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.R.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "Rscript",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Racket: {
      "Selection Based": {
        command: "racket",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "racket",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    RANT: {
      "Selection Based": {
        command: "RantConsole.exe",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-file', tmpFile];
        }
      },
      "File Based": {
        command: "RantConsole.exe",
        args: function(context) {
          return ['-file', context.filepath];
        }
      }
    },
    RSpec: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.filepath];
        }
      },
      "Line Number Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.fileColonLine()];
        }
      }
    },
    Ruby: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "ruby",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Ruby on Rails': {
      "Selection Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.getCode()];
        }
      },
      "File Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.filepath];
        }
      }
    },
    Rust: {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "rustc '" + context.filepath + "' -o /tmp/rs.out && /tmp/rs.out"];
        }
      }
    },
    Makefile: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "make",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    Sage: {
      "Selection Based": {
        command: "sage",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "sage",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Sass: {
      "File Based": {
        command: "sass",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scala: {
      "Selection Based": {
        command: "scala",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "scala",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scheme: {
      "Selection Based": {
        command: "guile",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "guile",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    SCSS: {
      "File Based": {
        command: "sass",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Shell Script": {
      "Selection Based": {
        command: process.env.SHELL,
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: process.env.SHELL,
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Shell Script (Fish)": {
      "Selection Based": {
        command: "fish",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "fish",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "SQL (PostgreSQL)": {
      "Selection Based": {
        command: "psql",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "psql",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    "Standard ML": {
      "File Based": {
        command: "sml",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Nim: {
      "File Based": {
        command: "bash",
        args: function(context) {
          var file, path;
          file = GrammarUtils.Nim.findNimProjectFile(context.filepath);
          path = GrammarUtils.Nim.projectDir(context.filepath);
          return ['-c', 'cd "' + path + '" && nim c --hints:off --parallelBuild:1 -r "' + file + '" 2>&1'];
        }
      }
    },
    Swift: {
      "File Based": {
        command: "swift",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    TypeScript: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, jsFile, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".ts");
          jsFile = tmpFile.replace(/\.ts$/, ".js");
          args = ['-c', "tsc --out '" + jsFile + "' '" + tmpFile + "' && node '" + jsFile + "'"];
          return args;
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "tsc '" + context.filepath + "' --out /tmp/js.out && node /tmp/js.out"];
        }
      }
    },
    Dart: {
      "File Based": {
        command: "dart",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Octave: {
      "Selection Based": {
        command: "octave",
        args: function(context) {
          return ['-p', context.filepath.replace(/[^\/]*$/, ''), '--eval', context.getCode()];
        }
      },
      "File Based": {
        command: "octave",
        args: function(context) {
          return ['-p', context.filepath.replace(/[^\/]*$/, ''), context.filepath];
        }
      }
    },
    Prolog: {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', 'cd \"' + context.filepath.replace(/[^\/]*$/, '') + '\"; swipl -f \"' + context.filepath + '\" -t main --quiet'];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBQUEsTUFBQSwwQ0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsU0FBVDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRCxHQUFBO2lCQUFhLENBQUMsaUJBQUQsRUFBb0IsT0FBTyxDQUFDLFFBQTVCLEVBQWI7UUFBQSxDQUROO09BREY7S0FERjtBQUFBLElBS0EsV0FBQSxFQUNFO0FBQUEsTUFBQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsV0FBVDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRCxHQUFBO2lCQUFjLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUCxFQUFkO1FBQUEsQ0FETjtPQURGO0FBQUEsTUFHQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBUyxXQUFUO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFELEdBQUE7aUJBQWEsQ0FBQyxPQUFPLENBQUMsUUFBVCxFQUFiO1FBQUEsQ0FETjtPQUpGO0tBTkY7QUFBQSxJQWFBLGVBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsT0FBVDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRCxHQUFBO2lCQUFhLENBQUMsT0FBTyxDQUFDLFFBQVQsRUFB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

//# sourceURL=/Users/alholt/.atom/packages/script/lib/grammars.coffee
