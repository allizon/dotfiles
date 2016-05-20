(function() {
  var BufferedNodeProcess, BufferedProcess, Helpers, XRegExp, fs, path, tmp, xcache, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, BufferedNodeProcess = _ref.BufferedNodeProcess;

  path = require('path');

  fs = require('fs');

  path = require('path');

  tmp = require('tmp');

  xcache = new Map;

  XRegExp = null;

  module.exports = Helpers = {
    exec: function(command, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(command, args, options, false);
    },
    execNode: function(filePath, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(filePath, args, options, true);
    },
    _exec: function(command, args, options, isNodeExecutable) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (isNodeExecutable == null) {
        isNodeExecutable = false;
      }
      if (options.stream == null) {
        options.stream = 'stdout';
      }
      if (options.throwOnStdErr == null) {
        options.throwOnStdErr = true;
      }
      return new Promise(function(resolve, reject) {
        var data, exit, prop, spawnedProcess, stderr, stdout, value, _ref1;
        data = {
          stdout: [],
          stderr: []
        };
        stdout = function(output) {
          return data.stdout.push(output.toString());
        };
        stderr = function(output) {
          return data.stderr.push(output.toString());
        };
        exit = function() {
          if (options.stream === 'stdout') {
            if (data.stderr.length && options.throwOnStdErr) {
              return reject(new Error(data.stderr.join('')));
            } else {
              return resolve(data.stdout.join(''));
            }
          } else if (options.stream === 'both') {
            return resolve({
              stdout: data.stdout.join(''),
              stderr: data.stderr.join('')
            });
          } else {
            return resolve(data.stderr.join(''));
          }
        };
        if (isNodeExecutable) {
          if (options.env == null) {
            options.env = {};
          }
          _ref1 = process.env;
          for (prop in _ref1) {
            value = _ref1[prop];
            if (prop !== 'OS') {
              options.env[prop] = value;
            }
          }
          spawnedProcess = new BufferedNodeProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        } else {
          spawnedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        }
        spawnedProcess.onWillThrowError((function(_this) {
          return function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            if (error && error.code === 'ENOENT') {
              return reject(error);
            }
            handle();
            if (error.code === 'EACCES') {
              error = new Error("Failed to spawn command `" + command + "`. Make sure it's a file, not a directory and it's executable.");
              error.name = 'BufferedProcessError';
            }
            return reject(error);
          };
        })(this));
        if (options.stdin) {
          spawnedProcess.process.stdin.write(options.stdin.toString());
          return spawnedProcess.process.stdin.end();
        }
      });
    },
    rangeFromLineNumber: function(textEditor, lineNumber, colStart) {
      var colEnd;
      if ((textEditor != null ? textEditor.getText : void 0) == null) {
        throw new Error('Provided text editor is invalid');
      }
      if (typeof lineNumber === 'undefined') {
        throw new Error('Invalid lineNumber provided');
      }
      if (typeof colStart !== 'number') {
        colStart = textEditor.indentationForBufferRow(lineNumber) * textEditor.getTabLength();
        if (colStart !== 0) {
          colStart -= 1;
        }
      }
      colEnd = textEditor.getBuffer().lineLengthForRow(lineNumber);
      if (colEnd !== 0) {
        colEnd -= 1;
      }
      return [[lineNumber, colStart], [lineNumber, colEnd]];
    },
    parse: function(data, rawRegex, options) {
      var colEnd, colStart, filePath, line, lineEnd, lineStart, match, regex, toReturn, _i, _len, _ref1;
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to parse");
      }
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      if (options.baseReduction == null) {
        options.baseReduction = 1;
      }
      if (options.flags == null) {
        options.flags = "";
      }
      toReturn = [];
      if (xcache.has(rawRegex)) {
        regex = xcache.get(rawRegex);
      } else {
        xcache.set(rawRegex, regex = XRegExp(rawRegex, options.flags));
      }
      if (typeof data !== 'string') {
        throw new Error("Input must be a string");
      }
      _ref1 = data.split(/\r?\n/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        match = XRegExp.exec(line, regex);
        if (match) {
          if (!options.baseReduction) {
            options.baseReduction = 1;
          }
          lineStart = 0;
          if (match.line) {
            lineStart = match.line - options.baseReduction;
          }
          if (match.lineStart) {
            lineStart = match.lineStart - options.baseReduction;
          }
          colStart = 0;
          if (match.col) {
            colStart = match.col - options.baseReduction;
          }
          if (match.colStart) {
            colStart = match.colStart - options.baseReduction;
          }
          lineEnd = 0;
          if (match.line) {
            lineEnd = match.line - options.baseReduction;
          }
          if (match.lineEnd) {
            lineEnd = match.lineEnd - options.baseReduction;
          }
          colEnd = 0;
          if (match.col) {
            colEnd = match.col - options.baseReduction;
          }
          if (match.colEnd) {
            colEnd = match.colEnd - options.baseReduction;
          }
          filePath = match.file;
          if (options.filePath) {
            filePath = options.filePath;
          }
          toReturn.push({
            type: match.type,
            text: match.message,
            filePath: filePath,
            range: [[lineStart, colStart], [lineEnd, colEnd]]
          });
        }
      }
      return toReturn;
    },
    findFile: function(startDir, names) {
      var currentDir, filePath, name, _i, _len;
      if (!arguments.length) {
        throw new Error("Specify a filename to find");
      }
      if (!(names instanceof Array)) {
        names = [names];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length && startDir.join(path.sep)) {
        currentDir = startDir.join(path.sep);
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          filePath = path.join(currentDir, name);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (_error) {}
        }
        startDir.pop();
      }
      return null;
    },
    tempFile: function(fileName, fileContents, callback) {
      if (typeof fileName !== 'string') {
        throw new Error('Invalid fileName provided');
      }
      if (typeof fileContents !== 'string') {
        throw new Error('Invalid fileContent provided');
      }
      if (typeof callback !== 'function') {
        throw new Error('Invalid Callback provided');
      }
      return new Promise(function(resolve, reject) {
        return tmp.dir({
          prefix: 'atom-linter_'
        }, function(err, dirPath, cleanupCallback) {
          var filePath;
          if (err) {
            return reject(err);
          }
          filePath = path.join(dirPath, fileName);
          return fs.writeFile(filePath, fileContents, function(err) {
            if (err) {
              cleanupCallback();
              return reject(err);
            }
            return (new Promise(function(resolve) {
              return resolve(callback(filePath));
            })).then(function(result) {
              fs.unlink(filePath, function() {
                return fs.rmdir(dirPath);
              });
              return result;
            }).then(resolve, reject);
          });
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9ub2RlX21vZHVsZXMvYXRvbS1saW50ZXIvbGliL2hlbHBlcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1GQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyx1QkFBQSxlQUFELEVBQWtCLDJCQUFBLG1CQUFsQixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBSk4sQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxHQUFBLENBQUEsR0FOVCxDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLElBUFYsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FJZjtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsT0FBRCxFQUFVLElBQVYsRUFBcUIsT0FBckIsR0FBQTs7UUFBVSxPQUFPO09BQ3JCOztRQUR5QixVQUFVO09BQ25DO0FBQUEsTUFBQSxJQUFBLENBQUEsU0FBc0QsQ0FBQyxNQUF2RDtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0scUJBQU4sQ0FBVixDQUFBO09BQUE7QUFDQSxhQUFPLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBUCxFQUFnQixJQUFoQixFQUFzQixPQUF0QixFQUErQixLQUEvQixDQUFQLENBRkk7SUFBQSxDQUFOO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQyxRQUFELEVBQVcsSUFBWCxFQUFz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

//# sourceURL=/Users/alholt/.atom/packages/linter-ruby/node_modules/atom-linter/lib/helpers.coffee
