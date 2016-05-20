(function() {
  var CommandContext, grammarMap;

  grammarMap = require('./grammars');

  module.exports = CommandContext = (function() {
    function CommandContext() {}

    CommandContext.prototype.command = null;

    CommandContext.prototype.args = [];

    CommandContext.prototype.options = {};

    CommandContext.build = function(runtime, runOptions, codeContext) {
      var buildArgsArray, commandContext, error, errorSendByArgs;
      commandContext = new CommandContext;
      commandContext.options = runOptions;
      try {
        if ((runOptions.cmd == null) || runOptions.cmd === '') {
          commandContext.command = codeContext.shebangCommand() || grammarMap[codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = runOptions.cmd;
        }
        buildArgsArray = grammarMap[codeContext.lang][codeContext.argType].args;
      } catch (_error) {
        error = _error;
        runtime.modeNotSupported(codeContext.argType, codeContext.lang);
        return false;
      }
      try {
        commandContext.args = buildArgsArray(codeContext);
      } catch (_error) {
        errorSendByArgs = _error;
        runtime.didNotBuildArgs(errorSendByArgs);
        return false;
      }
      return commandContext;
    };

    CommandContext.prototype.quoteArguments = function(args) {
      var arg, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        _results.push(arg.trim().indexOf(' ') === -1 ? arg.trim() : "'" + arg + "'");
      }
      return _results;
    };

    CommandContext.prototype.getRepresentation = function() {
      var args, commandArgs, scriptArgs;
      if (!this.command || !this.args.length) {
        return '';
      }
      commandArgs = this.options.cmdArgs != null ? this.quoteArguments(this.options.cmdArgs).join(' ') : '';
      args = this.args.length ? this.quoteArguments(this.args).join(' ') : '';
      scriptArgs = this.options.scriptArgs != null ? this.quoteArguments(this.options.scriptArgs).join(' ') : '';
      return this.command.trim() + (commandArgs ? ' ' + commandArgs : '') + (args ? ' ' + args : '') + (scriptArgs ? ' ' + scriptArgs : '');
    };

    return CommandContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2NvbW1hbmQtY29udGV4dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEJBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtnQ0FDSjs7QUFBQSw2QkFBQSxPQUFBLEdBQVMsSUFBVCxDQUFBOztBQUFBLDZCQUNBLElBQUEsR0FBTSxFQUROLENBQUE7O0FBQUEsNkJBRUEsT0FBQSxHQUFTLEVBRlQsQ0FBQTs7QUFBQSxJQUlBLGNBQUMsQ0FBQSxLQUFELEdBQVEsU0FBQyxPQUFELEVBQVUsVUFBVixFQUFzQixXQUF0QixHQUFBO0FBQ04sVUFBQSxzREFBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixHQUFBLENBQUEsY0FBakIsQ0FBQTtBQUFBLE1BQ0EsY0FBYyxDQUFDLE9BQWYsR0FBeUIsVUFEekIsQ0FBQTtBQUdBO0FBQ0UsUUFBQSxJQUFPLHdCQUFKLElBQXVCLFVBQVUsQ0FBQyxHQUFYLEtBQWtCLEVBQTVDO0FBRUUsVUFBQSxjQUFjLENBQUMsT0FBZixHQUF5QixXQUFXLENBQUMsY0FBWixDQUFBLENBQUEsSUFBZ0MsVUFBVyxDQUFBLFdBQVcsQ0FBQyxJQUFaLENBQWtCLENBQUEsV0FBVyxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxPQUEzRyxDQUZGO1NBQUEsTUFBQTtBQUlFLFVBQUEsY0FBYyxDQUFDLE9BQWYsR0FBeUIsVUFBVSxDQUFDLEdBQXBDLENBSkY7U0FBQTtBQUFBLFFBTUEsY0FBQSxHQUFpQixVQUFXLENBQUEsV0FBVyxDQUFDLElBQVosQ0FBa0IsQ0FBQSxXQUFXLENBQUMsT0FBWixDQUFvQixDQUFDLElBTm5FLENBREY7T0FBQSxjQUFBO0FBVUUsUUFESSxjQUNKLENBQUE7QUFBQSxRQUFBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixXQUFXLENBQUMsT0FBckMsRUFBOEMsV0FBVyxDQUFDLElBQTFELENBQUEsQ0FBQTtBQUNBLGVBQU8sS0FBUCxDQVhGO09BSEE7QUFnQkE7QUFDRSxRQUFBLGNBQWMsQ0FBQyxJQUFmLEdBQXNCLGNBQUEsQ0FBZSxXQUFmLENBQXRCLENBREY7T0FBQSxjQUFBO0FBR0UsUUFESSx3QkFDSixDQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsZUFBUixDQUF3QixlQUF4QixDQUFBLENBQUE7QUFDQSxlQUFPLEtBQVAsQ0FKRjtPQWhCQTthQXVCQSxlQXhCTTtJQUFBLENBSlIsQ0FBQTs7QUFBQSw2QkE4QkEsY0FBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLFVBQUEsdUJBQUE7QUFBQztXQUFBLDJDQUFBO3VCQUFBO0FBQUEsc0JBQUksR0FBRyxDQUFDLElBQUosQ0FBQSxDQUFVLENBQUMsT0FBWCxDQUFtQixHQUFuQixDQUFBLEtBQTJCLENBQUEsQ0FBOUIsR0FBc0MsR0FBRyxDQUFDLElBQUosQ0FBQSxDQUF0QyxHQUF1RCxHQUFBLEdBQUcsR0FBSCxHQUFPLElBQS9ELENBQUE7QUFBQTtzQkFEYTtJQUFBLENBOUJoQixDQUFBOztBQUFBLDZCQWlDQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSw2QkFBQTtBQUFBLE1BQUEsSUFBYSxDQUFBLElBQUUsQ0FBQSxPQUFGLElBQWEsQ0FBQSxJQUFFLENBQUEsSUFBSSxDQUFDLE1BQWpDO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FBQTtBQUFBLE1BR0EsV0FBQSxHQUFpQiw0QkFBSCxHQUEwQixJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsT0FBTyxDQUFDLE9BQXpCLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsR0FBdkMsQ0FBMUIsR0FBMEUsRUFIeEYsQ0FBQTtBQUFBLE1BTUEsSUFBQSxHQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBVCxHQUFxQixJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsSUFBakIsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixHQUE1QixDQUFyQixHQUEwRCxFQU5qRSxDQUFBO0FBQUEsTUFPQSxVQUFBLEdBQWdCLCtCQUFILEdBQTZCLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBekIsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxHQUExQyxDQUE3QixHQUFnRixFQVA3RixDQUFBO2FBU0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQUEsQ0FBQSxHQUNFLENBQUksV0FBSCxHQUFvQixHQUFBLEdBQU0sV0FBMUIsR0FBMkMsRUFBNUMsQ0FERixHQUVFLENBQUksSUFBSCxHQUFhLEdBQUEsR0FBTSxJQUFuQixHQUE2QixFQUE5QixDQUZGLEdBR0UsQ0FBSSxVQUFILEdBQW1CLEdBQUEsR0FBTSxVQUF6QixHQUF5QyxFQUExQyxFQWJlO0lBQUEsQ0FqQ25CLENBQUE7OzBCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/alholt/.atom/packages/script/lib/command-context.coffee
