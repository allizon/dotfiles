(function() {
  var wrapSelection;

  wrapSelection = function(selection, before, after) {
    var selectedText;
    if (after == null) {
      after = before;
    }
    selectedText = selection.getText();
    return selection.insertText("" + before + selectedText + after);
  };

  atom.commands.add('atom-text-editor', 'custom:wrap-with-single-quote', function() {
    var editor;
    editor = this.getModel();
    return editor.transact(function() {
      var selection, _i, _len, _ref, _results;
      _ref = editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        _results.push(wrapSelection(selection, "'", "'"));
      }
      return _results;
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQVlBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixTQUFDLFNBQUQsRUFBWSxNQUFaLEVBQW9CLEtBQXBCLEdBQUE7QUFDZCxRQUFBLFlBQUE7O01BQUEsUUFBUztLQUFUO0FBQUEsSUFDQSxZQUFBLEdBQWUsU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQURmLENBQUE7V0FFQSxTQUFTLENBQUMsVUFBVixDQUFxQixFQUFBLEdBQUcsTUFBSCxHQUFZLFlBQVosR0FBMkIsS0FBaEQsRUFIYztFQUFBLENBQWhCLENBQUE7O0FBQUEsRUFLQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ0UsK0JBREYsRUFDbUMsU0FBQSxHQUFBO0FBQy9CLFFBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBVCxDQUFBO1dBQ0EsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxtQ0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTs2QkFBQTtBQUFBLHNCQUFBLGFBQUEsQ0FBYyxTQUFkLEVBQXlCLEdBQXpCLEVBQThCLEdBQTlCLEVBQUEsQ0FBQTtBQUFBO3NCQURjO0lBQUEsQ0FBaEIsRUFGK0I7RUFBQSxDQURuQyxDQUxBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/alholt/.atom/init.coffee
