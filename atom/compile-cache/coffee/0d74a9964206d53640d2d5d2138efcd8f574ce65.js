(function() {
  var $, ProjectsListView, db, path, utils;

  utils = require('./utils');

  db = require('../lib/db');

  db.updateFilepath(utils.dbPath());

  ProjectsListView = require('../lib/projects-list-view');

  $ = require('atom-space-pen-views').$;

  path = require('path');

  describe("List View", function() {
    var filterEditorView, list, listView, workspaceElement, _ref;
    _ref = [], listView = _ref[0], workspaceElement = _ref[1], list = _ref[2], filterEditorView = _ref[3];
    beforeEach(function() {
      spyOn(db, 'readFile').andCallFake(function(callback) {
        var data, existingPath;
        existingPath = path.join(__dirname);
        data = {
          one: {
            title: 'project one',
            group: 'Test',
            paths: ['/Does/not/exist']
          },
          two: {
            title: 'project two',
            icon: 'icon-bug',
            paths: [existingPath],
            template: 'two'
          },
          three: {
            title: 'a first',
            group: 'a group',
            paths: ['/Does/not/exist/again']
          }
        };
        return callback(data);
      });
      workspaceElement = atom.views.getView(atom.workspace);
      listView = new ProjectsListView();
      return list = listView.list, filterEditorView = listView.filterEditorView, listView;
    });
    it("will list all projects", function() {
      listView.toggle();
      return expect(list.find('li').length).toBe(3);
    });
    it("will let you know if a path is not available", function() {
      listView.toggle();
      expect(list.find('li').eq(0).data('pathMissing')).toBe(true);
      return expect(list.find('li').eq(1).data('pathMissing')).toBe(false);
    });
    it("will add the correct icon to each project", function() {
      var icon1, icon2;
      listView.toggle();
      icon1 = list.find('li[data-project-id="one"]').find('.icon');
      icon2 = list.find('li[data-project-id="two"]').find('.icon');
      expect(icon1.attr('class')).toContain('icon-chevron-right');
      return expect(icon2.attr('class')).toContain('icon-bug');
    });
    describe("When the text of the mini editor changes", function() {
      beforeEach(function() {
        listView.toggle();
        return listView.isOnDom = function() {
          return true;
        };
      });
      it("will only list projects with the correct title", function() {
        filterEditorView.getModel().setText('title:one');
        window.advanceClock(listView.inputThrottle);
        expect(listView.getFilterKey()).toBe('title');
        expect(listView.getFilterQuery()).toBe('one');
        return expect(list.find('li').length).toBe(1);
      });
      it("will only list projects with the correct group", function() {
        filterEditorView.getModel().setText('group:test');
        window.advanceClock(listView.inputThrottle);
        expect(listView.getFilterKey()).toBe('group');
        expect(listView.getFilterQuery()).toBe('test');
        expect(list.find('li').length).toBe(1);
        return expect(list.find('li:eq(0)').find('.project-manager-list-group')).toHaveText('Test');
      });
      it("will only list projects with the correct template", function() {
        filterEditorView.getModel().setText('template:two');
        window.advanceClock(listView.inputThrottle);
        expect(listView.getFilterKey()).toBe('template');
        expect(listView.getFilterQuery()).toBe('two');
        return expect(list.find('li').length).toBe(1);
      });
      return it("will fall back to default filter key if it's not valid", function() {
        filterEditorView.getModel().setText('test:one');
        window.advanceClock(listView.inputThrottle);
        expect(listView.getFilterKey()).toBe(listView.defaultFilterKey);
        expect(listView.getFilterQuery()).toBe('one');
        return expect(list.find('li').length).toBe(1);
      });
    });
    return describe("It sorts the projects in correct order", function() {
      it("sorts after title", function() {
        atom.config.set('project-manager.sortBy', 'title');
        listView.toggle();
        return expect(list.find('li:eq(0)').data('projectId')).toBe("three");
      });
      return it("sort after group", function() {
        atom.config.set('project-manager.sortBy', 'group');
        listView.toggle();
        return expect(list.find('li:eq(0)').data('projectId')).toBe("three");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvc3BlYy9wcm9qZWN0cy1saXN0LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxXQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLEVBQUUsQ0FBQyxjQUFILENBQWtCLEtBQUssQ0FBQyxNQUFOLENBQUEsQ0FBbEIsQ0FGQSxDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDJCQUFSLENBSG5CLENBQUE7O0FBQUEsRUFJQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBSkQsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUxQLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsUUFBQSx3REFBQTtBQUFBLElBQUEsT0FBdUQsRUFBdkQsRUFBQyxrQkFBRCxFQUFXLDBCQUFYLEVBQTZCLGNBQTdCLEVBQW1DLDBCQUFuQyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLFVBQVYsQ0FBcUIsQ0FBQyxXQUF0QixDQUFrQyxTQUFDLFFBQUQsR0FBQTtBQUNoQyxZQUFBLGtCQUFBO0FBQUEsUUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLENBQWYsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUNFO0FBQUEsVUFBQSxHQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsWUFDQSxLQUFBLEVBQU8sTUFEUDtBQUFBLFlBRUEsS0FBQSxFQUFPLENBQUMsaUJBQUQsQ0FGUDtXQURGO0FBQUEsVUFJQSxHQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsWUFDQSxJQUFBLEVBQU0sVUFETjtBQUFBLFlBRUEsS0FBQSxFQUFPLENBQUMsWUFBRCxDQUZQO0FBQUEsWUFHQSxRQUFBLEVBQVUsS0FIVjtXQUxGO0FBQUEsVUFTQSxLQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxTQUFQO0FBQUEsWUFDQSxLQUFBLEVBQU8sU0FEUDtBQUFBLFlBRUEsS0FBQSxFQUFPLENBQUMsdUJBQUQsQ0FGUDtXQVZGO1NBRkYsQ0FBQTtlQWdCQSxRQUFBLENBQVMsSUFBVCxFQWpCZ0M7TUFBQSxDQUFsQyxDQUFBLENBQUE7QUFBQSxNQW1CQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBbkJuQixDQUFBO0FBQUEsTUFvQkEsUUFBQSxHQUFlLElBQUEsZ0JBQUEsQ0FBQSxDQXBCZixDQUFBO2FBcUJDLGdCQUFBLElBQUQsRUFBTyw0QkFBQSxnQkFBUCxFQUEyQixTQXRCbEI7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBMEJBLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxRQUFRLENBQUMsTUFBVCxDQUFBLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsRUFGMkI7SUFBQSxDQUE3QixDQTFCQSxDQUFBO0FBQUEsSUE4QkEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxNQUFBLFFBQVEsQ0FBQyxNQUFULENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsQ0FBQyxFQUFoQixDQUFtQixDQUFuQixDQUFxQixDQUFDLElBQXRCLENBQTJCLGFBQTNCLENBQVAsQ0FBaUQsQ0FBQyxJQUFsRCxDQUF1RCxJQUF2RCxDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsQ0FBQyxFQUFoQixDQUFtQixDQUFuQixDQUFxQixDQUFDLElBQXRCLENBQTJCLGFBQTNCLENBQVAsQ0FBaUQsQ0FBQyxJQUFsRCxDQUF1RCxLQUF2RCxFQUhpRDtJQUFBLENBQW5ELENBOUJBLENBQUE7QUFBQSxJQW1DQSxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFVBQUEsWUFBQTtBQUFBLE1BQUEsUUFBUSxDQUFDLE1BQVQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLDJCQUFWLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsT0FBNUMsQ0FEUixDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSwyQkFBVixDQUFzQyxDQUFDLElBQXZDLENBQTRDLE9BQTVDLENBRlIsQ0FBQTtBQUFBLE1BR0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxJQUFOLENBQVcsT0FBWCxDQUFQLENBQTJCLENBQUMsU0FBNUIsQ0FBc0Msb0JBQXRDLENBSEEsQ0FBQTthQUlBLE1BQUEsQ0FBTyxLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsQ0FBUCxDQUEyQixDQUFDLFNBQTVCLENBQXNDLFVBQXRDLEVBTDhDO0lBQUEsQ0FBaEQsQ0FuQ0EsQ0FBQTtBQUFBLElBMENBLFFBQUEsQ0FBUywwQ0FBVCxFQUFxRCxTQUFBLEdBQUE7QUFDbkQsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxRQUFRLENBQUMsTUFBVCxDQUFBLENBQUEsQ0FBQTtlQUNBLFFBQVEsQ0FBQyxPQUFULEdBQW1CLFNBQUEsR0FBQTtpQkFBRyxLQUFIO1FBQUEsRUFGVjtNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFJQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFFBQUEsZ0JBQWdCLENBQUMsUUFBakIsQ0FBQSxDQUEyQixDQUFDLE9BQTVCLENBQW9DLFdBQXBDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsUUFBUSxDQUFDLGFBQTdCLENBREEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxZQUFULENBQUEsQ0FBUCxDQUErQixDQUFDLElBQWhDLENBQXFDLE9BQXJDLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFULENBQUEsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLEtBQXZDLENBSkEsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsRUFObUQ7TUFBQSxDQUFyRCxDQUpBLENBQUE7QUFBQSxNQVlBLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBLEdBQUE7QUFDbkQsUUFBQSxnQkFBZ0IsQ0FBQyxRQUFqQixDQUFBLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsWUFBcEMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFRLENBQUMsYUFBN0IsQ0FEQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLFlBQVQsQ0FBQSxDQUFQLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsT0FBckMsQ0FIQSxDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sUUFBUSxDQUFDLGNBQVQsQ0FBQSxDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsTUFBdkMsQ0FKQSxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDLENBTEEsQ0FBQTtlQU1BLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsQ0FDTCxDQUFDLElBREksQ0FDQyw2QkFERCxDQUFQLENBQ3VDLENBQUMsVUFEeEMsQ0FDbUQsTUFEbkQsRUFQbUQ7TUFBQSxDQUFyRCxDQVpBLENBQUE7QUFBQSxNQXNCQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFFBQUEsZ0JBQWdCLENBQUMsUUFBakIsQ0FBQSxDQUEyQixDQUFDLE9BQTVCLENBQW9DLGNBQXBDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsUUFBUSxDQUFDLGFBQTdCLENBREEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxZQUFULENBQUEsQ0FBUCxDQUErQixDQUFDLElBQWhDLENBQXFDLFVBQXJDLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFULENBQUEsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLEtBQXZDLENBSkEsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsRUFOc0Q7TUFBQSxDQUF4RCxDQXRCQSxDQUFBO2FBOEJBLEVBQUEsQ0FBRyx3REFBSCxFQUE2RCxTQUFBLEdBQUE7QUFDM0QsUUFBQSxnQkFBZ0IsQ0FBQyxRQUFqQixDQUFBLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsVUFBcEMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFRLENBQUMsYUFBN0IsQ0FEQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLFlBQVQsQ0FBQSxDQUFQLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsUUFBUSxDQUFDLGdCQUE5QyxDQUhBLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxRQUFRLENBQUMsY0FBVCxDQUFBLENBQVAsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxLQUF2QyxDQUpBLENBQUE7ZUFLQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDLEVBTjJEO01BQUEsQ0FBN0QsRUEvQm1EO0lBQUEsQ0FBckQsQ0ExQ0EsQ0FBQTtXQWlGQSxRQUFBLENBQVMsd0NBQVQsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELE1BQUEsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsT0FBMUMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsTUFBVCxDQUFBLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixXQUEzQixDQUFQLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsT0FBckQsRUFIc0I7TUFBQSxDQUF4QixDQUFBLENBQUE7YUFLQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxPQUExQyxDQUFBLENBQUE7QUFBQSxRQUNBLFFBQVEsQ0FBQyxNQUFULENBQUEsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsVUFBVixDQUFxQixDQUFDLElBQXRCLENBQTJCLFdBQTNCLENBQVAsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxPQUFyRCxFQUhxQjtNQUFBLENBQXZCLEVBTmlEO0lBQUEsQ0FBbkQsRUFsRm9CO0VBQUEsQ0FBdEIsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/alholt/.atom/packages/project-manager/spec/projects-list-view-spec.coffee
