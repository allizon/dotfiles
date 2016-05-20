(function() {
  var $, ScrollView, TerminalOutputview, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  module.exports = TerminalOutputview = (function(_super) {
    __extends(TerminalOutputview, _super);

    function TerminalOutputview() {
      return TerminalOutputview.__super__.constructor.apply(this, arguments);
    }

    TerminalOutputview.prototype.message = '';

    TerminalOutputview.content = function() {
      return this.div({
        "class": 'django-test-runner'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'django-test-runner__test-output'
          });
        };
      })(this));
    };

    TerminalOutputview.prototype.addLine = function(line) {
      return this.find(".django-test-runner__test-output").append("<p>" + line + "</p>");
    };

    TerminalOutputview.prototype.reset = function() {
      return this.find(".django-test-runner__test-output").empty();
    };

    TerminalOutputview.prototype.getURI = function() {
      return 'atom://django-test-runner:output';
    };

    TerminalOutputview.prototype.destroy = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    return TerminalOutputview;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9kamFuZ28tdGVzdC1ydW5uZXIvbGliL3ZpZXdzL3Rlcm1pbmFsLW91dHB1dC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBQSxDQUFELEVBQUksa0JBQUEsVUFBSixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNGLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxPQUFBLEdBQVMsRUFBVCxDQUFBOztBQUFBLElBRUEsa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG9CQUFQO09BQUwsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDaEMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGlDQUFQO1dBQUwsRUFEZ0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxFQURRO0lBQUEsQ0FGVixDQUFBOztBQUFBLGlDQU1BLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxJQUFELENBQU0sa0NBQU4sQ0FBeUMsQ0FBQyxNQUExQyxDQUFpRCxLQUFBLEdBQVEsSUFBUixHQUFlLE1BQWhFLEVBRE87SUFBQSxDQU5ULENBQUE7O0FBQUEsaUNBU0EsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxJQUFELENBQU0sa0NBQU4sQ0FBeUMsQ0FBQyxLQUExQyxDQUFBLEVBREs7SUFBQSxDQVRQLENBQUE7O0FBQUEsaUNBWUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUFHLG1DQUFIO0lBQUEsQ0FaUixDQUFBOztBQUFBLGlDQWNBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLEtBQUE7aURBQU0sQ0FBRSxPQUFSLENBQUEsV0FETztJQUFBLENBZFQsQ0FBQTs7OEJBQUE7O0tBRDZCLFdBSGpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/alholt/.atom/packages/django-test-runner/lib/views/terminal-output-view.coffee
