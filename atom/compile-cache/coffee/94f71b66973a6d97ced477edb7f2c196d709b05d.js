(function() {
  var CommandContext, Emitter, Runtime, _;

  CommandContext = require('./command-context');

  _ = require('underscore');

  Emitter = require('atom').Emitter;

  module.exports = Runtime = (function() {
    Runtime.prototype.observers = [];

    function Runtime(runner, codeContextBuilder, observers, emitter) {
      this.runner = runner;
      this.codeContextBuilder = codeContextBuilder;
      this.observers = observers != null ? observers : [];
      this.emitter = emitter != null ? emitter : new Emitter;
      this.scriptOptions = this.runner.scriptOptions;
      _.each(this.observers, (function(_this) {
        return function(observer) {
          return observer.observe(_this);
        };
      })(this));
    }

    Runtime.prototype.addObserver = function(observer) {
      this.observers.push(observer);
      return observer.observe(this);
    };

    Runtime.prototype.destroy = function() {
      this.stop();
      this.runner.destroy();
      _.each(this.observers, function(observer) {
        return observer.destroy();
      });
      this.emitter.dispose();
      return this.codeContextBuilder.destroy();
    };

    Runtime.prototype.execute = function(argType, input, options) {
      var codeContext, commandContext, executionOptions;
      if (argType == null) {
        argType = "Selection Based";
      }
      if (input == null) {
        input = null;
      }
      if (options == null) {
        options = null;
      }
      if (atom.config.get('script.stopOnRerun')) {
        this.stop();
      }
      this.emitter.emit('start');
      codeContext = this.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), argType);
      if (codeContext.lang == null) {
        return;
      }
      executionOptions = options ? options : this.scriptOptions;
      commandContext = CommandContext.build(this, executionOptions, codeContext);
      if (!commandContext) {
        return;
      }
      this.emitter.emit('did-context-create', {
        lang: codeContext.lang,
        filename: codeContext.filename,
        lineNumber: codeContext.lineNumber
      });
      this.runner.scriptOptions = executionOptions;
      this.runner.run(commandContext.command, commandContext.args, codeContext, input);
      return this.emitter.emit('started', commandContext);
    };

    Runtime.prototype.stop = function() {
      this.emitter.emit('stop');
      this.runner.stop();
      return this.emitter.emit('stopped');
    };

    Runtime.prototype.onStart = function(callback) {
      return this.emitter.on('start', callback);
    };

    Runtime.prototype.onStarted = function(callback) {
      return this.emitter.on('started', callback);
    };

    Runtime.prototype.onStop = function(callback) {
      return this.emitter.on('stop', callback);
    };

    Runtime.prototype.onStopped = function(callback) {
      return this.emitter.on('stopped', callback);
    };

    Runtime.prototype.onDidNotSpecifyLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSpecifyLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSupportLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportMode = function(callback) {
      return this.emitter.on('did-not-support-mode', callback);
    };

    Runtime.prototype.onDidNotBuildArgs = function(callback) {
      return this.emitter.on('did-not-build-args', callback);
    };

    Runtime.prototype.onDidContextCreate = function(callback) {
      return this.emitter.on('did-context-create', callback);
    };

    Runtime.prototype.onDidWriteToStdout = function(callback) {
      return this.runner.onDidWriteToStdout(callback);
    };

    Runtime.prototype.onDidWriteToStderr = function(callback) {
      return this.runner.onDidWriteToStderr(callback);
    };

    Runtime.prototype.onDidExit = function(callback) {
      return this.runner.onDidExit(callback);
    };

    Runtime.prototype.onDidNotRun = function(callback) {
      return this.runner.onDidNotRun(callback);
    };

    Runtime.prototype.modeNotSupported = function(argType, lang) {
      return this.emitter.emit('did-not-support-mode', {
        argType: argType,
        lang: lang
      });
    };

    Runtime.prototype.didNotBuildArgs = function(error) {
      return this.emitter.emit('did-not-build-args', {
        error: error
      });
    };

    return Runtime;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3J1bnRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUZKLENBQUE7O0FBQUEsRUFJQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FKRCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNCQUFBLFNBQUEsR0FBVyxFQUFYLENBQUE7O0FBS2EsSUFBQSxpQkFBRSxNQUFGLEVBQVcsa0JBQVgsRUFBZ0MsU0FBaEMsRUFBaUQsT0FBakQsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLHFCQUFBLGtCQUN0QixDQUFBO0FBQUEsTUFEMEMsSUFBQyxDQUFBLGdDQUFBLFlBQVksRUFDdkQsQ0FBQTtBQUFBLE1BRDJELElBQUMsQ0FBQSw0QkFBQSxVQUFVLEdBQUEsQ0FBQSxPQUN0RSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQXpCLENBQUE7QUFBQSxNQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLFNBQVIsRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxHQUFBO2lCQUFjLFFBQVEsQ0FBQyxPQUFULENBQWlCLEtBQWpCLEVBQWQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQixDQURBLENBRFc7SUFBQSxDQUxiOztBQUFBLHNCQWVBLFdBQUEsR0FBYSxTQUFDLFFB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

//# sourceURL=/Users/alholt/.atom/packages/script/lib/runtime.coffee
