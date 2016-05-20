(function() {
  var AnsiToHtml, AtomRunnerView, ScrollView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom-space-pen-views').ScrollView;

  AnsiToHtml = require('ansi-to-html');

  module.exports = AtomRunnerView = (function(_super) {
    __extends(AtomRunnerView, _super);

    atom.deserializers.add(AtomRunnerView);

    AtomRunnerView.deserialize = function(_arg) {
      var footer, output, title, view;
      title = _arg.title, output = _arg.output, footer = _arg.footer;
      view = new AtomRunnerView(title);
      view._output.html(output);
      view._footer.html(footer);
      return view;
    };

    AtomRunnerView.content = function() {
      return this.div({
        "class": 'atom-runner',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.h1('Atom Runner');
          _this.pre({
            "class": 'output'
          });
          return _this.div({
            "class": 'footer'
          });
        };
      })(this));
    };

    function AtomRunnerView(title) {
      AtomRunnerView.__super__.constructor.apply(this, arguments);
      this._output = this.find('.output');
      this._footer = this.find('.footer');
      this.setTitle(title);
    }

    AtomRunnerView.prototype.serialize = function() {
      return {
        deserializer: 'AtomRunnerView',
        title: this.title,
        output: this._output.html(),
        footer: this._footer.html()
      };
    };

    AtomRunnerView.prototype.getTitle = function() {
      return "Atom Runner: " + this.title;
    };

    AtomRunnerView.prototype.setTitle = function(title) {
      this.title = title;
      return this.find('h1').html(this.getTitle());
    };

    AtomRunnerView.prototype.clear = function() {
      this._output.html('');
      return this._footer.html('');
    };

    AtomRunnerView.prototype.append = function(text, className) {
      var node, span;
      span = document.createElement('span');
      node = document.createTextNode(text);
      span.appendChild(node);
      span.innerHTML = new AnsiToHtml().toHtml(span.innerHTML);
      span.className = className || 'stdout';
      return this._output.append(span);
    };

    AtomRunnerView.prototype.footer = function(text) {
      return this._footer.html(text);
    };

    return AtomRunnerView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9hdG9tLXJ1bm5lci9saWIvYXRvbS1ydW5uZXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLHNCQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixxQ0FBQSxDQUFBOztBQUFBLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixjQUF2QixDQUFBLENBQUE7O0FBQUEsSUFFQSxjQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBQ1osVUFBQSwyQkFBQTtBQUFBLE1BRGMsYUFBQSxPQUFPLGNBQUEsUUFBUSxjQUFBLE1BQzdCLENBQUE7QUFBQSxNQUFBLElBQUEsR0FBVyxJQUFBLGNBQUEsQ0FBZSxLQUFmLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFiLENBQWtCLE1BQWxCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFiLENBQWtCLE1BQWxCLENBRkEsQ0FBQTthQUdBLEtBSlk7SUFBQSxDQUZkLENBQUE7O0FBQUEsSUFRQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxhQUFQO0FBQUEsUUFBc0IsUUFBQSxFQUFVLENBQUEsQ0FBaEM7T0FBTCxFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3ZDLFVBQUEsS0FBQyxDQUFBLEVBQUQs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

//# sourceURL=/Users/alholt/.atom/packages/atom-runner/lib/atom-runner-view.coffee
