(function() {
  var CSONParser, fs, path;

  fs = require('fs');

  path = require('path');

  CSONParser = require('cson-parser');

  module.exports = {
    config: {
      debug: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      console.log('activate editor-settings');
      this.watching = [];
      this.configDir = atom.getConfigDirPath() + "/grammar-config";
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir);
      }
      this.registerCommands();
      atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.reconfigureCurrentEditor();
        };
      })(this));
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return editor.observeGrammar(function() {
            return _this.reconfigureCurrentEditor();
          });
        };
      })(this));
      return this.reconfigureCurrentEditor();
    },
    debug: function(msg) {
      if (atom.config.get('editor-settings.debug')) {
        return console.log(msg);
      }
    },
    registerCommands: function() {
      return atom.commands.add('atom-text-editor', {
        'editor-settings:open-grammar-config': (function(_this) {
          return function() {
            return _this.editCurrentGrammarConfig();
          };
        })(this)
      });
    },
    reconfigureCurrentEditor: function() {
      var buffer, config, editor, view;
      editor = atom.workspace.getActiveTextEditor();
      this.debug("reconfigure current editor");
      if (editor != null) {
        config = this.loadAllConfigFiles(editor.getGrammar().name);
        if (config.tabLength != null) {
          editor.setTabLength(config.tabLength);
        }
        if (config.softTabs != null) {
          editor.setSoftTabs(config.softTabs);
        }
        if (config.softWrap != null) {
          editor.setSoftWrapped(config.softWrap);
        }
        if (editor.buffer != null) {
          buffer = editor.buffer;
          if (config.encoding) {
            buffer.setEncoding(config.encoding);
          }
        }
        view = atom.views.getView(editor);
        if (view != null) {
          if (config.fontFamily != null) {
            return view.style.fontFamily = config.fontFamily;
          }
        }
      }
    },
    loadAllConfigFiles: function(grammarName) {
      var config, defaults, directoryConfig, directoryConfigPath, directoryPath, editor, fileExtension, grammarConfig, projectConfig, projectConfigPath, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      editor = atom.workspace.getActiveTextEditor();
      fileExtension = path.extname(editor.getPath()).substring(1);
      this.debug('current editor file extension: ' + fileExtension);
      config = {};
      defaults = this.merge(atom.config.defaultSettings.editor, atom.config.settings.editor);
      config = this.merge(config, defaults);
      if (fs.existsSync(this.grammarConfigPath(grammarName))) {
        grammarConfig = this.loadConfig(this.grammarConfigPath(grammarName));
        this.debug('loading grammar config: ' + grammarName);
        config = this.merge(config, grammarConfig);
      } else {
        this.debug('no grammar config for: ' + grammarName);
      }
      if (((_ref = atom.project) != null ? (_ref1 = _ref.rootDirectories) != null ? (_ref2 = _ref1[0]) != null ? _ref2.path : void 0 : void 0 : void 0) != null) {
        projectConfigPath = atom.project.rootDirectories[0].path + "/.editor-settings";
        if (projectConfig = this.loadConfig(projectConfigPath)) {
          this.debug('loading project config: ' + projectConfigPath);
          config = this.merge(config, projectConfig);
        }
      }
      if (((_ref3 = editor.buffer) != null ? (_ref4 = _ref3.file) != null ? (_ref5 = _ref4.getParent()) != null ? _ref5.path : void 0 : void 0 : void 0) != null) {
        directoryPath = editor.buffer.file.getParent().path;
        directoryConfigPath = directoryPath + "/.editor-settings";
        if (directoryConfig = this.loadConfig(directoryConfigPath)) {
          this.debug('loading directory config: ' + directoryConfigPath);
          config = this.merge(config, directoryConfig);
        }
      }
      if (((_ref6 = config.grammarConfig) != null ? _ref6[grammarName] : void 0) != null) {
        this.debug('merging grammar config: ' + grammarName);
        config = this.merge(config, config.grammarConfig[grammarName]);
      }
      if ((((_ref7 = config.extensionConfig) != null ? _ref7[fileExtension] : void 0) != null) && fileExtension.length > 0) {
        this.debug('merging file extension config: ' + fileExtension);
        config = this.merge(config, config.extensionConfig[fileExtension]);
      }
      return config;
    },
    merge: function(first, second) {
      var a, b, c, config, d;
      config = {};
      for (a in first) {
        b = first[a];
        if (typeof b === "object") {
          config[a] = this.merge({}, b);
        } else {
          config[a] = b;
        }
      }
      for (c in second) {
        d = second[c];
        if (typeof d === "object") {
          config[c] = this.merge({}, d);
        } else {
          config[c] = d;
        }
      }
      return config;
    },
    editCurrentGrammarConfig: function() {
      var editor, filePath, grammar, workspace;
      workspace = atom.workspace != null;
      if (!workspace) {
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor != null) {
        grammar = editor.getGrammar();
        filePath = this.grammarConfigPath(grammar.name);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '');
        }
        this.watchFile(filePath);
        return atom.workspace.open(filePath);
      }
    },
    watchFile: function(path) {
      if (!this.watching[path]) {
        fs.watch(path, (function(_this) {
          return function() {
            _this.debug('watched file updated: ' + path);
            return _this.reconfigureCurrentEditor();
          };
        })(this));
        this.debug('watching: ' + path);
        return this.watching[path] = true;
      }
    },
    fileNameFor: function(text) {
      return text.replace(/\s+/gi, '-').toLowerCase();
    },
    grammarConfigPath: function(name) {
      var fileName;
      fileName = this.fileNameFor(name);
      return this.configDir + "/" + fileName + ".cson";
    },
    loadConfig: function(path) {
      var contents, error;
      if (fs.existsSync(path)) {
        contents = fs.readFileSync(path);
        this.watchFile(path);
        if (contents.length > 1) {
          try {
            return CSONParser.parse(contents);
          } catch (_error) {
            error = _error;
            return console.log(error);
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9lZGl0b3Itc2V0dGluZ3MvbGliL2VkaXRvci1zZXR0aW5ncy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0JBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQWMsT0FBQSxDQUFRLElBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFjLE9BQUEsQ0FBUSxNQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUZkLENBQUE7O0FBQUEsRUFxQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQURGO0tBREY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksMEJBQVosQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFhLEVBRmIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUFBLEdBQTBCLGlCQUh2QyxDQUFBO0FBTUEsTUFBQSxJQUFHLENBQUEsRUFBTSxDQUFDLFVBQUgsQ0FBYyxJQUFDLENBQUEsU0FBZixDQUFQO0FBQ0UsUUFBQSxFQUFFLENBQUMsU0FBSCxDQUFhLElBQUMsQ0FBQSxTQUFkLENBQUEsQ0FERjtPQU5BO0FBQUEsTUFTQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQVRBLENBQUE7QUFBQSxNQVdBLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtp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

//# sourceURL=/Users/alholt/.atom/packages/editor-settings/lib/editor-settings.coffee
