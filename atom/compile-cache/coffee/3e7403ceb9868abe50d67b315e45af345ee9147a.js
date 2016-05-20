(function() {
  var $, $$, Point, RailsTransporter, fs, path, temp, wrench, _ref;

  path = require('path');

  fs = require('fs');

  temp = require('temp');

  wrench = require('wrench');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  Point = require('atom').Point;

  RailsTransporter = require('../lib/rails-transporter');

  describe("RailsTransporter", function() {
    var activationPromise, editor, viewFinderView, workspaceElement, _ref1;
    activationPromise = null;
    _ref1 = [], workspaceElement = _ref1[0], viewFinderView = _ref1[1], editor = _ref1[2];
    beforeEach(function() {
      var fixturesPath, tempPath;
      tempPath = fs.realpathSync(temp.mkdirSync('atom'));
      fixturesPath = atom.project.getPaths()[0];
      wrench.copyDirSyncRecursive(fixturesPath, tempPath, {
        forceDelete: true
      });
      atom.project.setPaths([tempPath]);
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('rails-transporter');
    });
    describe("open-migration-finder behavior", function() {
      return describe("when the rails-transporter:open-migration-finder event is triggered", function() {
        return it("shows all migration paths and selects the first", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-migration-finder');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            var migration, migrationDir, _i, _len, _ref2, _results;
            migrationDir = path.join(atom.project.getPaths()[0], 'db', 'migrate');
            expect(workspaceElement.querySelectorAll('.select-list li').length).toBe(fs.readdirSync(migrationDir).length);
            _ref2 = fs.readdirSync(migrationDir);
            _results = [];
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              migration = _ref2[_i];
              expect($(workspaceElement).find(".select-list .primary-line:contains(" + migration + ")")).toExist();
              _results.push(expect($(workspaceElement).find(".select-list .secondary-line:contains(" + (atom.project.relativize(path.join(migrationDir, migration))) + ")")).toExist());
            }
            return _results;
          });
        });
      });
    });
    describe("open-view behavior", function() {
      return describe("when active editor opens controller", function() {
        describe("open file for viewFileExtension", function() {
          beforeEach(function() {
            return waitsForPromise(function() {
              return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
            });
          });
          return it("opens related view", function() {
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(9, 0));
            atom.commands.dispatch(workspaceElement, 'rails-transporter:open-view');
            waitsFor(function() {
              activationPromise;
              return atom.workspace.getActivePane().getItems().length === 2;
            });
            return runs(function() {
              var viewPath;
              viewPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'index.html.erb');
              editor = atom.workspace.getActiveTextEditor();
              expect(editor.getPath()).toBe(viewPath);
              return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^<h1>Listing blogs<\/h1>$/);
            });
          });
        });
        return describe("open file for viewFileExtensionFallbacks", function() {
          beforeEach(function() {
            return waitsForPromise(function() {
              atom.config.set('rails-transporter.viewFileExtensionFallbacks', ['json.jbuilder']);
              return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'api', 'blogs_controller.rb'));
            });
          });
          return it("opens related view", function() {
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(4, 0));
            atom.commands.dispatch(workspaceElement, 'rails-transporter:open-view');
            waitsFor(function() {
              activationPromise;
              return atom.workspace.getActivePane().getItems().length === 2;
            });
            return runs(function() {
              var viewPath;
              viewPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'api', 'blogs', 'index.json.jbuilder');
              editor = atom.workspace.getActiveTextEditor();
              expect(editor.getPath()).toBe(viewPath);
              return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^json.array!(@blogs) do |blog|$/);
            });
          });
        });
      });
    });
    describe("open-view-finder behavior", function() {
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return describe("when the rails-transporter:open-view-finder event is triggered", function() {
          return it("shows all relative view paths for the current controller and selects the first", function() {
            atom.commands.dispatch(workspaceElement, 'rails-transporter:open-view-finder');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              var view, viewDir, _i, _len, _ref2;
              viewDir = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs');
              expect($(workspaceElement).find('.select-list li').length).toBe(fs.readdirSync(viewDir).length);
              _ref2 = fs.readdirSync(viewDir);
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                view = _ref2[_i];
                expect($(workspaceElement).find(".select-list .primary-line:contains(" + view + ")")).toExist();
                expect($(workspaceElement).find(".select-list .secondary-line:contains(" + (atom.project.relativize(path.join(viewDir, view))) + ")")).toExist();
              }
              expect($(workspaceElement).find(".select-list li:first")).toHaveClass('two-lines selected');
              return atom.commands.dispatch(workspaceElement, 'rails-transporter:open-view-finder');
            });
          });
        });
      });
      describe("when active editor opens mailer", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'mailers', 'notification_mailer.rb'));
          });
        });
        return describe("when the rails-transporter:open-view-finder event is triggered", function() {});
      });
      return describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return describe("when the rails-transporter:open-view-finder event is triggered", function() {});
      });
    });
    describe("open-model behavior", function() {
      describe("when active editor opens model and cursor is on include method", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens model concern", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(1, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var concernPath;
            concernPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'concerns', 'searchable.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(concernPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module Searchable$/);
          });
        });
      });
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens related model", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
          });
        });
      });
      return describe("when active editor opens namespaced controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'admins', 'blogs_controller.rb'));
          });
        });
        return it("opens related model", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
          });
        });
      });
    });
    describe("when active editor opens model test", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return atom.workspace.open(path.join(atom.project.getPaths()[0], 'test', 'models', 'blog_test.rb'));
        });
      });
      return it("opens related model", function() {
        atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
        waitsFor(function() {
          activationPromise;
          return atom.workspace.getActivePane().getItems().length === 2;
        });
        return runs(function() {
          var modelPath;
          modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(0, 0));
          expect(editor.getPath()).toBe(modelPath);
          return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
        });
      });
    });
    describe("when active editor opens model spec", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'models', 'blog_spec.rb'));
        });
      });
      return it("opens related model", function() {
        atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
        waitsFor(function() {
          activationPromise;
          return atom.workspace.getActivePane().getItems().length === 2;
        });
        return runs(function() {
          var modelPath;
          modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(0, 0));
          expect(editor.getPath()).toBe(modelPath);
          return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
        });
      });
    });
    describe("when active editor opens factory", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'factories', 'blogs.rb'));
        });
      });
      return it("opens related model", function() {
        atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
        waitsFor(function() {
          activationPromise;
          return atom.workspace.getActivePane().getItems().length === 2;
        });
        return runs(function() {
          var modelPath;
          modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(0, 0));
          expect(editor.getPath()).toBe(modelPath);
          return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
        });
      });
    });
    describe("when active editor opens view", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'show.html.erb'));
        });
      });
      return it("opens related model", function() {
        atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
        waitsFor(function() {
          activationPromise;
          return atom.workspace.getActivePane().getItems().length === 2;
        });
        return runs(function() {
          var modelPath;
          modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(0, 0));
          expect(editor.getPath()).toBe(modelPath);
          return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
        });
      });
    });
    describe("open-helper behavior", function() {
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
      describe("when active editor opens helper test", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'test', 'helpers', 'blogs_helper_test.rb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
      describe("when active editor opens helper spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'helpers', 'blogs_helper_spec.rb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
      return describe("when active editor opens view", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'show.html.erb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
    });
    describe("open-patial-template behavior", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'edit.html.erb'));
        });
      });
      describe("when cursor's current buffer row contains render method", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(2, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form Partial$/);
          });
        });
      });
      describe("when cursor's current buffer row contains render method with ':partial =>'", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(3, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form Partial$/);
          });
        });
      });
      describe("when cursor's current buffer row contains render method with 'partial:'", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(4, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form Partial$/);
          });
        });
      });
      describe("when cursor's current buffer row contains render method taking shared partial", function() {
        return it("opens shared partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(5, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'shared', '_form.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Shared Form Partial$/);
          });
        });
      });
      describe("when current line is to call render method with integer", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(6, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form02.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form02 Partial$/);
          });
        });
      });
      describe("when current line is to call render method with integer and including ':partial =>'", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(7, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form02.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form02 Partial$/);
          });
        });
      });
      describe("when current line is to call render method with integer and including '(:partial =>'", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(8, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form02.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form02 Partial$/);
          });
        });
      });
      return describe("when current line is to call render method with '(", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(9, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form02.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form02 Partial$/);
          });
        });
      });
    });
    describe("open-layout", function() {
      describe("when cursor's current buffer row contains layout method", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens specified layout", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(2, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-layout');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts', 'special.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/Special Layout/);
          });
        });
      });
      describe("when same base name as the controller exists", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'top_controller.rb'));
          });
        });
        return it("opens layout that same base name as the controller", function() {
          editor = atom.workspace.getActiveTextEditor();
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-layout');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts', 'top.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/Top Layout/);
          });
        });
      });
      return describe("when there is no such controller-specific layout", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'main_controller.rb'));
          });
        });
        return it("opens default layout named 'application'", function() {
          editor = atom.workspace.getActiveTextEditor();
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-layout');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts', 'application.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/Application Layout/);
          });
        });
      });
    });
    describe("open-spec behavior", function() {
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens controller spec", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-spec');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var specPath;
            specPath = path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'blogs_controller_spec.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(20, 0));
            expect(editor.getPath()).toBe(specPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe BlogsController/);
          });
        });
      });
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens model spec", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-spec');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var specPath;
            specPath = path.join(atom.project.getPaths()[0], 'spec', 'models', 'blog_spec.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(2, 0));
            expect(editor.getPath()).toBe(specPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe Blog /);
          });
        });
      });
      describe("when active editor opens factory", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'factories', 'blogs.rb'));
          });
        });
        return it("opens model spec", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-spec');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var specPath;
            specPath = path.join(atom.project.getPaths()[0], 'spec', 'models', 'blog_spec.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(2, 0));
            expect(editor.getPath()).toBe(specPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe Blog /);
          });
        });
      });
      return describe("when active editor opens helper", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb'));
          });
        });
        return it("opens helper spec", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-spec');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var specPath;
            specPath = path.join(atom.project.getPaths()[0], 'spec', 'helpers', 'blogs_helper_spec.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(12, 0));
            expect(editor.getPath()).toBe(specPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe BlogsHelper/);
          });
        });
      });
    });
    describe("open-test behavior", function() {
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens controller test", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-test');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var testPath;
            testPath = path.join(atom.project.getPaths()[0], 'test', 'controllers', 'blogs_controller_test.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(2, 0));
            expect(editor.getPath()).toBe(testPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe BlogsController/);
          });
        });
      });
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens model test", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-test');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var testPath;
            testPath = path.join(atom.project.getPaths()[0], 'test', 'models', 'blog_test.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(2, 0));
            expect(editor.getPath()).toBe(testPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe Blog /);
          });
        });
      });
      return describe("when active editor opens helper", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb'));
          });
        });
        return it("opens helper test", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-test');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var testPath;
            testPath = path.join(atom.project.getPaths()[0], 'test', 'helpers', 'blogs_helper_test.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(2, 0));
            expect(editor.getPath()).toBe(testPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe BlogsHelper/);
          });
        });
      });
    });
    describe("open-asset behavior", function() {
      describe("when active editor opens view", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts', 'application.html.erb'));
          });
        });
        describe("when cursor's current buffer row contains stylesheet_link_tag", function() {
          describe("enclosed in parentheses", function() {
            return it("opens stylesheet", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(10, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'application.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(10, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/require_self$/);
              });
            });
          });
          describe("unenclosed in parentheses", function() {
            return it("opens stylesheet", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(11, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'application.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(11, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/require_tree/);
              });
            });
          });
          describe("when source includes slash", function() {
            return it("opens stylesheet", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(12, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'application02', 'common.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(1, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/require_self/);
              });
            });
          });
          describe("when source is located in vendor directory", function() {
            return it("opens stylesheet in vendor directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(13, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'vendor', 'assets', 'stylesheets', 'jquery.popular_style.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/it's popular scss file$/);
              });
            });
          });
          describe("when source is located in lib directory", function() {
            return it("opens stylesheet in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(16, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'stylesheets', 'my_style.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/it's my scss file$/);
              });
            });
          });
          return describe("when source is located in public directory", function() {
            return it("opens stylesheet in public directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(14, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'public', 'no_asset_pipeline.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's css in public directory$/);
              });
            });
          });
        });
        return describe("when cursor's current buffer row contains javascript_include_tag", function() {
          describe("enclosed in parentheses", function() {
            return it("opens javascript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(5, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'application01.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(12, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/= require jquery$/);
              });
            });
          });
          describe("unenclosed in parentheses", function() {
            return it("opens javascript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(6, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'application01.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(12, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/= require jquery$/);
              });
            });
          });
          describe("when source includes slash", function() {
            return it("opens javascript in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(7, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'application02', 'common.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/= require jquery$/);
              });
            });
          });
          describe("when source is located in vendor directory", function() {
            return it("opens javascript in vendor directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(8, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'vendor', 'assets', 'javascripts', 'jquery.popular_library.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's popular library$/);
              });
            });
          });
          describe("when source is located in lib directory", function() {
            return it("opens javascript in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(15, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'javascripts', 'my_library.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's my library$/);
              });
            });
          });
          describe("when source is located in public directory", function() {
            return it("opens javascript in public directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(9, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'public', 'no_asset_pipeline.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's in public directory$/);
              });
            });
          });
          return describe("when source's suffix is .erb", function() {
            return it("opens .erb javascript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(17, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'dynamic_script.js.coffee.erb');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# \.erb file$/);
              });
            });
          });
        });
      });
      describe("when active editor opens javascript manifest", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'application01.js'));
          });
        });
        describe("cursor's current buffer row contains require_tree", function() {
          beforeEach(function() {
            editor = atom.workspace.getActiveTextEditor();
            return editor.setCursorBufferPosition(new Point(15, 0));
          });
          return it("shows file paths in required directory and its subdirectories and selects the first", function() {
            atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              var requireDir;
              requireDir = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'shared');
              expect(workspaceElement.querySelectorAll('.select-list li').length).toBe(fs.readdirSync(requireDir).length);
              expect($(workspaceElement).find(".select-list .primary-line:contains(common.js.coffee)")).toExist();
              expect($(workspaceElement).find(".select-list .secondary-line:contains(" + (atom.project.relativize(path.join(requireDir, 'common.js.coffee'))) + ")")).toExist();
              expect($(workspaceElement).find(".select-list .primary-line:contains(subdir.js.coffee)")).toExist();
              expect($(workspaceElement).find(".select-list .secondary-line:contains(" + (atom.project.relativize(path.join(requireDir, 'subdir', 'subdir.js.coffee'))) + ")")).toExist();
              expect($(workspaceElement).find(".select-list li:first")).toHaveClass('two-lines selected');
              return atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
            });
          });
        });
        describe("cursor's current buffer row contains require_directory", function() {
          return beforeEach(function() {
            editor = atom.workspace.getActiveTextEditor();
            return editor.setCursorBufferPosition(new Point(24, 0));
          });
        });
        return describe("cursor's current buffer row contains require", function() {
          describe("when it requires coffeescript with .js suffix", function() {
            return it("opens coffeescript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(22, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'blogs.js.coffee');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# blogs js$/);
              });
            });
          });
          describe("when it requires coffeescript with .js.coffee suffix", function() {
            return it("opens coffeescript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(23, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'blogs.js.coffee');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# blogs js$/);
              });
            });
          });
          describe("when it requires coffeescript without suffix", function() {
            return it("opens coffeescript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(16, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'blogs.js.coffee');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# blogs js$/);
              });
            });
          });
          describe("when it requires javascript without suffix", function() {
            return it("opens javascript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(17, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'pure-js-blogs.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# pure blogs js$/);
              });
            });
          });
          describe("when it requires coffeescript in another directory", function() {
            return it("opens coffeescript in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(18, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'shared', 'common.js.coffee');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# shared coffee$/);
              });
            });
          });
          describe("when it requires javascript in another directory", function() {
            return it("opens javascript in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(19, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'shared', 'pure-js-common.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# shared js$/);
              });
            });
          });
          describe("when it requires javascript in lib directory", function() {
            return it("opens javascript in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(20, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'javascripts', 'my_library.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's my library$/);
              });
            });
          });
          return describe("when it requires javascript in vendor directory", function() {
            return it("opens javascript in vendor directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(21, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'vendor', 'assets', 'javascripts', 'jquery.popular_library.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's popular library$/);
              });
            });
          });
        });
      });
      return describe("when active editor opens stylesheet manifest", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'application.css'));
          });
        });
        return describe("when cursor's current buffer row contains 'require'", function() {
          describe("when it requires scss with .css suffix", function() {
            return it("opens scss", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(12, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'blogs.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's blogs.css$/);
              });
            });
          });
          describe("when it requires scss with .css.scss suffix", function() {
            return it("opens scss", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(13, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'blogs.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's blogs.css$/);
              });
            });
          });
          describe("when it requires css without suffix", function() {
            return it("opens css", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(14, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'pure-css-blogs.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's pure css$/);
              });
            });
          });
          describe("when it requires scss without suffix", function() {
            return it("opens scss", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(15, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'blogs.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's blogs.css$/);
              });
            });
          });
          describe("when it requires scss in another directory", function() {
            return it("opens scss in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(16, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'shared', 'pure-css-common.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's pure css$/);
              });
            });
          });
          describe("when it requires css in another directory", function() {
            return it("opens css in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(17, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'shared', 'common.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's scss$/);
              });
            });
          });
          describe("when it requires scss in lib directory", function() {
            return it("opens scss in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(18, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'stylesheets', 'my_style.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's my scss file$/);
              });
            });
          });
          describe("when it requires css in lib directory", function() {
            return it("opens css in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(19, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'stylesheets', 'pure_css_my_style.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's my css file$/);
              });
            });
          });
          return describe("when it requires scss in vendor directory", function() {
            return it("opens scss in vendor directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(20, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'vendor', 'assets', 'stylesheets', 'jquery.popular_style.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's popular scss file$/);
              });
            });
          });
        });
      });
    });
    describe("open-controller behavior", function() {
      describe("when active editor opens controller and cursor is on include method", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens model concern", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(3, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var concernPath;
            concernPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'concerns', 'blog', 'taggable.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(concernPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module Blog::Taggable$/);
          });
        });
      });
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app/models/blog.rb'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
      describe("when active editor opens controller test", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'test', 'controllers', 'blogs_controller_test.rb'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
      describe("when active editor opens controller spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'blogs_controller_spec.rb'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
      describe("when active editor opens request spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'requests', 'blogs_spec.rb'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
      return describe("when active editor opens view", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'show.html.haml'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
    });
    return describe("open-factory behavior", function() {
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens related factory", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-factory');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var factoryPath;
            factoryPath = path.join(atom.project.getPaths()[0], 'spec', 'factories', 'blogs.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(factoryPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^  factory :blog, :class => 'Blog' do$/);
          });
        });
      });
      return describe("when active editor opens model-spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'models', 'blog_spec.rb'));
          });
        });
        return it("opens related factory", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-factory');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var factoryPath;
            factoryPath = path.join(atom.project.getPaths()[0], 'spec', 'factories', 'blogs.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(factoryPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^  factory :blog, :class => 'Blog' do$/);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FsaG9sdC8uYXRvbS9wYWNrYWdlcy9yYWlscy10cmFuc3BvcnRlci9zcGVjL3JhaWxzLXRyYW5zcG9ydGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlBLE9BQVUsT0FBQSxDQUFRLHNCQUFSLENBQVYsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBSkosQ0FBQTs7QUFBQSxFQU9DLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQVBELENBQUE7O0FBQUEsRUFRQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsMEJBQVIsQ0FSbkIsQ0FBQTs7QUFBQSxFQVVBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxrRUFBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTtBQUFBLElBQ0EsUUFBNkMsRUFBN0MsRUFBQywyQkFBRCxFQUFtQix5QkFBbkIsRUFBbUMsaUJBRG5DLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFFVCxVQUFBLHNCQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBSSxDQUFDLFNBQUwsQ0FBZSxNQUFmLENBQWhCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUR2QyxDQUFBO0FBQUEsTUFFQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsWUFBNUIsRUFBMEMsUUFBMUMsRUFBb0Q7QUFBQSxRQUFBLFdBQUEsRUFBYSxJQUFiO09BQXBELENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsUUFBRCxDQUF0QixDQUhBLENBQUE7QUFBQSxNQUtBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FMbkIsQ0FBQTthQU1BLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixtQkFBOUIsRUFSWDtJQUFBLENBQVgsQ0FIQSxDQUFBO0FBQUEsSUFhQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQSxHQUFBO2FBQ3pDLFFBQUEsQ0FBUyxxRUFBVCxFQUFnRixTQUFBLEdBQUE7ZUFXOUUsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUEsR0FBQTtBQUNwRCxVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMseUNBQXpDLENBQUEsQ0FBQTtBQUFBLFVBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2Qsa0JBRGM7VUFBQSxDQUFoQixDQUZBLENBQUE7aUJBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLGtEQUFBO0FBQUEsWUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsSUFBdEMsRUFBNEMsU0FBNUMsQ0FBZixDQUFBO0FBQUEsWUFDQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsZ0JBQWpCLENBQWtDLGlCQUFsQyxDQUFvRCxDQUFDLE1BQTVELENBQW1FLENBQUMsSUFBcEUsQ0FBeUUsRUFBRSxDQUFDLFdBQUgsQ0FBZSxZQUFmLENBQTRCLENBQUMsTUFBdEcsQ0FEQSxDQUFBO0FBRUE7QUFBQTtpQkFBQSw0Q0FBQTtvQ0FBQTtBQUNFLGNBQUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLElBQXBCLENBQTBCLHNDQUFBLEdBQXNDLFNBQXRDLEdBQWdELEdBQTFFLENBQVAsQ0FBcUYsQ0FBQyxPQUF0RixDQUFBLENBQUEsQ0FBQTtBQUFBLDRCQUNBLE1BQUEsQ0FBTyxDQUFBLENBQUUsZ0JBQUYsQ0FBbUIsQ0FBQyxJQUFwQixDQUEwQix3Q0FBQSxHQUF1QyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBYixDQUF3QixJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsRUFBd0IsU0FBeEIsQ0FBeEIsQ0FBRCxDQUF2QyxHQUFvRyxHQUE5SCxDQUFQLENBQXlJLENBQUMsT0FBMUksQ0FBQSxFQURBLENBREY7QUFBQTs0QkFIRztVQUFBLENBQUwsRUFOb0Q7UUFBQSxDQUF0RCxFQVg4RTtNQUFBLENBQWhGLEVBRHlDO0lBQUEsQ0FBM0MsQ0FiQSxDQUFBO0FBQUEsSUF3Q0EsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTthQUM3QixRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFFBQUEsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7cUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGFBQTdDLEVBQTRELHFCQUE1RCxDQUFwQixFQURjO1lBQUEsQ0FBaEIsRUFEUztVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQUlBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsWUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBREEsQ0FBQTtBQUFBLFlBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw2QkFBekMsQ0FGQSxDQUFBO0FBQUEsWUFLQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsY0FBQSxpQkFBQSxDQUFBO3FCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1lBQUEsQ0FBVCxDQUxBLENBQUE7bUJBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGtCQUFBLFFBQUE7QUFBQSxjQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxPQUE3QyxFQUFzRCxPQUF0RCxFQUErRCxnQkFBL0QsQ0FBWCxDQUFBO0FBQUEsY0FDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGNBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFFBQTlCLENBRkEsQ0FBQTtxQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCwyQkFBOUQsRUFKRztZQUFBLENBQUwsRUFWdUI7VUFBQSxDQUF6QixFQUwwQztRQUFBLENBQTVDLENBQUEsQ0FBQTtlQXFCQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTttQkFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtBQUNkLGNBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhDQUFoQixFQUFnRSxDQUFDLGVBQUQsQ0FBaEUsQ0FBQSxDQUFBO3FCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxhQUE3QyxFQUE0RCxLQUE1RCxFQUFtRSxxQkFBbkUsQ0FBcEIsRUFGYztZQUFBLENBQWhCLEVBRFM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFLQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxZQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQURBLENBQUE7QUFBQSxZQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsNkJBQXpDLENBRkEsQ0FBQTtBQUFBLFlBS0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGNBQUEsaUJBQUEsQ0FBQTtxQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztZQUFBLENBQVQsQ0FMQSxDQUFBO21CQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxrQkFBQSxRQUFBO0FBQUEsY0FBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsT0FBN0MsRUFBc0QsS0FBdEQsRUFBNkQsT0FBN0QsRUFBc0UscUJBQXRFLENBQVgsQ0FBQTtBQUFBLGNBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxjQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQUZBLENBQUE7cUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsaUNBQTlELEVBSkc7WUFBQSxDQUFMLEVBVnVCO1VBQUEsQ0FBekIsRUFObUQ7UUFBQSxDQUFyRCxFQXRCOEM7TUFBQSxDQUFoRCxFQUQ2QjtJQUFBLENBQS9CLENBeENBLENBQUE7QUFBQSxJQXNGQSxRQUFBLENBQVMsMkJBQVQsRUFBc0MsU0FBQSxHQUFBO0FBRXBDLE1BQUEsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtBQUM5QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGFBQTdDLEVBQTRELHFCQUE1RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsUUFBQSxDQUFTLGdFQUFULEVBQTJFLFNBQUEsR0FBQTtpQkFpQnpFLEVBQUEsQ0FBRyxnRkFBSCxFQUFxRixTQUFBLEdBQUE7QUFDbkYsWUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLG9DQUF6QyxDQUFBLENBQUE7QUFBQSxZQUdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO3FCQUNkLGtCQURjO1lBQUEsQ0FBaEIsQ0FIQSxDQUFBO21CQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxrQkFBQSw4QkFBQTtBQUFBLGNBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELENBQVYsQ0FBQTtBQUFBLGNBQ0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLElBQXBCLENBQXlCLGlCQUF6QixDQUEyQyxDQUFDLE1BQW5ELENBQTBELENBQUMsSUFBM0QsQ0FBZ0UsRUFBRSxDQUFDLFdBQUgsQ0FBZSxPQUFmLENBQXVCLENBQUMsTUFBeEYsQ0FEQSxDQUFBO0FBRUE7QUFBQSxtQkFBQSw0Q0FBQTtpQ0FBQTtBQUNFLGdCQUFBLE1BQUEsQ0FBTyxDQUFBLENBQUUsZ0JBQUYsQ0FBbUIsQ0FBQyxJQUFwQixDQUEwQixzQ0FBQSxHQUFzQyxJQUF0QyxHQUEyQyxHQUFyRSxDQUFQLENBQWdGLENBQUMsT0FBakYsQ0FBQSxDQUFBLENBQUE7QUFBQSxnQkFDQSxNQUFBLENBQU8sQ0FBQSxDQUFFLGdCQUFGLENBQW1CLENBQUMsSUFBcEIsQ0FBMEIsd0NBQUEsR0FBdUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQWIsQ0FBd0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBQXhCLENBQUQsQ0FBdkMsR0FBMEYsR0FBcEgsQ0FBUCxDQUErSCxDQUFDLE9BQWhJLENBQUEsQ0FEQSxDQURGO0FBQUEsZUFGQTtBQUFBLGNBTUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLElBQXBCLENBQXlCLHVCQUF6QixDQUFQLENBQXlELENBQUMsV0FBMUQsQ0FBc0Usb0JBQXRFLENBTkEsQ0FBQTtxQkFRQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLG9DQUF6QyxFQVRHO1lBQUEsQ0FBTCxFQVBtRjtVQUFBLENBQXJGLEVBakJ5RTtRQUFBLENBQTNFLEVBTDhDO01BQUEsQ0FBaEQsQ0FBQSxDQUFBO0FBQUEsTUF3Q0EsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFNBQTdDLEVBQXdELHdCQUF4RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsUUFBQSxDQUFTLGdFQUFULEVBQTJFLFNBQUEsR0FBQSxDQUEzRSxFQUwwQztNQUFBLENBQTVDLENBeENBLENBQUE7YUFnRkEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELFNBQXZELENBQXBCLEVBRGM7VUFBQSxDQUFoQixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFJQSxRQUFBLENBQVMsZ0VBQVQsRUFBMkUsU0FBQSxHQUFBLENBQTNFLEVBTHlDO01BQUEsQ0FBM0MsRUFsRm9DO0lBQUEsQ0FBdEMsQ0F0RkEsQ0FBQTtBQUFBLElBOE1BLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsTUFBQSxRQUFBLENBQVMsZ0VBQVQsRUFBMkUsU0FBQSxHQUFBO0FBQ3pFLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTttQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsU0FBdkQsQ0FBcEIsRUFEYztVQUFBLENBQWhCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsVUFLQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxpQkFBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1VBQUEsQ0FBVCxDQUxBLENBQUE7aUJBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFdBQUE7QUFBQSxZQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxVQUF2RCxFQUFtRSxlQUFuRSxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHFCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVZ3QjtRQUFBLENBQTFCLEVBTHlFO01BQUEsQ0FBM0UsQ0FBQSxDQUFBO0FBQUEsTUFzQkEsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtBQUM5QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGFBQTdDLEVBQTRELHFCQUE1RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxTQUFBO0FBQUEsWUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsU0FBdkQsQ0FBWixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxtQ0FBOUQsRUFMRztVQUFBLENBQUwsRUFSd0I7UUFBQSxDQUExQixFQUw4QztNQUFBLENBQWhELENBdEJBLENBQUE7YUEwQ0EsUUFBQSxDQUFTLGdEQUFULEVBQTJELFNBQUEsR0FBQTtBQUN6RCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGFBQTdDLEVBQTRELFFBQTVELEVBQXNFLHFCQUF0RSxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxTQUFBO0FBQUEsWUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsU0FBdkQsQ0FBWixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxtQ0FBOUQsRUFMRztVQUFBLENBQUwsRUFSd0I7UUFBQSxDQUExQixFQUx5RDtNQUFBLENBQTNELEVBM0M4QjtJQUFBLENBQWhDLENBOU1BLENBQUE7QUFBQSxJQThRQyxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxNQUF0QyxFQUE4QyxRQUE5QyxFQUF3RCxjQUF4RCxDQUFwQixFQURjO1FBQUEsQ0FBaEIsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBQUEsQ0FBQTtBQUFBLFFBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsaUJBQUEsQ0FBQTtpQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztRQUFBLENBQVQsQ0FIQSxDQUFBO2VBT0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsU0FBQTtBQUFBLFVBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELFNBQXZELENBQVosQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsbUNBQTlELEVBTEc7UUFBQSxDQUFMLEVBUndCO01BQUEsQ0FBMUIsRUFMOEM7SUFBQSxDQUFoRCxDQTlRRCxDQUFBO0FBQUEsSUFrU0UsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtBQUM5QyxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsTUFBdEMsRUFBOEMsUUFBOUMsRUFBd0QsY0FBeEQsQ0FBcEIsRUFEYztRQUFBLENBQWhCLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUFBLENBQUE7QUFBQSxRQUdBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLGlCQUFBLENBQUE7aUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7UUFBQSxDQUFULENBSEEsQ0FBQTtlQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLFNBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxTQUF2RCxDQUFaLENBQUE7QUFBQSxVQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELG1DQUE5RCxFQUxHO1FBQUEsQ0FBTCxFQVJ3QjtNQUFBLENBQTFCLEVBTDhDO0lBQUEsQ0FBaEQsQ0FsU0YsQ0FBQTtBQUFBLElBc1RFLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLFdBQTlDLEVBQTJELFVBQTNELENBQXBCLEVBRGM7UUFBQSxDQUFoQixFQURTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FBQSxDQUFBO0FBQUEsUUFHQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxpQkFBQSxDQUFBO2lCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1FBQUEsQ0FBVCxDQUhBLENBQUE7ZUFPQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxTQUFBO0FBQUEsVUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsU0FBdkQsQ0FBWixDQUFBO0FBQUEsVUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxtQ0FBOUQsRUFMRztRQUFBLENBQUwsRUFSd0I7TUFBQSxDQUExQixFQUwyQztJQUFBLENBQTdDLENBdFRGLENBQUE7QUFBQSxJQTJVRSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxPQUE3QyxFQUFzRCxPQUF0RCxFQUErRCxlQUEvRCxDQUFwQixFQURjO1FBQUEsQ0FBaEIsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBQUEsQ0FBQTtBQUFBLFFBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsaUJBQUEsQ0FBQTtpQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztRQUFBLENBQVQsQ0FIQSxDQUFBO2VBT0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsU0FBQTtBQUFBLFVBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELFNBQXZELENBQVosQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsbUNBQTlELEVBTEc7UUFBQSxDQUFMLEVBUndCO01BQUEsQ0FBMUIsRUFMd0M7SUFBQSxDQUExQyxDQTNVRixDQUFBO0FBQUEsSUErVkEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixNQUFBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxhQUE3QyxFQUE0RCxxQkFBNUQsQ0FBcEIsRUFEYztVQUFBLENBQWhCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7QUFDekIsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLCtCQUF6QyxDQUFBLENBQUE7QUFBQSxVQUdBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBSEEsQ0FBQTtpQkFPQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsVUFBQTtBQUFBLFlBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFNBQTdDLEVBQXdELGlCQUF4RCxDQUFiLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHNCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVJ5QjtRQUFBLENBQTNCLEVBTDhDO01BQUEsQ0FBaEQsQ0FBQSxDQUFBO0FBQUEsTUFvQkEsUUFBQSxDQUFTLHNDQUFULEVBQWlELFNBQUEsR0FBQTtBQUMvQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLFNBQTlDLEVBQXlELHNCQUF6RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtBQUN6QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsK0JBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxVQUFBO0FBQUEsWUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsU0FBN0MsRUFBd0QsaUJBQXhELENBQWIsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsc0JBQTlELEVBTEc7VUFBQSxDQUFMLEVBUnlCO1FBQUEsQ0FBM0IsRUFMK0M7TUFBQSxDQUFqRCxDQXBCQSxDQUFBO0FBQUEsTUF3Q0EsUUFBQSxDQUFTLHNDQUFULEVBQWlELFNBQUEsR0FBQTtBQUMvQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLFNBQTlDLEVBQXlELHNCQUF6RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtBQUN6QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsK0JBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxVQUFBO0FBQUEsWUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsU0FBN0MsRUFBd0QsaUJBQXhELENBQWIsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsc0JBQTlELEVBTEc7VUFBQSxDQUFMLEVBUnlCO1FBQUEsQ0FBM0IsRUFMK0M7TUFBQSxDQUFqRCxDQXhDQSxDQUFBO0FBQUEsTUE0REEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELFNBQXZELENBQXBCLEVBRGM7VUFBQSxDQUFoQixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFJQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QywrQkFBekMsQ0FBQSxDQUFBO0FBQUEsVUFHQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxpQkFBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1VBQUEsQ0FBVCxDQUhBLENBQUE7aUJBT0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFVBQUE7QUFBQSxZQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxTQUE3QyxFQUF3RCxpQkFBeEQsQ0FBYixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxzQkFBOUQsRUFMRztVQUFBLENBQUwsRUFSeUI7UUFBQSxDQUEzQixFQUx5QztNQUFBLENBQTNDLENBNURBLENBQUE7YUFnRkEsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELEVBQStELGVBQS9ELENBQXBCLEVBRGM7VUFBQSxDQUFoQixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFJQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QywrQkFBekMsQ0FBQSxDQUFBO0FBQUEsVUFHQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxpQkFBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1VBQUEsQ0FBVCxDQUhBLENBQUE7aUJBT0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFVBQUE7QUFBQSxZQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxTQUE3QyxFQUF3RCxpQkFBeEQsQ0FBYixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxzQkFBOUQsRUFMRztVQUFBLENBQUwsRUFSeUI7UUFBQSxDQUEzQixFQUx3QztNQUFBLENBQTFDLEVBakYrQjtJQUFBLENBQWpDLENBL1ZBLENBQUE7QUFBQSxJQW9jQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxPQUE3QyxFQUFzRCxPQUF0RCxFQUErRCxlQUEvRCxDQUFwQixFQURjO1FBQUEsQ0FBaEIsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFJQSxRQUFBLENBQVMseURBQVQsRUFBb0UsU0FBQSxHQUFBO2VBQ2xFLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyx5Q0FBekMsQ0FGQSxDQUFBO0FBQUEsVUFLQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxpQkFBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1VBQUEsQ0FBVCxDQUxBLENBQUE7aUJBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFdBQUE7QUFBQSxZQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxPQUE3QyxFQUFzRCxPQUF0RCxFQUErRCxnQkFBL0QsQ0FBZCxDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFdBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxnQkFBOUQsRUFMRztVQUFBLENBQUwsRUFWMkI7UUFBQSxDQUE3QixFQURrRTtNQUFBLENBQXBFLENBSkEsQ0FBQTtBQUFBLE1Bc0JBLFFBQUEsQ0FBUyw0RUFBVCxFQUF1RixTQUFBLEdBQUE7ZUFDckYsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlDQUF6QyxDQUZBLENBQUE7QUFBQSxVQUtBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBTEEsQ0FBQTtpQkFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELEVBQStELGdCQUEvRCxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGdCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVYyQjtRQUFBLENBQTdCLEVBRHFGO01BQUEsQ0FBdkYsQ0F0QkEsQ0FBQTtBQUFBLE1Bd0NBLFFBQUEsQ0FBUyx5RUFBVCxFQUFvRixTQUFBLEdBQUE7ZUFDbEYsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlDQUF6QyxDQUZBLENBQUE7QUFBQSxVQUtBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBTEEsQ0FBQTtpQkFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELEVBQStELGdCQUEvRCxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGdCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVYyQjtRQUFBLENBQTdCLEVBRGtGO01BQUEsQ0FBcEYsQ0F4Q0EsQ0FBQTtBQUFBLE1BMERBLFFBQUEsQ0FBUywrRUFBVCxFQUEwRixTQUFBLEdBQUE7ZUFDeEYsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlDQUF6QyxDQUZBLENBQUE7QUFBQSxVQUtBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBTEEsQ0FBQTtpQkFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELFFBQXRELEVBQWdFLGdCQUFoRSxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHVCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVZrQztRQUFBLENBQXBDLEVBRHdGO01BQUEsQ0FBMUYsQ0ExREEsQ0FBQTtBQUFBLE1BNEVBLFFBQUEsQ0FBUyx5REFBVCxFQUFvRSxTQUFBLEdBQUE7ZUFDbEUsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlDQUF6QyxDQUZBLENBQUE7QUFBQSxVQUtBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBTEEsQ0FBQTtpQkFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELEVBQStELGtCQUEvRCxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGtCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVYyQjtRQUFBLENBQTdCLEVBRGtFO01BQUEsQ0FBcEUsQ0E1RUEsQ0FBQTtBQUFBLE1BOEZBLFFBQUEsQ0FBUyxxRkFBVCxFQUFnRyxTQUFBLEdBQUE7ZUFDOUYsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlDQUF6QyxDQUZBLENBQUE7QUFBQSxVQUtBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBTEEsQ0FBQTtpQkFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELEVBQStELGtCQUEvRCxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGtCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVYyQjtRQUFBLENBQTdCLEVBRDhGO01BQUEsQ0FBaEcsQ0E5RkEsQ0FBQTtBQUFBLE1BZ0hBLFFBQUEsQ0FBUyxzRkFBVCxFQUFpRyxTQUFBLEdBQUE7ZUFDL0YsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlDQUF6QyxDQUZBLENBQUE7QUFBQSxVQUtBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBTEEsQ0FBQTtpQkFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELEVBQStELGtCQUEvRCxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGtCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVYyQjtRQUFBLENBQTdCLEVBRCtGO01BQUEsQ0FBakcsQ0FoSEEsQ0FBQTthQWtJQSxRQUFBLENBQVMsb0RBQVQsRUFBK0QsU0FBQSxHQUFBO2VBQzdELEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyx5Q0FBekMsQ0FGQSxDQUFBO0FBQUEsVUFLQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxpQkFBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1VBQUEsQ0FBVCxDQUxBLENBQUE7aUJBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFdBQUE7QUFBQSxZQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxPQUE3QyxFQUFzRCxPQUF0RCxFQUErRCxrQkFBL0QsQ0FBZCxDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFdBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxrQkFBOUQsRUFMRztVQUFBLENBQUwsRUFWMkI7UUFBQSxDQUE3QixFQUQ2RDtNQUFBLENBQS9ELEVBbkl3QztJQUFBLENBQTFDLENBcGNBLENBQUE7QUFBQSxJQXlsQkEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsUUFBQSxDQUFTLHlEQUFULEVBQW9FLFNBQUEsR0FBQTtBQUNsRSxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGFBQTdDLEVBQTRELHFCQUE1RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLCtCQUF6QyxDQUZBLENBQUE7QUFBQSxVQUtBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBTEEsQ0FBQTtpQkFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELFNBQXRELEVBQWlFLGtCQUFqRSxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGdCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVYyQjtRQUFBLENBQTdCLEVBTGtFO01BQUEsQ0FBcEUsQ0FBQSxDQUFBO0FBQUEsTUFzQkEsUUFBQSxDQUFTLDhDQUFULEVBQXlELFNBQUEsR0FBQTtBQUN2RCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGFBQTdDLEVBQTRELG1CQUE1RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLG9EQUFILEVBQXlELFNBQUEsR0FBQTtBQUN2RCxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLCtCQUF6QyxDQURBLENBQUE7QUFBQSxVQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBSkEsQ0FBQTtpQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELFNBQXRELEVBQWlFLGNBQWpFLENBQWQsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsWUFBOUQsRUFMRztVQUFBLENBQUwsRUFUdUQ7UUFBQSxDQUF6RCxFQUx1RDtNQUFBLENBQXpELENBdEJBLENBQUE7YUEyQ0EsUUFBQSxDQUFTLGtEQUFULEVBQTZELFNBQUEsR0FBQTtBQUMzRCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGFBQTdDLEVBQTRELG9CQUE1RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLCtCQUF6QyxDQURBLENBQUE7QUFBQSxVQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBSkEsQ0FBQTtpQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELFNBQXRELEVBQWlFLHNCQUFqRSxDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELG9CQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVQ2QztRQUFBLENBQS9DLEVBTDJEO01BQUEsQ0FBN0QsRUE1Q3NCO0lBQUEsQ0FBeEIsQ0F6bEJBLENBQUE7QUFBQSxJQTJwQkEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixNQUFBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxhQUE3QyxFQUE0RCxxQkFBNUQsQ0FBcEIsRUFEYztVQUFBLENBQWhCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDZCQUF6QyxDQUFBLENBQUE7QUFBQSxVQUVBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBRkEsQ0FBQTtpQkFNQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsUUFBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLGFBQTlDLEVBQTZELDBCQUE3RCxDQUFYLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsUUFBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELDJCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVAwQjtRQUFBLENBQTVCLEVBTDhDO01BQUEsQ0FBaEQsQ0FBQSxDQUFBO0FBQUEsTUFtQkEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELFNBQXZELENBQXBCLEVBRGM7VUFBQSxDQUFoQixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFJQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw2QkFBekMsQ0FBQSxDQUFBO0FBQUEsVUFFQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxpQkFBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1VBQUEsQ0FBVCxDQUZBLENBQUE7aUJBTUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFFBQUE7QUFBQSxZQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxNQUF0QyxFQUE4QyxRQUE5QyxFQUF3RCxjQUF4RCxDQUFYLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsUUFBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGlCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVBxQjtRQUFBLENBQXZCLEVBTHlDO01BQUEsQ0FBM0MsQ0FuQkEsQ0FBQTtBQUFBLE1Bc0NBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxNQUF0QyxFQUE4QyxXQUE5QyxFQUEyRCxVQUEzRCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUNyQixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsNkJBQXpDLENBQUEsQ0FBQTtBQUFBLFVBRUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FGQSxDQUFBO2lCQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxRQUFBO0FBQUEsWUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsTUFBdEMsRUFBOEMsUUFBOUMsRUFBd0QsY0FBeEQsQ0FBWCxDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFFBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxpQkFBOUQsRUFMRztVQUFBLENBQUwsRUFQcUI7UUFBQSxDQUF2QixFQUwyQztNQUFBLENBQTdDLENBdENBLENBQUE7YUF5REEsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFNBQTdDLEVBQXdELGlCQUF4RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTtBQUN0QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsNkJBQXpDLENBQUEsQ0FBQTtBQUFBLFVBRUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FGQSxDQUFBO2lCQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxRQUFBO0FBQUEsWUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsTUFBdEMsRUFBOEMsU0FBOUMsRUFBeUQsc0JBQXpELENBQVgsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsdUJBQTlELEVBTEc7VUFBQSxDQUFMLEVBUHNCO1FBQUEsQ0FBeEIsRUFMMEM7TUFBQSxDQUE1QyxFQTFENkI7SUFBQSxDQUEvQixDQTNwQkEsQ0FBQTtBQUFBLElBd3VCQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLE1BQUEsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtBQUM5QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGFBQTdDLEVBQTRELHFCQUE1RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUMxQixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsNkJBQXpDLENBQUEsQ0FBQTtBQUFBLFVBRUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FGQSxDQUFBO2lCQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxRQUFBO0FBQUEsWUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsTUFBdEMsRUFBOEMsYUFBOUMsRUFBNkQsMEJBQTdELENBQVgsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsMkJBQTlELEVBTEc7VUFBQSxDQUFMLEVBUDBCO1FBQUEsQ0FBNUIsRUFMOEM7TUFBQSxDQUFoRCxDQUFBLENBQUE7QUFBQSxNQW1CQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTttQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsU0FBdkQsQ0FBcEIsRUFEYztVQUFBLENBQWhCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7QUFDckIsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDZCQUF6QyxDQUFBLENBQUE7QUFBQSxVQUVBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBRkEsQ0FBQTtpQkFNQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsUUFBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLFFBQTlDLEVBQXdELGNBQXhELENBQVgsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsaUJBQTlELEVBTEc7VUFBQSxDQUFMLEVBUHFCO1FBQUEsQ0FBdkIsRUFMeUM7TUFBQSxDQUEzQyxDQW5CQSxDQUFBO2FBc0NBLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxTQUE3QyxFQUF3RCxpQkFBeEQsQ0FBcEIsRUFEYztVQUFBLENBQWhCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDZCQUF6QyxDQUFBLENBQUE7QUFBQSxVQUVBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBRkEsQ0FBQTtpQkFNQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsUUFBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLFNBQTlDLEVBQXlELHNCQUF6RCxDQUFYLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsUUFBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHVCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVBzQjtRQUFBLENBQXhCLEVBTDBDO01BQUEsQ0FBNUMsRUF2QzZCO0lBQUEsQ0FBL0IsQ0F4dUJBLENBQUE7QUFBQSxJQWt5QkEsUUFBQSxDQUFTLHFCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixNQUFBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxPQUE3QyxFQUFzRCxTQUF0RCxFQUFpRSxzQkFBakUsQ0FBcEIsRUFEYztVQUFBLENBQWhCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBSUEsUUFBQSxDQUFTLCtEQUFULEVBQTBFLFNBQUEsR0FBQTtBQUN4RSxVQUFBLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7bUJBQ2xDLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7QUFDckIsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGlCQUF0RSxDQUFaLENBQUE7QUFBQSxnQkFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGdCQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQUZBLENBQUE7QUFBQSxnQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO3VCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGVBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVHFCO1lBQUEsQ0FBdkIsRUFEa0M7VUFBQSxDQUFwQyxDQUFBLENBQUE7QUFBQSxVQWlCQSxRQUFBLENBQVMsMkJBQVQsRUFBc0MsU0FBQSxHQUFBO21CQUNwQyxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxhQUF2RCxFQUFzRSxpQkFBdEUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxjQUE5RCxFQUxHO2NBQUEsQ0FBTCxFQVRxQjtZQUFBLENBQXZCLEVBRG9DO1VBQUEsQ0FBdEMsQ0FqQkEsQ0FBQTtBQUFBLFVBa0NBLFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBLEdBQUE7bUJBQ3JDLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7QUFDckIsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGVBQXRFLEVBQXVGLFlBQXZGLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsY0FBOUQsRUFMRztjQUFBLENBQUwsRUFUcUI7WUFBQSxDQUF2QixFQURxQztVQUFBLENBQXZDLENBbENBLENBQUE7QUFBQSxVQW1EQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQSxHQUFBO21CQUNyRCxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxRQUF0QyxFQUFnRCxRQUFoRCxFQUEwRCxhQUExRCxFQUF5RSwrQkFBekUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCx5QkFBOUQsRUFMRztjQUFBLENBQUwsRUFUeUM7WUFBQSxDQUEzQyxFQURxRDtVQUFBLENBQXZELENBbkRBLENBQUE7QUFBQSxVQW9FQSxRQUFBLENBQVMseUNBQVQsRUFBb0QsU0FBQSxHQUFBO21CQUNsRCxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxhQUF2RCxFQUFzRSxtQkFBdEUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxvQkFBOUQsRUFMRztjQUFBLENBQUwsRUFUc0M7WUFBQSxDQUF4QyxFQURrRDtVQUFBLENBQXBELENBcEVBLENBQUE7aUJBcUZBLFFBQUEsQ0FBUyw0Q0FBVCxFQUF1RCxTQUFBLEdBQUE7bUJBQ3JELEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLFFBQXRDLEVBQWdELHVCQUFoRCxDQUFaLENBQUE7QUFBQSxnQkFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGdCQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxnQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO3VCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHFDQUE5RCxFQUxHO2NBQUEsQ0FBTCxFQVR5QztZQUFBLENBQTNDLEVBRHFEO1VBQUEsQ0FBdkQsRUF0RndFO1FBQUEsQ0FBMUUsQ0FKQSxDQUFBO2VBMkdBLFFBQUEsQ0FBUyxrRUFBVCxFQUE2RSxTQUFBLEdBQUE7QUFDM0UsVUFBQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO21CQUNsQyxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxhQUF2RCxFQUFzRSxrQkFBdEUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCx3QkFBOUQsRUFMRztjQUFBLENBQUwsRUFUcUI7WUFBQSxDQUF2QixFQURrQztVQUFBLENBQXBDLENBQUEsQ0FBQTtBQUFBLFVBaUJBLFFBQUEsQ0FBUywyQkFBVCxFQUFzQyxTQUFBLEdBQUE7bUJBQ3BDLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7QUFDckIsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGtCQUF0RSxDQUFaLENBQUE7QUFBQSxnQkFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGdCQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQUZBLENBQUE7QUFBQSxnQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO3VCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHdCQUE5RCxFQUxHO2NBQUEsQ0FBTCxFQVRxQjtZQUFBLENBQXZCLEVBRG9DO1VBQUEsQ0FBdEMsQ0FqQkEsQ0FBQTtBQUFBLFVBa0NBLFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBLEdBQUE7bUJBQ3JDLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGVBQXRFLEVBQXVGLFdBQXZGLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsd0JBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVDBDO1lBQUEsQ0FBNUMsRUFEcUM7VUFBQSxDQUF2QyxDQWxDQSxDQUFBO0FBQUEsVUFtREEsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUEsR0FBQTttQkFDckQsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsY0FDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUZBLENBQUE7QUFBQSxjQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxnQkFBQSxpQkFBQSxDQUFBO3VCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO2NBQUEsQ0FBVCxDQUpBLENBQUE7cUJBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLFNBQUE7QUFBQSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsUUFBdEMsRUFBZ0QsUUFBaEQsRUFBMEQsYUFBMUQsRUFBeUUsMkJBQXpFLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsNkJBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVHlDO1lBQUEsQ0FBM0MsRUFEcUQ7VUFBQSxDQUF2RCxDQW5EQSxDQUFBO0FBQUEsVUFvRUEsUUFBQSxDQUFTLHlDQUFULEVBQW9ELFNBQUEsR0FBQTttQkFDbEQsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsY0FDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUZBLENBQUE7QUFBQSxjQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxnQkFBQSxpQkFBQSxDQUFBO3VCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO2NBQUEsQ0FBVCxDQUpBLENBQUE7cUJBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLFNBQUE7QUFBQSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsYUFBdkQsRUFBc0UsZUFBdEUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCx3QkFBOUQsRUFMRztjQUFBLENBQUwsRUFUc0M7WUFBQSxDQUF4QyxFQURrRDtVQUFBLENBQXBELENBcEVBLENBQUE7QUFBQSxVQXFGQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQSxHQUFBO21CQUNyRCxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxRQUF0QyxFQUFnRCxzQkFBaEQsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxpQ0FBOUQsRUFMRztjQUFBLENBQUwsRUFUeUM7WUFBQSxDQUEzQyxFQURxRDtVQUFBLENBQXZELENBckZBLENBQUE7aUJBc0dBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7bUJBQ3ZDLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLDhCQUF0RSxDQUFaLENBQUE7QUFBQSxnQkFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGdCQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxnQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO3VCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGdCQUE5RCxFQUxHO2NBQUEsQ0FBTCxFQVQwQjtZQUFBLENBQTVCLEVBRHVDO1VBQUEsQ0FBekMsRUF2RzJFO1FBQUEsQ0FBN0UsRUE1R3dDO01BQUEsQ0FBMUMsQ0FBQSxDQUFBO0FBQUEsTUFvT0EsUUFBQSxDQUFTLDhDQUFULEVBQXlELFNBQUEsR0FBQTtBQUN2RCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGtCQUF0RSxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFJQSxRQUFBLENBQVMsbURBQVQsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7bUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLEVBRlM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFvQkEsRUFBQSxDQUFHLHFGQUFILEVBQTBGLFNBQUEsR0FBQTtBQUN4RixZQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBQUEsQ0FBQTtBQUFBLFlBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7cUJBQ2Qsa0JBRGM7WUFBQSxDQUFoQixDQUhBLENBQUE7bUJBTUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGtCQUFBLFVBQUE7QUFBQSxjQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxhQUF2RCxFQUFzRSxRQUF0RSxDQUFiLENBQUE7QUFBQSxjQUNBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxnQkFBakIsQ0FBa0MsaUJBQWxDLENBQW9ELENBQUMsTUFBNUQsQ0FBbUUsQ0FBQyxJQUFwRSxDQUF5RSxFQUFFLENBQUMsV0FBSCxDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxNQUFwRyxDQURBLENBQUE7QUFBQSxjQUdBLE1BQUEsQ0FBTyxDQUFBLENBQUUsZ0JBQUYsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5Qix1REFBekIsQ0FBUCxDQUF5RixDQUFDLE9BQTFGLENBQUEsQ0FIQSxDQUFBO0FBQUEsY0FJQSxNQUFBLENBQU8sQ0FBQSxDQUFFLGdCQUFGLENBQW1CLENBQUMsSUFBcEIsQ0FBMEIsd0NBQUEsR0FBdUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQWIsQ0FBd0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLEVBQXNCLGtCQUF0QixDQUF4QixDQUFELENBQXZDLEdBQTJHLEdBQXJJLENBQVAsQ0FBZ0osQ0FBQyxPQUFqSixDQUFBLENBSkEsQ0FBQTtBQUFBLGNBTUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLElBQXBCLENBQXlCLHVEQUF6QixDQUFQLENBQXlGLENBQUMsT0FBMUYsQ0FBQSxDQU5BLENBQUE7QUFBQSxjQU9BLE1BQUEsQ0FBTyxDQUFBLENBQUUsZ0JBQUYsQ0FBbUIsQ0FBQyxJQUFwQixDQUEwQix3Q0FBQSxHQUF1QyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBYixDQUF3QixJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsRUFBc0IsUUFBdEIsRUFBZ0Msa0JBQWhDLENBQXhCLENBQUQsQ0FBdkMsR0FBcUgsR0FBL0ksQ0FBUCxDQUEwSixDQUFDLE9BQTNKLENBQUEsQ0FQQSxDQUFBO0FBQUEsY0FTQSxNQUFBLENBQU8sQ0FBQSxDQUFFLGdCQUFGLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsdUJBQXpCLENBQVAsQ0FBeUQsQ0FBQyxXQUExRCxDQUFzRSxvQkFBdEUsQ0FUQSxDQUFBO3FCQVdBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLEVBWkc7WUFBQSxDQUFMLEVBUHdGO1VBQUEsQ0FBMUYsRUFyQjREO1FBQUEsQ0FBOUQsQ0FKQSxDQUFBO0FBQUEsUUE4Q0EsUUFBQSxDQUFTLHdEQUFULEVBQW1FLFNBQUEsR0FBQTtpQkFDakUsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7bUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLEVBRlM7VUFBQSxDQUFYLEVBRGlFO1FBQUEsQ0FBbkUsQ0E5Q0EsQ0FBQTtlQXVGQSxRQUFBLENBQVMsOENBQVQsRUFBeUQsU0FBQSxHQUFBO0FBQ3ZELFVBQUEsUUFBQSxDQUFTLCtDQUFULEVBQTBELFNBQUEsR0FBQTttQkFDeEQsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsY0FDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUZBLENBQUE7QUFBQSxjQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxnQkFBQSxpQkFBQSxDQUFBO3VCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO2NBQUEsQ0FBVCxDQUpBLENBQUE7cUJBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLFNBQUE7QUFBQSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsYUFBdkQsRUFBc0UsaUJBQXRFLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsY0FBOUQsRUFMRztjQUFBLENBQUwsRUFUdUI7WUFBQSxDQUF6QixFQUR3RDtVQUFBLENBQTFELENBQUEsQ0FBQTtBQUFBLFVBaUJBLFFBQUEsQ0FBUyxzREFBVCxFQUFpRSxTQUFBLEdBQUE7bUJBQy9ELEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGlCQUF0RSxDQUFaLENBQUE7QUFBQSxnQkFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGdCQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxnQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO3VCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELGNBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVHVCO1lBQUEsQ0FBekIsRUFEK0Q7VUFBQSxDQUFqRSxDQWpCQSxDQUFBO0FBQUEsVUFrQ0EsUUFBQSxDQUFTLDhDQUFULEVBQXlELFNBQUEsR0FBQTttQkFDdkQsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsY0FDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUZBLENBQUE7QUFBQSxjQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxnQkFBQSxpQkFBQSxDQUFBO3VCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO2NBQUEsQ0FBVCxDQUpBLENBQUE7cUJBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLFNBQUE7QUFBQSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsYUFBdkQsRUFBc0UsaUJBQXRFLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsY0FBOUQsRUFMRztjQUFBLENBQUwsRUFUdUI7WUFBQSxDQUF6QixFQUR1RDtVQUFBLENBQXpELENBbENBLENBQUE7QUFBQSxVQW1EQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQSxHQUFBO21CQUNyRCxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxhQUF2RCxFQUFzRSxrQkFBdEUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxtQkFBOUQsRUFMRztjQUFBLENBQUwsRUFUcUI7WUFBQSxDQUF2QixFQURxRDtVQUFBLENBQXZELENBbkRBLENBQUE7QUFBQSxVQW9FQSxRQUFBLENBQVMsb0RBQVQsRUFBK0QsU0FBQSxHQUFBO21CQUM3RCxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxhQUF2RCxFQUFzRSxRQUF0RSxFQUFnRixrQkFBaEYsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxtQkFBOUQsRUFMRztjQUFBLENBQUwsRUFUNEM7WUFBQSxDQUE5QyxFQUQ2RDtVQUFBLENBQS9ELENBcEVBLENBQUE7QUFBQSxVQXFGQSxRQUFBLENBQVMsa0RBQVQsRUFBNkQsU0FBQSxHQUFBO21CQUMzRCxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxhQUF2RCxFQUFzRSxRQUF0RSxFQUFnRixtQkFBaEYsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxlQUE5RCxFQUxHO2NBQUEsQ0FBTCxFQVQwQztZQUFBLENBQTVDLEVBRDJEO1VBQUEsQ0FBN0QsQ0FyRkEsQ0FBQTtBQUFBLFVBc0dBLFFBQUEsQ0FBUyw4Q0FBVCxFQUF5RCxTQUFBLEdBQUE7bUJBQ3ZELEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGVBQXRFLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsd0JBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVHNDO1lBQUEsQ0FBeEMsRUFEdUQ7VUFBQSxDQUF6RCxDQXRHQSxDQUFBO2lCQXVIQSxRQUFBLENBQVMsaURBQVQsRUFBNEQsU0FBQSxHQUFBO21CQUMxRCxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxRQUF0QyxFQUFnRCxRQUFoRCxFQUEwRCxhQUExRCxFQUF5RSwyQkFBekUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCw2QkFBOUQsRUFMRztjQUFBLENBQUwsRUFUeUM7WUFBQSxDQUEzQyxFQUQwRDtVQUFBLENBQTVELEVBeEh1RDtRQUFBLENBQXpELEVBeEZ1RDtNQUFBLENBQXpELENBcE9BLENBQUE7YUFxY0EsUUFBQSxDQUFTLDhDQUFULEVBQXlELFNBQUEsR0FBQTtBQUN2RCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGlCQUF0RSxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsUUFBQSxDQUFTLHFEQUFULEVBQWdFLFNBQUEsR0FBQTtBQUM5RCxVQUFBLFFBQUEsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFBLEdBQUE7bUJBQ2pELEVBQUEsQ0FBRyxZQUFILEVBQWlCLFNBQUEsR0FBQTtBQUNmLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFBdEUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCx1QkFBOUQsRUFMRztjQUFBLENBQUwsRUFUZTtZQUFBLENBQWpCLEVBRGlEO1VBQUEsQ0FBbkQsQ0FBQSxDQUFBO0FBQUEsVUFpQkEsUUFBQSxDQUFTLDZDQUFULEVBQXdELFNBQUEsR0FBQTttQkFDdEQsRUFBQSxDQUFHLFlBQUgsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGdCQUF0RSxDQUFaLENBQUE7QUFBQSxnQkFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGdCQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxnQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO3VCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHVCQUE5RCxFQUxHO2NBQUEsQ0FBTCxFQVRlO1lBQUEsQ0FBakIsRUFEc0Q7VUFBQSxDQUF4RCxDQWpCQSxDQUFBO0FBQUEsVUFrQ0EsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTttQkFDOUMsRUFBQSxDQUFHLFdBQUgsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLG9CQUF0RSxDQUFaLENBQUE7QUFBQSxnQkFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGdCQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxnQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO3VCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHNCQUE5RCxFQUxHO2NBQUEsQ0FBTCxFQVRjO1lBQUEsQ0FBaEIsRUFEOEM7VUFBQSxDQUFoRCxDQWxDQSxDQUFBO0FBQUEsVUFtREEsUUFBQSxDQUFTLHNDQUFULEVBQWlELFNBQUEsR0FBQTttQkFDL0MsRUFBQSxDQUFHLFlBQUgsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsY0FBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQW5DLENBREEsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsQ0FGQSxDQUFBO0FBQUEsY0FJQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsaUJBQUEsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztjQUFBLENBQVQsQ0FKQSxDQUFBO3FCQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxTQUFBO0FBQUEsZ0JBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLFFBQTdDLEVBQXVELGFBQXZELEVBQXNFLGdCQUF0RSxDQUFaLENBQUE7QUFBQSxnQkFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLGdCQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxnQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsQ0FIQSxDQUFBO3VCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHVCQUE5RCxFQUxHO2NBQUEsQ0FBTCxFQVRlO1lBQUEsQ0FBakIsRUFEK0M7VUFBQSxDQUFqRCxDQW5EQSxDQUFBO0FBQUEsVUFvRUEsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUEsR0FBQTttQkFDckQsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsY0FDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUZBLENBQUE7QUFBQSxjQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxnQkFBQSxpQkFBQSxDQUFBO3VCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO2NBQUEsQ0FBVCxDQUpBLENBQUE7cUJBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLFNBQUE7QUFBQSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsYUFBdkQsRUFBc0UsUUFBdEUsRUFBZ0YscUJBQWhGLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsc0JBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVG9DO1lBQUEsQ0FBdEMsRUFEcUQ7VUFBQSxDQUF2RCxDQXBFQSxDQUFBO0FBQUEsVUFxRkEsUUFBQSxDQUFTLDJDQUFULEVBQXNELFNBQUEsR0FBQTttQkFDcEQsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsY0FDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUZBLENBQUE7QUFBQSxjQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxnQkFBQSxpQkFBQSxDQUFBO3VCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO2NBQUEsQ0FBVCxDQUpBLENBQUE7cUJBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLFNBQUE7QUFBQSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsYUFBdkQsRUFBc0UsUUFBdEUsRUFBZ0YsaUJBQWhGLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsa0JBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVG1DO1lBQUEsQ0FBckMsRUFEb0Q7VUFBQSxDQUF0RCxDQXJGQSxDQUFBO0FBQUEsVUFzR0EsUUFBQSxDQUFTLHdDQUFULEVBQW1ELFNBQUEsR0FBQTttQkFDakQsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsY0FDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUZBLENBQUE7QUFBQSxjQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxnQkFBQSxpQkFBQSxDQUFBO3VCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO2NBQUEsQ0FBVCxDQUpBLENBQUE7cUJBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLFNBQUE7QUFBQSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsYUFBdkQsRUFBc0UsbUJBQXRFLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsMEJBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVGdDO1lBQUEsQ0FBbEMsRUFEaUQ7VUFBQSxDQUFuRCxDQXRHQSxDQUFBO0FBQUEsVUF1SEEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUEsR0FBQTttQkFDaEQsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTtBQUMvQixjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsY0FDQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBbkMsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxDQUZBLENBQUE7QUFBQSxjQUlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxnQkFBQSxpQkFBQSxDQUFBO3VCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO2NBQUEsQ0FBVCxDQUpBLENBQUE7cUJBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLFNBQUE7QUFBQSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsUUFBN0MsRUFBdUQsYUFBdkQsRUFBc0UsdUJBQXRFLENBQVosQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsZ0JBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLGdCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7dUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQseUJBQTlELEVBTEc7Y0FBQSxDQUFMLEVBVCtCO1lBQUEsQ0FBakMsRUFEZ0Q7VUFBQSxDQUFsRCxDQXZIQSxDQUFBO2lCQXdJQSxRQUFBLENBQVMsMkNBQVQsRUFBc0QsU0FBQSxHQUFBO21CQUNwRCxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLGNBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUFuQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLENBRkEsQ0FBQTtBQUFBLGNBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGdCQUFBLGlCQUFBLENBQUE7dUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7Y0FBQSxDQUFULENBSkEsQ0FBQTtxQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsU0FBQTtBQUFBLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxRQUF0QyxFQUFnRCxRQUFoRCxFQUEwRCxhQUExRCxFQUF5RSwrQkFBekUsQ0FBWixDQUFBO0FBQUEsZ0JBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxnQkFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsZ0JBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTt1QkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCwrQkFBOUQsRUFMRztjQUFBLENBQUwsRUFUbUM7WUFBQSxDQUFyQyxFQURvRDtVQUFBLENBQXRELEVBekk4RDtRQUFBLENBQWhFLEVBTHVEO01BQUEsQ0FBekQsRUF0YytCO0lBQUEsQ0FBakMsQ0FseUJBLENBQUE7QUFBQSxJQXU0Q0EsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxNQUFBLFFBQUEsQ0FBUyxxRUFBVCxFQUFnRixTQUFBLEdBQUE7QUFDOUUsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxhQUE3QyxFQUE0RCxxQkFBNUQsQ0FBcEIsRUFEYztVQUFBLENBQWhCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxtQ0FBekMsQ0FGQSxDQUFBO0FBQUEsVUFLQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxpQkFBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1VBQUEsQ0FBVCxDQUxBLENBQUE7aUJBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFdBQUE7QUFBQSxZQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxhQUE3QyxFQUE0RCxVQUE1RCxFQUF3RSxNQUF4RSxFQUFnRixhQUFoRixDQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBbUMsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsb0JBQXZCLENBQUEsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELHlCQUE5RCxFQUxHO1VBQUEsQ0FBTCxFQVZ3QjtRQUFBLENBQTFCLEVBTDhFO01BQUEsQ0FBaEYsQ0FBQSxDQUFBO0FBQUEsTUFzQkEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLG9CQUF0QyxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsbUNBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxTQUFBO0FBQUEsWUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsYUFBN0MsRUFBNEQscUJBQTVELENBQVosQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsaURBQTlELEVBTEc7VUFBQSxDQUFMLEVBUjZCO1FBQUEsQ0FBL0IsRUFMeUM7TUFBQSxDQUEzQyxDQXRCQSxDQUFBO0FBQUEsTUEwQ0EsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtBQUNuRCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLGFBQTlDLEVBQTZELDBCQUE3RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsbUNBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxTQUFBO0FBQUEsWUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsYUFBN0MsRUFBNEQscUJBQTVELENBQVosQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsaURBQTlELEVBTEc7VUFBQSxDQUFMLEVBUjZCO1FBQUEsQ0FBL0IsRUFMbUQ7TUFBQSxDQUFyRCxDQTFDQSxDQUFBO0FBQUEsTUE4REEsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtBQUNuRCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLGFBQTlDLEVBQTZELDBCQUE3RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsbUNBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxTQUFBO0FBQUEsWUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsYUFBN0MsRUFBNEQscUJBQTVELENBQVosQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsaURBQTlELEVBTEc7VUFBQSxDQUFMLEVBUjZCO1FBQUEsQ0FBL0IsRUFMbUQ7TUFBQSxDQUFyRCxDQTlEQSxDQUFBO0FBQUEsTUFrRkEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUEsR0FBQTtBQUNoRCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLFVBQTlDLEVBQTBELGVBQTFELENBQXBCLEVBRGM7VUFBQSxDQUFoQixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFJQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxtQ0FBekMsQ0FBQSxDQUFBO0FBQUEsVUFHQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxpQkFBQSxDQUFBO21CQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLEtBQW9ELEVBRjdDO1VBQUEsQ0FBVCxDQUhBLENBQUE7aUJBT0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFNBQUE7QUFBQSxZQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxhQUE3QyxFQUE0RCxxQkFBNUQsQ0FBWixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxpREFBOUQsRUFMRztVQUFBLENBQUwsRUFSNkI7UUFBQSxDQUEvQixFQUxnRDtNQUFBLENBQWxELENBbEZBLENBQUE7YUFzR0EsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELEVBQStELGdCQUEvRCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsbUNBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxTQUFBO0FBQUEsWUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsS0FBdEMsRUFBNkMsYUFBN0MsRUFBNEQscUJBQTVELENBQVosQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsaURBQTlELEVBTEc7VUFBQSxDQUFMLEVBUjZCO1FBQUEsQ0FBL0IsRUFMd0M7TUFBQSxDQUExQyxFQXZHbUM7SUFBQSxDQUFyQyxDQXY0Q0EsQ0FBQTtXQWtnREEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxNQUFBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxRQUE3QyxFQUF1RCxTQUF2RCxDQUFwQixFQURjO1VBQUEsQ0FBaEIsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUMxQixVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsZ0NBQXpDLENBQUEsQ0FBQTtBQUFBLFVBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFlBQUEsaUJBQUEsQ0FBQTttQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUExQyxLQUFvRCxFQUY3QztVQUFBLENBQVQsQ0FIQSxDQUFBO2lCQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxXQUFBO0FBQUEsWUFBQSxXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsTUFBdEMsRUFBOEMsV0FBOUMsRUFBMkQsVUFBM0QsQ0FBZCxDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQW1DLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQW5DLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFdBQTlCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCx3Q0FBOUQsRUFMRztVQUFBLENBQUwsRUFSMEI7UUFBQSxDQUE1QixFQUx5QztNQUFBLENBQTNDLENBQUEsQ0FBQTthQW9CQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTttQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsTUFBdEMsRUFBOEMsUUFBOUMsRUFBd0QsY0FBeEQsQ0FBcEIsRUFEYztVQUFBLENBQWhCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGdDQUF6QyxDQUFBLENBQUE7QUFBQSxVQUdBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxZQUFBLGlCQUFBLENBQUE7bUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLENBQXlDLENBQUMsTUFBMUMsS0FBb0QsRUFGN0M7VUFBQSxDQUFULENBSEEsQ0FBQTtpQkFPQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLEVBQThDLFdBQTlDLEVBQTJELFVBQTNELENBQWQsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFuQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBQSxDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsd0NBQTlELEVBTEc7VUFBQSxDQUFMLEVBUjBCO1FBQUEsQ0FBNUIsRUFMOEM7TUFBQSxDQUFoRCxFQXJCZ0M7SUFBQSxDQUFsQyxFQW5nRDJCO0VBQUEsQ0FBN0IsQ0FWQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/alholt/.atom/packages/rails-transporter/spec/rails-transporter-spec.coffee
