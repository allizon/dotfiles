Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

'use babel';

var Project = (function () {
  function Project() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Project);

    this.props = {};
    this.emitter = new _atom.Emitter();
    this.db = new _db2['default']();
    this.updateProps(props);
    this.lookForUpdates();
  }

  _createClass(Project, [{
    key: 'updateProps',
    value: function updateProps(props) {
      this.props = _underscorePlus2['default'].deepExtend(this.defaultProps, props);
    }
  }, {
    key: 'getPropsToSave',
    value: function getPropsToSave() {
      var saveProps = {};
      var value = undefined;
      var key = undefined;
      for (key in this.props) {
        value = this.props[key];
        if (!this.isDefaultProp(key, value)) {
          saveProps[key] = value;
        }
      }

      return saveProps;
    }
  }, {
    key: 'isDefaultProp',
    value: function isDefaultProp(key, value) {
      if (!this.defaultProps.hasOwnProperty(key)) {
        return false;
      }

      var defaultProp = this.defaultProps[key];
      if (typeof defaultProp === 'object' && _underscorePlus2['default'].isEqual(defaultProp, value)) {
        return true;
      }

      if (defaultProp === value) {
        return true;
      }

      return false;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      if (typeof key === 'object') {
        for (var i in key) {
          value = key[i];
          this.props[i] = value;
        }

        this.save();
      } else {
        this.props[key] = value;
        this.save();
      }
    }
  }, {
    key: 'unset',
    value: function unset(key) {
      if (_underscorePlus2['default'].has(this.defaultProps, key)) {
        this.props[key] = this.defaultProps[key];
      } else {
        this.props[key] = null;
      }

      this.save();
    }
  }, {
    key: 'lookForUpdates',
    value: function lookForUpdates() {
      var _this = this;

      if (this.props._id) {
        this.db.setSearchQuery('_id', this.props._id);
        this.db.onUpdate(function (props) {
          if (props) {
            var updatedProps = _underscorePlus2['default'].deepExtend(_this.defaultProps, props);
            if (!_underscorePlus2['default'].isEqual(_this.props, updatedProps)) {
              _this.updateProps(props);
              _this.emitter.emit('updated');
              if (_this.isCurrent()) {
                _this.load();
              }
            }
          } else {
            _this.db.setSearchQuery('paths', _this.props.paths);
            _this.db.find(function (props) {
              _this.updateProps(props);
              _this.db.setSearchQuery('_id', _this.props._id);
              _this.emitter.emit('updated');
              if (_this.isCurrent()) {
                _this.load();
              }
            });
          }
        });
      }
    }
  }, {
    key: 'isCurrent',
    value: function isCurrent() {
      var activePath = atom.project.getPaths()[0];
      var mainPath = this.props.paths[0] ? this.props.paths[0] : null;
      if (activePath === mainPath) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      var _this2 = this;

      var valid = true;
      this.requiredProperties.forEach(function (key) {
        if (!_this2.props[key] || !_this2.props[key].length) {
          valid = false;
        }
      });

      return valid;
    }
  }, {
    key: 'load',
    value: function load() {
      if (this.isCurrent()) {
        var projectSettings = new _settings2['default']();
        projectSettings.load(this.props.settings);
      }
    }
  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      if (this.isValid()) {
        if (this.props._id) {
          this.db.update(this.getPropsToSave());
        } else {
          this.db.add(this.getPropsToSave(), function (id) {
            _this3.props._id = id;
            _this3.lookForUpdates();
          });
        }

        return true;
      }

      return false;
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.db['delete'](this.props._id);
    }
  }, {
    key: 'open',
    value: function open() {
      var win = atom.getCurrentWindow();
      var closeCurrent = atom.config.get('project-manager.closeCurrent');

      atom.open({
        pathsToOpen: this.props.paths,
        devMode: this.props.devMode,
        newWindow: closeCurrent
      });

      if (closeCurrent) {
        setTimeout(function () {
          win.close();
        }, 0);
      }
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(callback) {
      this.emitter.on('updated', function () {
        return callback();
      });
    }
  }, {
    key: 'requiredProperties',
    get: function get() {
      return ['title', 'paths'];
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        title: '',
        paths: [],
        icon: 'icon-chevron-right',
        settings: {},
        group: null,
        devMode: false,
        template: null
      };
    }
  }]);

  return Project;
})();

exports['default'] = Project;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGhvbHQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXNCLE1BQU07OzhCQUNkLGlCQUFpQjs7Ozt3QkFDVixZQUFZOzs7O2tCQUNsQixNQUFNOzs7O0FBTHJCLFdBQVcsQ0FBQzs7SUFPUyxPQUFPO0FBRWYsV0FGUSxPQUFPLEdBRUo7UUFBVixLQUFLLHlEQUFDLEVBQUU7OzBCQUZELE9BQU87O0FBR3hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsRUFBRSxHQUFHLHFCQUFRLENBQUM7QUFDbkIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixRQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDdkI7O2VBUmtCLE9BQU87O1dBMEJmLHFCQUFDLEtBQUssRUFBRTtBQUNqQixVQUFJLENBQUMsS0FBSyxHQUFHLDRCQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3JEOzs7V0FFYSwwQkFBRztBQUNmLFVBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNuQixVQUFJLEtBQUssWUFBQSxDQUFDO0FBQ1YsVUFBSSxHQUFHLFlBQUEsQ0FBQztBQUNSLFdBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDdEIsYUFBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ25DLG1CQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO09BQ0Y7O0FBRUQsYUFBTyxTQUFTLENBQUM7S0FDbEI7OztXQUVZLHVC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QUFLLEVBQUUsRUFBRTtBQUNULFlBQUksRUFBRSxvQkFBb0I7QUFDMUIsZ0JBQVEsRUFBRSxFQUFFO0FBQ1osYUFBSyxFQUFFLElBQUk7QUFDWCxlQUFPLEVBQUUsS0FBSztBQUNkLGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUM7S0FDSDs7O1NBeEJrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvYWxob2x0Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2F0b20nO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBTZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzJztcbmltcG9ydCBEQiBmcm9tICcuL2RiJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHM9e30pIHtcbiAgICB0aGlzLnByb3BzID0ge307XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLmRiID0gbmV3IERCKCk7XG4gICAgdGhpcy51cGRhdGVQcm9wcyhwcm9wcyk7XG4gICAgdGhpcy5sb29rRm9yVXBkYXRlcygpO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkUHJvcGVydGllcygpIHtcbiAgICByZXR1cm4gWyd0aXRsZScsICdwYXRocyddO1xuICB9XG5cbiAgZ2V0IGRlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6ICcnLFxuICAgICAgcGF0aHM6IFtdLFxuICAgICAgaWNvbjogJ2ljb24tY2hldnJvbi1yaWdodCcsXG4gICAgICBzZXR0aW5nczoge30sXG4gICAgICBncm91cDogbnVsbCxcbiAgICAgIGRldk1vZGU6IGZhbHNlLFxuICAgICAgdGVtcGxhdGU6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlUHJvcHMocHJvcHMpIHtcbiAgICB0aGlzLnByb3BzID0gXy5kZWVwRXh0ZW5kKHRoaXMuZGVmYXVsdFByb3BzLCBwcm9wcyk7XG4gIH1cblxuICBnZXRQcm9wc1RvU2F2ZSgpIHtcbiAgICBsZXQgc2F2ZVByb3BzID0ge307XG4gICAgbGV0IHZhbHVlO1xuICAgIGxldCBrZXk7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5wcm9wcykge1xuICAgICAgdmFsdWUgPSB0aGlzLnByb3BzW2tleV07XG4gICAgICBpZiAoIXRoaXMuaXNEZWZhdWx0UHJvcChrZXksIHZhbHVlKSkge1xuICAgICAgICBzYXZlUHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzYXZlUHJvcHM7XG4gIH1cblxuICBpc0RlZmF1bHRQcm9wKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdFByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0UHJvcCA9IHRoaXMuZGVmYXVsdFByb3BzW2tleV07XG4gICAgaWYgKHR5cGVvZiBkZWZhdWx0UHJvcCA9PT0gJ29iamVjdCcgJiYgXy5pc0VxdWFsKGRlZmF1bHRQcm9wLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkZWZhdWx0UHJvcCA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKGxldCBpIGluIGtleSkge1xuICAgICAgICB2YWx1ZSA9IGtleVtpXTtcbiAgICAgICAgdGhpcy5wcm9wc1tpXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNhdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wc1trZXldID0gdmFsdWU7XG4gICAgICB0aGlzLnNhdmUoKTtcbiAgICB9XG4gIH1cblxuICB1bnNldChrZXkpIHtcbiAgICBpZiAoXy5oYXModGhpcy5kZWZhdWx0UHJvcHMsIGtleSkpIHtcbiAgICAgIHRoaXMucHJvcHNba2V5XSA9IHRoaXMuZGVmYXVsdFByb3BzW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHNba2V5XSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zYXZlKCk7XG4gIH1cblxuICBsb29rRm9yVXBkYXRlcygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5faWQpIHtcbiAgICAgIHRoaXMuZGIuc2V0U2VhcmNoUXVlcnkoJ19pZCcsIHRoaXMucHJvcHMuX2lkKTtcbiAgICAgIHRoaXMuZGIub25VcGRhdGUoKHByb3BzKSA9PiB7XG4gICAgICAgIGlmIChwcm9wcykge1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRQcm9wcyA9IF8uZGVlcEV4dGVuZCh0aGlzLmRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICAgICAgICAgIGlmICghXy5pc0VxdWFsKHRoaXMucHJvcHMsIHVwZGF0ZWRQcm9wcykpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZWQnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRiLnNldFNlYXJjaFF1ZXJ5KCdwYXRocycsIHRoaXMucHJvcHMucGF0aHMpO1xuICAgICAgICAgIHRoaXMuZGIuZmluZCgocHJvcHMpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5kYi5zZXRTZWFyY2hRdWVyeSgnX2lkJywgdGhpcy5wcm9wcy5faWQpO1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZWQnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBpc0N1cnJlbnQoKSB7XG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGNvbnN0IG1haW5QYXRoID0gdGhpcy5wcm9wcy5wYXRoc1swXSA/IHRoaXMucHJvcHMucGF0aHNbMF0gOiBudWxsO1xuICAgIGlmIChhY3RpdmVQYXRoID09PSBtYWluUGF0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNWYWxpZCgpIHtcbiAgICBsZXQgdmFsaWQgPSB0cnVlO1xuICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmICghdGhpcy5wcm9wc1trZXldIHx8ICF0aGlzLnByb3BzW2tleV0ubGVuZ3RoKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsaWQ7XG4gIH1cblxuICBsb2FkKCkge1xuICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICBsZXQgcHJvamVjdFNldHRpbmdzID0gbmV3IFNldHRpbmdzKCk7XG4gICAgICBwcm9qZWN0U2V0dGluZ3MubG9hZCh0aGlzLnByb3BzLnNldHRpbmdzKTtcbiAgICB9XG4gIH1cblxuICBzYXZlKCkge1xuICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuX2lkKSB7XG4gICAgICAgIHRoaXMuZGIudXBkYXRlKHRoaXMuZ2V0UHJvcHNUb1NhdmUoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRiLmFkZCh0aGlzLmdldFByb3BzVG9TYXZlKCksIGlkID0+IHtcbiAgICAgICAgICB0aGlzLnByb3BzLl9pZCA9IGlkO1xuICAgICAgICAgIHRoaXMubG9va0ZvclVwZGF0ZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLmRiLmRlbGV0ZSh0aGlzLnByb3BzLl9pZCk7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIGNvbnN0IHdpbiA9IGF0b20uZ2V0Q3VycmVudFdpbmRvdygpO1xuICAgIGNvbnN0IGNsb3NlQ3VycmVudCA9IGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmNsb3NlQ3VycmVudCcpO1xuXG4gICAgYXRvbS5vcGVuKHtcbiAgICAgIHBhdGhzVG9PcGVuOiB0aGlzLnByb3BzLnBhdGhzLFxuICAgICAgZGV2TW9kZTogdGhpcy5wcm9wcy5kZXZNb2RlLFxuICAgICAgbmV3V2luZG93OiBjbG9zZUN1cnJlbnRcbiAgICB9KTtcblxuICAgIGlmIChjbG9zZUN1cnJlbnQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbi5jbG9zZSgpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG5cbiAgb25VcGRhdGUoY2FsbGJhY2spIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ3VwZGF0ZWQnLCAoKSA9PiBjYWxsYmFjaygpKTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/alholt/.atom/packages/project-manager/lib/project.js
