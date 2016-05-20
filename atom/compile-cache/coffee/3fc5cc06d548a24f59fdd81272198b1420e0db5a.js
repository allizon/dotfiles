(function() {
  var FileOpener, MigrationFinderView, ViewFinderView;

  ViewFinderView = require('./view-finder-view');

  MigrationFinderView = require('./migration-finder-view');

  FileOpener = require('./file-opener');

  module.exports = {
    config: {
      viewFileExtension: {
        type: 'string',
        description: 'This is the extension of the view files.',
        "default": 'html.erb'
      },
      controllerSpecType: {
        type: 'string',
        description: 'This is the type of the controller spec. controllers, requests or features',
        "default": 'controllers',
        "enum": ['controllers', 'requests', 'features', 'api', 'integration']
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'rails-transporter:open-view-finder': (function(_this) {
          return function() {
            return _this.createViewFinderView().toggle();
          };
        })(this),
        'rails-transporter:open-migration-finder': (function(_this) {
          return function() {
            return _this.createMigrationFinderView().toggle();
          };
        })(this),
        'rails-transporter:open-model': (function(_this) {
          return function() {
            return _this.createFileOpener().openModel();
          };
        })(this),
        'rails-transporter:open-helper': (function(_this) {
          return function() {
            return _this.createFileOpener().openHelper();
          };
        })(this),
        'rails-transporter:open-partial-template': (function(_this) {
          return function() {
            return _this.createFileOpener().openPartial();
          };
        })(this),
        'rails-transporter:open-test': (function(_this) {
          return function() {
            return _this.createFileOpener().openTest();
          };
        })(this),
        'rails-transporter:open-spec': (function(_this) {
          return function() {
            return _this.createFileOpener().openSpec();
          };
        })(this),
        'rails-transporter:open-asset': (function(_this) {
          return function() {
            return _this.createFileOpener().openAsset();
          };
        })(this),
        'rails-transporter:open-controller': (function(_this) {
          return function() {
            return _this.createFileOpener().openController();
          };
        })(this),
        'rails-transporter:open-layout': (function(_this) {
          return function() {
            return _this.createFileOpener().openLayout();
          };
        })(this),
        'rails-transporter:open-view': (function(_this) {
          return function() {
            return _this.createFileOpener().openView();
          };
        })(this),
        'rails-transporter:open-factory': (function(_this) {
          return function() {
            return _this.createFileOpener().openFactory();
          };
        })(this)
      });
    },
    deactivate: function() {
      if (this.viewFinderView != null) {
        this.viewFinderView.destroy();
      }
      if (this.migrationFinderView != null) {
        return this.migrationFinderView.destroy();
      }
    },
    createFileOpener: function() {
      if (this.fileOpener == null) {
        this.fileOpener = new FileOpener();
      }
      return this.fileOpener;
    },
    createViewFinderView: function() {
      if (this.viewFinderView == null) {
        this.viewFinderView = new ViewFinderView();
      }
      return this.viewFinderView;
    },
    createMigrationFinderView: function() {
      if (this.migrationFinderView == null) {
        this.migrationFinderView = new MigrationFinderView();
      }
      return this.migrationFinderView;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9yYWlscy10cmFuc3BvcnRlci9saWIvcmFpbHMtdHJhbnNwb3J0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUixDQUR0QixDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFhLFFBQWI7QUFBQSxRQUNBLFdBQUEsRUFBYSwwQ0FEYjtBQUFBLFFBRUEsU0FBQSxFQUFhLFVBRmI7T0FERjtBQUFBLE1BSUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFhLFFBQWI7QUFBQSxRQUNBLFdBQUEsRUFBYSw0RUFEYjtBQUFBLFFBRUEsU0FBQSxFQUFhLGFBRmI7QUFBQSxRQUdBLE1BQUEsRUFBYSxDQUFDLGFBQUQsRUFBZ0IsVUFBaEIsRUFBNEIsVUFBNUIsRUFBd0MsS0FBeEMsRUFBK0MsYUFBL0MsQ0FIYjtPQUxGO0tBREY7QUFBQSxJQVdBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsb0NBQUEsRUFBc0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ3BDLEtBQUMsQ0FBQSxvQkFBRCxDQUFBLENBQXVCLENBQUMsTUFBeEIsQ0FBQSxFQURvQztVQUFBLEVBQUE7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

//# sourceURL=/Users/alholt/.atom/packages/rails-transporter/lib/rails-transporter.coffee
