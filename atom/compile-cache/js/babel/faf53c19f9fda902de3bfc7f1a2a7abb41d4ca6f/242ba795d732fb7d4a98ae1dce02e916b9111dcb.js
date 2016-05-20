Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

/**
 * The `CanvasDrawer` mixin is responsible for the rendering of a `Minimap`
 * in a `canvas` element.
 *
 * This mixin is injected in the `MinimapElement` prototype, so all these
 * methods  are available on any `MinimapElement` instance.
 */
'use babel';

var CanvasDrawer = (function (_Mixin) {
  _inherits(CanvasDrawer, _Mixin);

  function CanvasDrawer() {
    _classCallCheck(this, CanvasDrawer);

    _get(Object.getPrototypeOf(CanvasDrawer.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CanvasDrawer, [{
    key: 'initializeCanvas',

    /**
     * Initializes the canvas elements needed to perform the `Minimap` rendering.
     */
    value: function initializeCanvas() {
      /**
       * The onscreen canvas.
       * @type {HTMLCanvasElement}
       */
      this.canvas = document.createElement('canvas');
      /**
       * The onscreen canvas context.
       * @type {CanvasRenderingContext2D}
       */
      this.context = this.canvas.getContext('2d');
      this.canvas.webkitImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;

      /**
      * The offscreen canvas.
      * @type {HTMLCanvasElement}
      * @access private
      */
      this.offscreenCanvas = document.createElement('canvas');
      /**
       * The offscreen canvas context.
       * @type {CanvasRenderingContext2D}
       * @access private
       */
      this.offscreenContext = this.offscreenCanvas.getContext('2d');
      this.offscreenCanvas.webkitImageSmoothingEnabled = false;
      this.offscreenContext.imageSmoothingEnabled = false;

      if (!this.pendingChanges) {
        /**
         * Stores the changes from the text editor and the minimap.
         * @type {Array<Object>}
         * @access private
         */
        this.pendingChanges = [];
      }
    }

    /**
     * Performs an update of the rendered `Minimap` based on the changes
     * registered in the instance.
     */
  }, {
    key: 'updateCanvas',
    value: function updateCanvas() {
      var firstRow = this.minimap.getFirstVisibleScreenRow();
      var lastRow = this.minimap.getLastVisibleScreenRow();
      var intactRanges = this.computeIntactRanges(firstRow, lastRow);
      var context = this.context;

      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (intactRanges.length === 0) {
        this.drawLines(context, firstRow, lastRow, 0);
      } else {
        for (var j = 0, len = intactRanges.length; j < len; j++) {
          var intact = intactRanges[j];
          this.copyBitmapPart(context, this.offscreenCanvas, intact.offscreenRow, intact.start - firstRow, intact.end - intact.start);
        }
        this.fillGapsBetweenIntactRanges(context, intactRanges, firstRow, lastRow);
      }

      this.offscreenCanvas.width = this.canvas.width;
      this.offscreenCanvas.height = this.canvas.height;
      this.offscreenContext.drawImage(this.canvas, 0, 0);
      /**
       * The first row in the last render of the offscreen canvas.
       * @type {number}
       * @access private
       */
      this.offscreenFirstRow = firstRow;
      /**
       * The last row in the last render of the offscreen canvas.
       * @type {number}
       * @access private
       */
      this.offscreenLastRow = lastRow;
    }

    //     ######   #######  ##        #######  ########   ######
    //    ##    ## ##     ## ##       ##     ## ##     ## ##    ##
    //    ##       ##     ## ##       ##     ## ##     ## ##
    //    ##       ##     ## ##       ##     ## ########   ######
    //    ##       ##     ## ##       ##     ## ##   ##         ##
    //    ##    ## ##     ## ##       ##     ## ##    ##  ##    ##
    //     ######   #######  ########  #######  ##     ##  ######

    /**
     * Returns the opacity value to use when rendering the `Minimap` text.
     *
     * @return {Number} the text opacity value
     */
  }, {
    key: 'getTextOpacity',
    value: function getTextOpacity() {
      return this.textOpacity;
    }

    /**
     * Returns the default text color for an editor content.
     *
     * The color value is directly read from the `TextEditorView` computed styles.
     *
     * @return {string} a CSS color
     */
  }, {
    key: 'getDefaultColor',
    value: function getDefaultColor() {
      var color = this.retrieveStyleFromDom(['.editor'], 'color', false, true);
      return this.transparentize(color, this.getTextOpacity());
    }

    /**
     * Returns the text color for the passed-in `token` object.
     *
     * The color value is read from the DOM by creating a node structure that
     * match the token `scope` property.
     *
     * @param  {Object} token a `TextEditor` token
     * @return {string} the CSS color for the provided token
     */
  }, {
    key: 'getTokenColor',
    value: function getTokenColor(token) {
      var scopes = token.scopeDescriptor || token.scopes;
      var color = this.retrieveStyleFromDom(scopes, 'color');

      return this.transparentize(color, this.getTextOpacity());
    }

    /**
     * Returns the background color for the passed-in `decoration` object.
     *
     * The color value is read from the DOM by creating a node structure that
     * match the decoration `scope` property unless the decoration provides
     * its own `color` property.
     *
     * @param  {Decoration} decoration the decoration to get the color for
     * @return {string} the CSS color for the provided decoration
     */
  }, {
    key: 'getDecorationColor',
    value: function getDecorationColor(decoration) {
      var properties = decoration.getProperties();
      if (properties.color) {
        return properties.color;
      }

      var scopeString = properties.scope.split(/\s+/);
      return this.retrieveStyleFromDom(scopeString, 'background-color', false);
    }

    /**
     * Converts a `rgb(...)` color into a `rgba(...)` color with the specified
     * opacity.
     *
     * @param  {string} color the CSS RGB color to transparentize
     * @param  {number} [opacity=1] the opacity amount
     * @return {string} the transparentized CSS color
     * @access private
     */
  }, {
    key: 'transparentize',
    value: function transparentize(color) {
      var opacity = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      return color.replace('rgb(', 'rgba(').replace(')', ', ' + opacity + ')');
    }

    //    ########  ########     ###    ##      ##
    //    ##     ## ##     ##   ## ##   ##  ##  ##
    //    ##     ## ##     ##  ##   ##  ##  ##  ##
    //    ##     ## ########  ##     ## ##  ##  ##
    //    ##     ## ##   ##   ######### ##  ##  ##
    //    ##     ## ##    ##  ##     ## ##  ##  ##
    //    ########  ##     ## ##     ##  ###  ###

    /**
     * Draws lines on the passed-in `context`.
     *
     * The lines range to draw is specified by the `firstRow` and `lastRow`
     * parameters.
     *
     * @param  {CanvasRenderingContext2D} context the canvas's context where
     *                                            drawing the lines
     * @param  {number} firstRow the first row to render
     * @param  {number} lastRow the last row to render
     * @param  {number} offsetRow the relative offset to apply to rows when
     *                            rendering them
     * @access private
     */
  }, {
    key: 'drawLines',
    value: function drawLines(context, firstRow, lastRow, offsetRow) {
      if (firstRow > lastRow) {
        return;
      }

      var lines = this.getTextEditor().tokenizedLinesForScreenRows(firstRow, lastRow);
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      var charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      var charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      var canvasWidth = this.canvas.width;
      var canvasHeight = this.canvas.height;
      var displayCodeHighlights = this.displayCodeHighlights;
      var decorations = this.minimap.decorationsByTypeThenRows(firstRow, lastRow);

      var line = lines[0];
      var invisibleRegExp = this.getInvisibleRegExp(line);

      var renderData = {
        context: context,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lineHeight: lineHeight,
        charWidth: charWidth,
        charHeight: charHeight
      };

      for (var i = 0, len = lines.length; i < len; i++) {
        line = lines[i];
        var screenRow = firstRow + i;
        var x = 0;

        renderData.row = offsetRow + i;
        renderData.yRow = renderData.row * lineHeight;
        renderData.screenRow = screenRow;

        this.drawDecorations(screenRow, decorations, 'line', renderData, this.drawLineDecoration);

        this.drawDecorations(screenRow, decorations, 'highlight-under', renderData, this.drawHighlightDecoration);

        if ((line != null ? line.tokens : void 0) != null) {
          var tokens = line.tokens;
          for (var j = 0, tokensCount = tokens.length; j < tokensCount; j++) {
            var token = tokens[j];
            var w = token.screenDelta;
            if (!token.isOnlyWhitespace()) {
              var color = displayCodeHighlights ? this.getTokenColor(token) : this.getDefaultColor();

              var value = token.value;
              if (invisibleRegExp != null) {
                value = value.replace(invisibleRegExp, ' ');
              }
              x = this.drawToken(context, value, color, x, renderData.yRow, charWidth, charHeight);
            } else {
              x += w * charWidth;
            }

            if (x > canvasWidth) {
              break;
            }
          }
        }

        this.drawDecorations(screenRow, decorations, 'highlight-over', renderData, this.drawHighlightDecoration);

        this.drawDecorations(screenRow, decorations, 'highlight-outline', renderData, this.drawHighlightOutlineDecoration);
      }

      context.fill();
    }

    /**
     * Returns the regexp to replace invisibles substitution characters
     * in editor lines.
     *
     * @param  {TokenizedLine} line a tokenized lize to read the invisible
     *                              characters
     * @return {RegExp} the regular expression to match invisible characters
     * @access private
     */
  }, {
    key: 'getInvisibleRegExp',
    value: function getInvisibleRegExp(line) {
      if (line != null && line.invisibles != null) {
        var invisibles = [];
        if (line.invisibles.cr != null) {
          invisibles.push(line.invisibles.cr);
        }
        if (line.invisibles.eol != null) {
          invisibles.push(line.invisibles.eol);
        }
        if (line.invisibles.space != null) {
          invisibles.push(line.invisibles.space);
        }
        if (line.invisibles.tab != null) {
          invisibles.push(line.invisibles.tab);
        }

        return RegExp(invisibles.filter(function (s) {
          return typeof s === 'string';
        }).map(_underscorePlus2['default'].escapeRegExp).join('|'), 'g');
      }
    }

    /**
     * Draws a single token on the given context.
     *
     * @param  {CanvasRenderingContext2D} context the target canvas context
     * @param  {string} text the token's text content
     * @param  {string} color the token's CSS color
     * @param  {number} x the x position of the token in the line
     * @param  {number} y the y position of the line in the minimap
     * @param  {number} charWidth the width of a character in the minimap
     * @param  {number} charHeight the height of a character in the minimap
     * @return {number} the x position at the end of the token
     * @access private
     */
  }, {
    key: 'drawToken',
    value: function drawToken(context, text, color, x, y, charWidth, charHeight) {
      context.fillStyle = color;

      var chars = 0;
      for (var j = 0, len = text.length; j < len; j++) {
        var char = text[j];
        if (/\s/.test(char)) {
          if (chars > 0) {
            context.fillRect(x - chars * charWidth, y, chars * charWidth, charHeight);
          }
          chars = 0;
        } else {
          chars++;
        }
        x += charWidth;
      }
      if (chars > 0) {
        context.fillRect(x - chars * charWidth, y, chars * charWidth, charHeight);
      }
      return x;
    }

    /**
     * Draws the specified decorations for the current `screenRow`.
     *
     * The `decorations` object contains all the decorations grouped by type and
     * then rows.
     *
     * @param  {number} screenRow the screen row index for which
     *                            render decorations
     * @param  {Object} decorations the object containing all the decorations
     * @param  {string} type the type of decorations to render
     * @param  {Object} renderData the object containing the render data
     * @param  {Fundtion} renderMethod the method to call to render
     *                                 the decorations
     * @access private
     */
  }, {
    key: 'drawDecorations',
    value: function drawDecorations(screenRow, decorations, type, renderData, renderMethod) {
      var ref = undefined;
      decorations = (ref = decorations[type]) != null ? ref[screenRow] : void 0;

      if (decorations != null ? decorations.length : void 0) {
        for (var i = 0, len = decorations.length; i < len; i++) {
          renderMethod.call(this, decorations[i], renderData);
        }
      }
    }

    /**
     * Draws a line decoration.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawLineDecoration',
    value: function drawLineDecoration(decoration, data) {
      data.context.fillStyle = this.getDecorationColor(decoration);
      data.context.fillRect(0, data.yRow, data.canvasWidth, data.lineHeight);
    }

    /**
     * Draws a highlight decoration.
     *
     * It renders only the part of the highlight corresponding to the specified
     * row.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawHighlightDecoration',
    value: function drawHighlightDecoration(decoration, data) {
      var range = decoration.getMarker().getScreenRange();
      var rowSpan = range.end.row - range.start.row;

      data.context.fillStyle = this.getDecorationColor(decoration);

      if (rowSpan === 0) {
        var colSpan = range.end.column - range.start.column;
        data.context.fillRect(range.start.column * data.charWidth, data.yRow, colSpan * data.charWidth, data.lineHeight);
      } else if (data.screenRow === range.start.row) {
        var x = range.start.column * data.charWidth;
        data.context.fillRect(x, data.yRow, data.canvasWidth - x, data.lineHeight);
      } else if (data.screenRow === range.end.row) {
        data.context.fillRect(0, data.yRow, range.end.column * data.charWidth, data.lineHeight);
      } else {
        data.context.fillRect(0, data.yRow, data.canvasWidth, data.lineHeight);
      }
    }

    /**
     * Draws a highlight outline decoration.
     *
     * It renders only the part of the highlight corresponding to the specified
     * row.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawHighlightOutlineDecoration',
    value: function drawHighlightOutlineDecoration(decoration, data) {
      var bottomWidth = undefined,
          colSpan = undefined,
          width = undefined,
          xBottomStart = undefined,
          xEnd = undefined,
          xStart = undefined;
      var lineHeight = data.lineHeight;
      var charWidth = data.charWidth;
      var canvasWidth = data.canvasWidth;
      var screenRow = data.screenRow;

      var range = decoration.getMarker().getScreenRange();
      var rowSpan = range.end.row - range.start.row;
      var yStart = data.yRow;
      var yEnd = yStart + lineHeight;

      data.context.fillStyle = this.getDecorationColor(decoration);

      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        width = colSpan * charWidth;
        xStart = range.start.column * charWidth;
        xEnd = xStart + width;

        data.context.fillRect(xStart, yStart, width, 1);
        data.context.fillRect(xStart, yEnd, width, 1);
        data.context.fillRect(xStart, yStart, 1, lineHeight);
        data.context.fillRect(xEnd, yStart, 1, lineHeight);
      } else if (rowSpan === 1) {
        xStart = range.start.column * data.charWidth;
        xEnd = range.end.column * data.charWidth;

        if (screenRow === range.start.row) {
          width = data.canvasWidth - xStart;
          xBottomStart = Math.max(xStart, xEnd);
          bottomWidth = data.canvasWidth - xBottomStart;

          data.context.fillRect(xStart, yStart, width, 1);
          data.context.fillRect(xBottomStart, yEnd, bottomWidth, 1);
          data.context.fillRect(xStart, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else {
          width = canvasWidth - xStart;
          bottomWidth = canvasWidth - xEnd;

          data.context.fillRect(0, yStart, xStart, 1);
          data.context.fillRect(0, yEnd, xEnd, 1);
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(xEnd, yStart, 1, lineHeight);
        }
      } else {
        xStart = range.start.column * charWidth;
        xEnd = range.end.column * charWidth;
        if (screenRow === range.start.row) {
          width = canvasWidth - xStart;

          data.context.fillRect(xStart, yStart, width, 1);
          data.context.fillRect(xStart, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else if (screenRow === range.end.row) {
          width = canvasWidth - xStart;

          data.context.fillRect(0, yEnd, xEnd, 1);
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(xEnd, yStart, 1, lineHeight);
        } else {
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
          if (screenRow === range.start.row + 1) {
            data.context.fillRect(0, yStart, xStart, 1);
          }
          if (screenRow === range.end.row - 1) {
            data.context.fillRect(xEnd, yEnd, canvasWidth - xEnd, 1);
          }
        }
      }
    }

    /**
     * Copy a part of the offscreen bitmap into the onscreen one to
     * reduce the amount of rendered lines during scroll.
     *
     * @param  {CanvasRenderingContext2D} context [description]
     * @param  {HTMLCanvasElement} bitmapCanvas [description]
     * @param  {number} srcRow the source row of the region to copy
     * @param  {number} destRow the destination row
     * @param  {number} rowCount the amount of lines to copy
     * @access private
     */
  }, {
    key: 'copyBitmapPart',
    value: function copyBitmapPart(context, bitmapCanvas, srcRow, destRow, rowCount) {
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;

      context.drawImage(bitmapCanvas, 0, srcRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight, 0, destRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight);
    }

    //    ########     ###    ##    ##  ######   ########  ######
    //    ##     ##   ## ##   ###   ## ##    ##  ##       ##    ##
    //    ##     ##  ##   ##  ####  ## ##        ##       ##
    //    ########  ##     ## ## ## ## ##   #### ######    ######
    //    ##   ##   ######### ##  #### ##    ##  ##             ##
    //    ##    ##  ##     ## ##   ### ##    ##  ##       ##    ##
    //    ##     ## ##     ## ##    ##  ######   ########  ######

    /**
     * Renders the lines between the intact ranges when an update has pending
     * changes.
     *
     * @param  {CanvasRenderingContext2D} context the target canvas context
     * @param  {Array<Object>} intactRanges the intact ranges in the minimap
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @access private
     */
  }, {
    key: 'fillGapsBetweenIntactRanges',
    value: function fillGapsBetweenIntactRanges(context, intactRanges, firstRow, lastRow) {
      var currentRow = firstRow;
      for (var i = 0, len = intactRanges.length; i < len; i++) {
        var intact = intactRanges[i];

        this.drawLines(context, currentRow, intact.start - 1, currentRow - firstRow);

        currentRow = intact.end;
      }
      if (currentRow <= lastRow) {
        this.drawLines(context, currentRow, lastRow, currentRow - firstRow);
      }
    }

    /**
     * Computes the ranges that are not affected by the current pending changes.
     *
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @return {Array<Object>} the intact ranges in the rendered region
     * @access private
     */
  }, {
    key: 'computeIntactRanges',
    value: function computeIntactRanges(firstRow, lastRow) {
      if (this.offscreenFirstRow == null && this.offscreenLastRow == null) {
        return [];
      }

      var intactRanges = [{
        start: this.offscreenFirstRow,
        end: this.offscreenLastRow,
        offscreenRow: 0
      }];

      var changes = this.pendingChanges;

      for (var i = 0, len = changes.length; i < len; i++) {
        var change = changes[i];
        var newIntactRanges = [];

        for (var j = 0, intactLen = intactRanges.length; j < intactLen; j++) {
          var range = intactRanges[j];

          if (change.end < range.start && change.screenDelta !== 0) {
            newIntactRanges.push({
              start: range.start + change.screenDelta,
              end: range.end + change.screenDelta,
              offscreenRow: range.offscreenRow
            });
          } else if (change.end < range.start || change.start > range.end) {
            newIntactRanges.push(range);
          } else {
            if (change.start > range.start) {
              newIntactRanges.push({
                start: range.start,
                end: change.start - 1,
                offscreenRow: range.offscreenRow
              });
            }
            if (change.end < range.end && change.bufferDelta !== 0) {
              newIntactRanges.push({
                start: change.end + change.screenDelta + 1,
                end: range.end + change.screenDelta,
                offscreenRow: range.offscreenRow + change.end + 1 - range.start
              });
            }
          }
        }
        intactRanges = newIntactRanges;
      }

      this.pendingChanges = [];
      return this.truncateIntactRanges(intactRanges, firstRow, lastRow);
    }

    /**
     * Truncates the intact ranges so that they doesn't expand past the visible
     * area of the minimap.
     *
     * @param  {Array<Object>} intactRanges the initial array of ranges
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @return {Array<Object>} the array of truncated ranges
     * @access private
     */
  }, {
    key: 'truncateIntactRanges',
    value: function truncateIntactRanges(intactRanges, firstRow, lastRow) {
      var i = 0;
      while (i < intactRanges.length) {
        var range = intactRanges[i];

        if (range.start < firstRow) {
          range.offscreenRow += firstRow - range.start;
          range.start = firstRow;
        }

        if (range.end > lastRow) {
          range.end = lastRow;
        }

        if (range.start >= range.end) {
          intactRanges.splice(i--, 1);
        }

        i++;
      }

      return intactRanges.sort(function (a, b) {
        return a.offscreenRow - b.offscreenRow;
      });
    }
  }]);

  return CanvasDrawer;
})(_mixto2['default']);

exports['default'] = CanvasDrawer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGhvbHQvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL2NhbnZhcy1kcmF3ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OEJBRWMsaUJBQWlCOzs7O3FCQUNiLE9BQU87Ozs7Ozs7Ozs7O0FBSHpCLFdBQVcsQ0FBQTs7SUFZVSxZQUFZO1lBQVosWUFBWTs7V0FBWixZQUFZOzBCQUFaLFlBQVk7OytCQUFaLFlBQVk7OztlQUFaLFlBQVk7Ozs7OztXQUlkLDRCQUFHOzs7OztBQUtsQixVQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7Ozs7O0FBSzlDLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsR0FBRyxLQUFLLENBQUE7QUFDL0MsVUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7Ozs7Ozs7QUFPMUMsVUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBOzs7Ozs7QUFNdkQsVUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzdELFVBQUksQ0FBQyxlQUFlLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFBO0FBQ3hELFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7O0FBRW5ELFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFOzs7Ozs7QUFNeEIsWUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUE7T0FDekI7S0FDRjs7Ozs7Ozs7V0FNWSx3QkFBRztBQUNkLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsQ0FBQTtBQUN0RCxVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLENBQUE7QUFDcEQsVUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUM5RCxVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFBOztBQUUxQixhQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFOUQsVUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUM3QixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO09BQzlDLE1BQU07QUFDTCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZELGNBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixjQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDNUg7QUFDRCxZQUFJLENBQUMsMkJBQTJCLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7T0FDM0U7O0FBRUQsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUE7QUFDOUMsVUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUE7QUFDaEQsVUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTs7Ozs7O0FBTWxELFVBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUE7Ozs7OztBQU1qQyxVQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFBO0tBQ2hDOzs7Ozs7Ozs7Ozs7Ozs7OztXQWVjLDBCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFBO0tBQUU7Ozs7Ozs7Ozs7O1dBUzdCLDJCQUFHO0FBQ2pCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDeEUsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQTtLQUN6RDs7Ozs7Ozs7Ozs7OztXQVdhLHVCQUFDLEtBQUssRUFBRTtBQUNwQixVQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUE7QUFDbEQsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFdEQsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQTtLQUN6RDs7Ozs7Ozs7Ozs7Ozs7V0FZa0IsNEJBQUMsVUFBVSxFQUFFO0FBQzlCLFVBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtBQUMzQyxVQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFBRSxlQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUE7T0FBRTs7QUFFakQsVUFBSSxXQUFXLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0MsYUFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFBO0tBQ3pFOzs7Ozs7Ozs7Ozs7O1dBV2Msd0JBQUMsS0FBSyxFQUFlO1VBQWIsT0FBTyx5REFBRyxDQUFDOztBQUNoQyxhQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQU8sT0FBTyxPQUFJLENBQUE7S0FDcEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBd0JTLG1CQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUNoRCxVQUFJLFFBQVEsR0FBRyxPQUFPLEVBQUU7QUFBRSxlQUFNO09BQUU7O0FBRWxDLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDL0UsVUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQTtBQUNoRSxVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxHQUFHLGdCQUFnQixDQUFBO0FBQ2hFLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEdBQUcsZ0JBQWdCLENBQUE7QUFDOUQsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUE7QUFDbkMsVUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUE7QUFDckMsVUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUE7QUFDdEQsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRTNFLFVBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNuQixVQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRW5ELFVBQUksVUFBVSxHQUFHO0FBQ2YsZUFBTyxFQUFFLE9BQU87QUFDaEIsbUJBQVcsRUFBRSxXQUFXO0FBQ3hCLG9CQUFZLEVBQUUsWUFBWTtBQUMxQixrQkFBVSxFQUFFLFVBQVU7QUFDdEIsaUJBQVMsRUFBRSxTQUFTO0FBQ3BCLGtCQUFVLEVBQUUsVUFBVTtPQUN2QixDQUFBOztBQUVELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEQsWUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNmLFlBQUksU0FBUyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUE7QUFDNUIsWUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUVULGtCQUFVLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDOUIsa0JBQVUsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUE7QUFDN0Msa0JBQVUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBOztBQUVoQyxZQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7QUFFekYsWUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQTs7QUFFekcsWUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQSxJQUFLLElBQUksRUFBRTtBQUNqRCxjQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQ3hCLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDakUsZ0JBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNyQixnQkFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQTtBQUN6QixnQkFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO0FBQzdCLGtCQUFJLEtBQUssR0FBRyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTs7QUFFdEYsa0JBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7QUFDdkIsa0JBQUksZUFBZSxJQUFJLElBQUksRUFBRTtBQUMzQixxQkFBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFBO2VBQzVDO0FBQ0QsZUFBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFBO2FBQ3JGLE1BQU07QUFDTCxlQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQTthQUNuQjs7QUFFRCxnQkFBSSxDQUFDLEdBQUcsV0FBVyxFQUFFO0FBQUUsb0JBQUs7YUFBRTtXQUMvQjtTQUNGOztBQUVELFlBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUE7O0FBRXhHLFlBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUE7T0FDbkg7O0FBRUQsYUFBTyxDQUFDLElBQUksRUFBRSxDQUFBO0tBQ2Y7Ozs7Ozs7Ozs7Ozs7V0FXa0IsNEJBQUMsSUFBSSxFQUFFO0FBQ3hCLFVBQUksQUFBQyxJQUFJLElBQUksSUFBSSxJQUFNLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxBQUFDLEVBQUU7QUFDL0MsWUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFlBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksSUFBSSxFQUFFO0FBQUUsb0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUFFO0FBQ3ZFLFlBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFO0FBQUUsb0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUFFO0FBQ3pFLFlBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQUUsb0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUFFO0FBQzdFLFlBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFO0FBQUUsb0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUFFOztBQUV6RSxlQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ3JDLGlCQUFPLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQTtTQUM3QixDQUFDLENBQUMsR0FBRyxDQUFDLDRCQUFFLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtPQUN2QztLQUNGOzs7Ozs7Ozs7Ozs7Ozs7OztXQWVTLG1CQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRTtBQUM1RCxhQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTs7QUFFekIsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO0FBQ2IsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMvQyxZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEIsWUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ25CLGNBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtBQUNiLG1CQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBSSxLQUFLLEdBQUcsU0FBUyxBQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssR0FBRyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUE7V0FDNUU7QUFDRCxlQUFLLEdBQUcsQ0FBQyxDQUFBO1NBQ1YsTUFBTTtBQUNMLGVBQUssRUFBRSxDQUFBO1NBQ1I7QUFDRCxTQUFDLElBQUksU0FBUyxDQUFBO09BQ2Y7QUFDRCxVQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDYixlQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBSSxLQUFLLEdBQUcsU0FBUyxBQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssR0FBRyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUE7T0FDNUU7QUFDRCxhQUFPLENBQUMsQ0FBQTtLQUNUOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBaUJlLHlCQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUU7QUFDdkUsVUFBSSxHQUFHLFlBQUEsQ0FBQTtBQUNQLGlCQUFXLEdBQUcsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBLElBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQTs7QUFFekUsVUFBSSxXQUFXLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEVBQUU7QUFDckQsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0RCxzQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1NBQ3BEO09BQ0Y7S0FDRjs7Ozs7Ozs7Ozs7V0FTa0IsNEJBQUMsVUFBVSxFQUFFLElBQUksRUFBRTtBQUNwQyxVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDNUQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDdkU7Ozs7Ozs7Ozs7Ozs7O1dBWXVCLGlDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUU7QUFDekMsVUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQ25ELFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFBOztBQUU3QyxVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRTVELFVBQUksT0FBTyxLQUFLLENBQUMsRUFBRTtBQUNqQixZQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQTtBQUNuRCxZQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQ2pILE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQzdDLFlBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7QUFDM0MsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQzNFLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQzNDLFlBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQ3hGLE1BQU07QUFDTCxZQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUN2RTtLQUNGOzs7Ozs7Ozs7Ozs7OztXQVk4Qix3Q0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFO0FBQ2hELFVBQUksV0FBVyxZQUFBO1VBQUUsT0FBTyxZQUFBO1VBQUUsS0FBSyxZQUFBO1VBQUUsWUFBWSxZQUFBO1VBQUUsSUFBSSxZQUFBO1VBQUUsTUFBTSxZQUFBLENBQUE7VUFDdEQsVUFBVSxHQUF1QyxJQUFJLENBQXJELFVBQVU7VUFBRSxTQUFTLEdBQTRCLElBQUksQ0FBekMsU0FBUztVQUFFLFdBQVcsR0FBZSxJQUFJLENBQTlCLFdBQVc7VUFBRSxTQUFTLEdBQUksSUFBSSxDQUFqQixTQUFTOztBQUNsRCxVQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDbkQsVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUE7QUFDN0MsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUN0QixVQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsVUFBVSxDQUFBOztBQUU5QixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRTVELFVBQUksT0FBTyxLQUFLLENBQUMsRUFBRTtBQUNqQixlQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUE7QUFDL0MsYUFBSyxHQUFHLE9BQU8sR0FBRyxTQUFTLENBQUE7QUFDM0IsY0FBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQTtBQUN2QyxZQUFJLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQTs7QUFFckIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDL0MsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDN0MsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDcEQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUE7T0FDbkQsTUFBTSxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7QUFDeEIsY0FBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7QUFDNUMsWUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7O0FBRXhDLFlBQUksU0FBUyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ2pDLGVBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQTtBQUNqQyxzQkFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3JDLHFCQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUE7O0FBRTdDLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQy9DLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3pELGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ3BELGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtTQUM5RCxNQUFNO0FBQ0wsZUFBSyxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUE7QUFDNUIscUJBQVcsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFBOztBQUVoQyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMzQyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN2QyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUMvQyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtTQUNuRDtPQUNGLE1BQU07QUFDTCxjQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFBO0FBQ3ZDLFlBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUE7QUFDbkMsWUFBSSxTQUFTLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDakMsZUFBSyxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUE7O0FBRTVCLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQy9DLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ3BELGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtTQUM5RCxNQUFNLElBQUksU0FBUyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ3RDLGVBQUssR0FBRyxXQUFXLEdBQUcsTUFBTSxDQUFBOztBQUU1QixjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN2QyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUMvQyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtTQUNuRCxNQUFNO0FBQ0wsY0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDL0MsY0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQzdELGNBQUksU0FBUyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRTtBQUNyQyxnQkFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7V0FDNUM7QUFDRCxjQUFJLFNBQVMsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUU7QUFDbkMsZ0JBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtXQUN6RDtTQUNGO09BQ0Y7S0FDRjs7Ozs7Ozs7Ozs7Ozs7O1dBYWMsd0JBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNoRSxVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxHQUFHLGdCQUFnQixDQUFBOztBQUVoRSxhQUFPLENBQUMsU0FBUyxDQUNmLFlBQVksRUFDWixDQUFDLEVBQUUsTUFBTSxHQUFHLFVBQVUsRUFBRSxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsR0FBRyxVQUFVLEVBQ2pFLENBQUMsRUFBRSxPQUFPLEdBQUcsVUFBVSxFQUFFLFlBQVksQ0FBQyxLQUFLLEVBQUUsUUFBUSxHQUFHLFVBQVUsQ0FDbkUsQ0FBQTtLQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBb0IyQixxQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDckUsVUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFBO0FBQ3pCLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdkQsWUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUU1QixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFBOztBQUU1RSxrQkFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUE7T0FDeEI7QUFDRCxVQUFJLFVBQVUsSUFBSSxPQUFPLEVBQUU7QUFDekIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUE7T0FDcEU7S0FDRjs7Ozs7Ozs7Ozs7O1dBVW1CLDZCQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDdEMsVUFBSSxBQUFDLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLElBQU0sSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQUFBQyxFQUFFO0FBQ3ZFLGVBQU8sRUFBRSxDQUFBO09BQ1Y7O0FBRUQsVUFBSSxZQUFZLEdBQUcsQ0FDakI7QUFDRSxhQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtBQUM3QixXQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtBQUMxQixvQkFBWSxFQUFFLENBQUM7T0FDaEIsQ0FDRixDQUFBOztBQUVELFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUE7O0FBRWpDLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEQsWUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3ZCLFlBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQTs7QUFFeEIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuRSxjQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTNCLGNBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEtBQUssQ0FBQyxFQUFFO0FBQ3hELDJCQUFlLENBQUMsSUFBSSxDQUFDO0FBQ25CLG1CQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVztBQUN2QyxpQkFBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFdBQVc7QUFDbkMsMEJBQVksRUFBRSxLQUFLLENBQUMsWUFBWTthQUNqQyxDQUFDLENBQUE7V0FDSCxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUMvRCwyQkFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtXQUM1QixNQUFNO0FBQ0wsZ0JBQUksTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQzlCLDZCQUFlLENBQUMsSUFBSSxDQUFDO0FBQ25CLHFCQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsbUJBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUM7QUFDckIsNEJBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtlQUNqQyxDQUFDLENBQUE7YUFDSDtBQUNELGdCQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxLQUFLLENBQUMsRUFBRTtBQUN0RCw2QkFBZSxDQUFDLElBQUksQ0FBQztBQUNuQixxQkFBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDO0FBQzFDLG1CQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsV0FBVztBQUNuQyw0QkFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUs7ZUFDaEUsQ0FBQyxDQUFBO2FBQ0g7V0FDRjtTQUNGO0FBQ0Qsb0JBQVksR0FBRyxlQUFlLENBQUE7T0FDL0I7O0FBRUQsVUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUE7QUFDeEIsYUFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUNsRTs7Ozs7Ozs7Ozs7Ozs7V0FZb0IsOEJBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDckQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ1QsYUFBTyxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRTtBQUM5QixZQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTNCLFlBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUU7QUFDMUIsZUFBSyxDQUFDLFlBQVksSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQTtBQUM1QyxlQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQTtTQUN2Qjs7QUFFRCxZQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxFQUFFO0FBQUUsZUFBSyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUE7U0FBRTs7QUFFaEQsWUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFBRSxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUFFOztBQUU3RCxTQUFDLEVBQUUsQ0FBQTtPQUNKOztBQUVELGFBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDakMsZUFBTyxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUE7T0FDdkMsQ0FBQyxDQUFBO0tBQ0g7OztTQWxsQmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy9hbGhvbHQvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL2NhbnZhcy1kcmF3ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnXG5pbXBvcnQgTWl4aW4gZnJvbSAnbWl4dG8nXG5cbi8qKlxuICogVGhlIGBDYW52YXNEcmF3ZXJgIG1peGluIGlzIHJlc3BvbnNpYmxlIGZvciB0aGUgcmVuZGVyaW5nIG9mIGEgYE1pbmltYXBgXG4gKiBpbiBhIGBjYW52YXNgIGVsZW1lbnQuXG4gKlxuICogVGhpcyBtaXhpbiBpcyBpbmplY3RlZCBpbiB0aGUgYE1pbmltYXBFbGVtZW50YCBwcm90b3R5cGUsIHNvIGFsbCB0aGVzZVxuICogbWV0aG9kcyAgYXJlIGF2YWlsYWJsZSBvbiBhbnkgYE1pbmltYXBFbGVtZW50YCBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzRHJhd2VyIGV4dGVuZHMgTWl4aW4ge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGNhbnZhcyBlbGVtZW50cyBuZWVkZWQgdG8gcGVyZm9ybSB0aGUgYE1pbmltYXBgIHJlbmRlcmluZy5cbiAgICovXG4gIGluaXRpYWxpemVDYW52YXMgKCkge1xuICAgIC8qKlxuICAgICAqIFRoZSBvbnNjcmVlbiBjYW52YXMuXG4gICAgICogQHR5cGUge0hUTUxDYW52YXNFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAvKipcbiAgICAgKiBUaGUgb25zY3JlZW4gY2FudmFzIGNvbnRleHQuXG4gICAgICogQHR5cGUge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgdGhpcy5jYW52YXMud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcbiAgICB0aGlzLmNvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcblxuICAgIC8qKlxuICAgICogVGhlIG9mZnNjcmVlbiBjYW52YXMuXG4gICAgKiBAdHlwZSB7SFRNTENhbnZhc0VsZW1lbnR9XG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMub2Zmc2NyZWVuQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAvKipcbiAgICAgKiBUaGUgb2Zmc2NyZWVuIGNhbnZhcyBjb250ZXh0LlxuICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vZmZzY3JlZW5Db250ZXh0ID0gdGhpcy5vZmZzY3JlZW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgIHRoaXMub2Zmc2NyZWVuQ2FudmFzLndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG4gICAgdGhpcy5vZmZzY3JlZW5Db250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG5cbiAgICBpZiAoIXRoaXMucGVuZGluZ0NoYW5nZXMpIHtcbiAgICAgIC8qKlxuICAgICAgICogU3RvcmVzIHRoZSBjaGFuZ2VzIGZyb20gdGhlIHRleHQgZWRpdG9yIGFuZCB0aGUgbWluaW1hcC5cbiAgICAgICAqIEB0eXBlIHtBcnJheTxPYmplY3Q+fVxuICAgICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMucGVuZGluZ0NoYW5nZXMgPSBbXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiB1cGRhdGUgb2YgdGhlIHJlbmRlcmVkIGBNaW5pbWFwYCBiYXNlZCBvbiB0aGUgY2hhbmdlc1xuICAgKiByZWdpc3RlcmVkIGluIHRoZSBpbnN0YW5jZS5cbiAgICovXG4gIHVwZGF0ZUNhbnZhcyAoKSB7XG4gICAgbGV0IGZpcnN0Um93ID0gdGhpcy5taW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgbGV0IGxhc3RSb3cgPSB0aGlzLm1pbmltYXAuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKVxuICAgIGxldCBpbnRhY3RSYW5nZXMgPSB0aGlzLmNvbXB1dGVJbnRhY3RSYW5nZXMoZmlyc3RSb3csIGxhc3RSb3cpXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzLmNvbnRleHRcblxuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpXG5cbiAgICBpZiAoaW50YWN0UmFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5kcmF3TGluZXMoY29udGV4dCwgZmlyc3RSb3csIGxhc3RSb3csIDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBpbnRhY3RSYW5nZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbGV0IGludGFjdCA9IGludGFjdFJhbmdlc1tqXVxuICAgICAgICB0aGlzLmNvcHlCaXRtYXBQYXJ0KGNvbnRleHQsIHRoaXMub2Zmc2NyZWVuQ2FudmFzLCBpbnRhY3Qub2Zmc2NyZWVuUm93LCBpbnRhY3Quc3RhcnQgLSBmaXJzdFJvdywgaW50YWN0LmVuZCAtIGludGFjdC5zdGFydClcbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsbEdhcHNCZXR3ZWVuSW50YWN0UmFuZ2VzKGNvbnRleHQsIGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3cpXG4gICAgfVxuXG4gICAgdGhpcy5vZmZzY3JlZW5DYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aFxuICAgIHRoaXMub2Zmc2NyZWVuQ2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodFxuICAgIHRoaXMub2Zmc2NyZWVuQ29udGV4dC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDApXG4gICAgLyoqXG4gICAgICogVGhlIGZpcnN0IHJvdyBpbiB0aGUgbGFzdCByZW5kZXIgb2YgdGhlIG9mZnNjcmVlbiBjYW52YXMuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm9mZnNjcmVlbkZpcnN0Um93ID0gZmlyc3RSb3dcbiAgICAvKipcbiAgICAgKiBUaGUgbGFzdCByb3cgaW4gdGhlIGxhc3QgcmVuZGVyIG9mIHRoZSBvZmZzY3JlZW4gY2FudmFzLlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vZmZzY3JlZW5MYXN0Um93ID0gbGFzdFJvd1xuICB9XG5cbiAgLy8gICAgICMjIyMjIyAgICMjIyMjIyMgICMjICAgICAgICAjIyMjIyMjICAjIyMjIyMjIyAgICMjIyMjI1xuICAvLyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAjIyAgICAgICAgICMjXG4gIC8vICAgICMjICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgICMjXG4gIC8vICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjIyAgIyMgICAgICMjICAjIyMjIyNcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3BhY2l0eSB2YWx1ZSB0byB1c2Ugd2hlbiByZW5kZXJpbmcgdGhlIGBNaW5pbWFwYCB0ZXh0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSB0ZXh0IG9wYWNpdHkgdmFsdWVcbiAgICovXG4gIGdldFRleHRPcGFjaXR5ICgpIHsgcmV0dXJuIHRoaXMudGV4dE9wYWNpdHkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZWZhdWx0IHRleHQgY29sb3IgZm9yIGFuIGVkaXRvciBjb250ZW50LlxuICAgKlxuICAgKiBUaGUgY29sb3IgdmFsdWUgaXMgZGlyZWN0bHkgcmVhZCBmcm9tIHRoZSBgVGV4dEVkaXRvclZpZXdgIGNvbXB1dGVkIHN0eWxlcy5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBhIENTUyBjb2xvclxuICAgKi9cbiAgZ2V0RGVmYXVsdENvbG9yICgpIHtcbiAgICBsZXQgY29sb3IgPSB0aGlzLnJldHJpZXZlU3R5bGVGcm9tRG9tKFsnLmVkaXRvciddLCAnY29sb3InLCBmYWxzZSwgdHJ1ZSlcbiAgICByZXR1cm4gdGhpcy50cmFuc3BhcmVudGl6ZShjb2xvciwgdGhpcy5nZXRUZXh0T3BhY2l0eSgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHQgY29sb3IgZm9yIHRoZSBwYXNzZWQtaW4gYHRva2VuYCBvYmplY3QuXG4gICAqXG4gICAqIFRoZSBjb2xvciB2YWx1ZSBpcyByZWFkIGZyb20gdGhlIERPTSBieSBjcmVhdGluZyBhIG5vZGUgc3RydWN0dXJlIHRoYXRcbiAgICogbWF0Y2ggdGhlIHRva2VuIGBzY29wZWAgcHJvcGVydHkuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gdG9rZW4gYSBgVGV4dEVkaXRvcmAgdG9rZW5cbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgQ1NTIGNvbG9yIGZvciB0aGUgcHJvdmlkZWQgdG9rZW5cbiAgICovXG4gIGdldFRva2VuQ29sb3IgKHRva2VuKSB7XG4gICAgbGV0IHNjb3BlcyA9IHRva2VuLnNjb3BlRGVzY3JpcHRvciB8fCB0b2tlbi5zY29wZXNcbiAgICBsZXQgY29sb3IgPSB0aGlzLnJldHJpZXZlU3R5bGVGcm9tRG9tKHNjb3BlcywgJ2NvbG9yJylcblxuICAgIHJldHVybiB0aGlzLnRyYW5zcGFyZW50aXplKGNvbG9yLCB0aGlzLmdldFRleHRPcGFjaXR5KCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYmFja2dyb3VuZCBjb2xvciBmb3IgdGhlIHBhc3NlZC1pbiBgZGVjb3JhdGlvbmAgb2JqZWN0LlxuICAgKlxuICAgKiBUaGUgY29sb3IgdmFsdWUgaXMgcmVhZCBmcm9tIHRoZSBET00gYnkgY3JlYXRpbmcgYSBub2RlIHN0cnVjdHVyZSB0aGF0XG4gICAqIG1hdGNoIHRoZSBkZWNvcmF0aW9uIGBzY29wZWAgcHJvcGVydHkgdW5sZXNzIHRoZSBkZWNvcmF0aW9uIHByb3ZpZGVzXG4gICAqIGl0cyBvd24gYGNvbG9yYCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHBhcmFtICB7RGVjb3JhdGlvbn0gZGVjb3JhdGlvbiB0aGUgZGVjb3JhdGlvbiB0byBnZXQgdGhlIGNvbG9yIGZvclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBDU1MgY29sb3IgZm9yIHRoZSBwcm92aWRlZCBkZWNvcmF0aW9uXG4gICAqL1xuICBnZXREZWNvcmF0aW9uQ29sb3IgKGRlY29yYXRpb24pIHtcbiAgICBsZXQgcHJvcGVydGllcyA9IGRlY29yYXRpb24uZ2V0UHJvcGVydGllcygpXG4gICAgaWYgKHByb3BlcnRpZXMuY29sb3IpIHsgcmV0dXJuIHByb3BlcnRpZXMuY29sb3IgfVxuXG4gICAgbGV0IHNjb3BlU3RyaW5nID0gcHJvcGVydGllcy5zY29wZS5zcGxpdCgvXFxzKy8pXG4gICAgcmV0dXJuIHRoaXMucmV0cmlldmVTdHlsZUZyb21Eb20oc2NvcGVTdHJpbmcsICdiYWNrZ3JvdW5kLWNvbG9yJywgZmFsc2UpXG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBgcmdiKC4uLilgIGNvbG9yIGludG8gYSBgcmdiYSguLi4pYCBjb2xvciB3aXRoIHRoZSBzcGVjaWZpZWRcbiAgICogb3BhY2l0eS5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjb2xvciB0aGUgQ1NTIFJHQiBjb2xvciB0byB0cmFuc3BhcmVudGl6ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFtvcGFjaXR5PTFdIHRoZSBvcGFjaXR5IGFtb3VudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSB0cmFuc3BhcmVudGl6ZWQgQ1NTIGNvbG9yXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdHJhbnNwYXJlbnRpemUgKGNvbG9yLCBvcGFjaXR5ID0gMSkge1xuICAgIHJldHVybiBjb2xvci5yZXBsYWNlKCdyZ2IoJywgJ3JnYmEoJykucmVwbGFjZSgnKScsIGAsICR7b3BhY2l0eX0pYClcbiAgfVxuXG4gIC8vICAgICMjIyMjIyMjICAjIyMjIyMjIyAgICAgIyMjICAgICMjICAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAgICMjICMjICAgIyMgICMjICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICAjIyAgICMjICAjIyAgIyMgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMgICAgICMjICMjICAjIyAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgIyMgICAjIyMjIyMjIyMgIyMgICMjICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgICAjIyAjIyAgIyMgICMjXG4gIC8vICAgICMjIyMjIyMjICAjIyAgICAgIyMgIyMgICAgICMjICAjIyMgICMjI1xuXG4gIC8qKlxuICAgKiBEcmF3cyBsaW5lcyBvbiB0aGUgcGFzc2VkLWluIGBjb250ZXh0YC5cbiAgICpcbiAgICogVGhlIGxpbmVzIHJhbmdlIHRvIGRyYXcgaXMgc3BlY2lmaWVkIGJ5IHRoZSBgZmlyc3RSb3dgIGFuZCBgbGFzdFJvd2BcbiAgICogcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtICB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjb250ZXh0IHRoZSBjYW52YXMncyBjb250ZXh0IHdoZXJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmF3aW5nIHRoZSBsaW5lc1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgdG8gcmVuZGVyXG4gICAqIEBwYXJhbSAge251bWJlcn0gbGFzdFJvdyB0aGUgbGFzdCByb3cgdG8gcmVuZGVyXG4gICAqIEBwYXJhbSAge251bWJlcn0gb2Zmc2V0Um93IHRoZSByZWxhdGl2ZSBvZmZzZXQgdG8gYXBwbHkgdG8gcm93cyB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmluZyB0aGVtXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd0xpbmVzIChjb250ZXh0LCBmaXJzdFJvdywgbGFzdFJvdywgb2Zmc2V0Um93KSB7XG4gICAgaWYgKGZpcnN0Um93ID4gbGFzdFJvdykgeyByZXR1cm4gfVxuXG4gICAgbGV0IGxpbmVzID0gdGhpcy5nZXRUZXh0RWRpdG9yKCkudG9rZW5pemVkTGluZXNGb3JTY3JlZW5Sb3dzKGZpcnN0Um93LCBsYXN0Um93KVxuICAgIGxldCBsaW5lSGVpZ2h0ID0gdGhpcy5taW5pbWFwLmdldExpbmVIZWlnaHQoKSAqIGRldmljZVBpeGVsUmF0aW9cbiAgICBsZXQgY2hhckhlaWdodCA9IHRoaXMubWluaW1hcC5nZXRDaGFySGVpZ2h0KCkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgbGV0IGNoYXJXaWR0aCA9IHRoaXMubWluaW1hcC5nZXRDaGFyV2lkdGgoKSAqIGRldmljZVBpeGVsUmF0aW9cbiAgICBsZXQgY2FudmFzV2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aFxuICAgIGxldCBjYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHRcbiAgICBsZXQgZGlzcGxheUNvZGVIaWdobGlnaHRzID0gdGhpcy5kaXNwbGF5Q29kZUhpZ2hsaWdodHNcbiAgICBsZXQgZGVjb3JhdGlvbnMgPSB0aGlzLm1pbmltYXAuZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93cyhmaXJzdFJvdywgbGFzdFJvdylcblxuICAgIGxldCBsaW5lID0gbGluZXNbMF1cbiAgICBsZXQgaW52aXNpYmxlUmVnRXhwID0gdGhpcy5nZXRJbnZpc2libGVSZWdFeHAobGluZSlcblxuICAgIGxldCByZW5kZXJEYXRhID0ge1xuICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgIGNhbnZhc1dpZHRoOiBjYW52YXNXaWR0aCxcbiAgICAgIGNhbnZhc0hlaWdodDogY2FudmFzSGVpZ2h0LFxuICAgICAgbGluZUhlaWdodDogbGluZUhlaWdodCxcbiAgICAgIGNoYXJXaWR0aDogY2hhcldpZHRoLFxuICAgICAgY2hhckhlaWdodDogY2hhckhlaWdodFxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGluZSA9IGxpbmVzW2ldXG4gICAgICBsZXQgc2NyZWVuUm93ID0gZmlyc3RSb3cgKyBpXG4gICAgICBsZXQgeCA9IDBcblxuICAgICAgcmVuZGVyRGF0YS5yb3cgPSBvZmZzZXRSb3cgKyBpXG4gICAgICByZW5kZXJEYXRhLnlSb3cgPSByZW5kZXJEYXRhLnJvdyAqIGxpbmVIZWlnaHRcbiAgICAgIHJlbmRlckRhdGEuc2NyZWVuUm93ID0gc2NyZWVuUm93XG5cbiAgICAgIHRoaXMuZHJhd0RlY29yYXRpb25zKHNjcmVlblJvdywgZGVjb3JhdGlvbnMsICdsaW5lJywgcmVuZGVyRGF0YSwgdGhpcy5kcmF3TGluZURlY29yYXRpb24pXG5cbiAgICAgIHRoaXMuZHJhd0RlY29yYXRpb25zKHNjcmVlblJvdywgZGVjb3JhdGlvbnMsICdoaWdobGlnaHQtdW5kZXInLCByZW5kZXJEYXRhLCB0aGlzLmRyYXdIaWdobGlnaHREZWNvcmF0aW9uKVxuXG4gICAgICBpZiAoKGxpbmUgIT0gbnVsbCA/IGxpbmUudG9rZW5zIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIGxldCB0b2tlbnMgPSBsaW5lLnRva2Vuc1xuICAgICAgICBmb3IgKGxldCBqID0gMCwgdG9rZW5zQ291bnQgPSB0b2tlbnMubGVuZ3RoOyBqIDwgdG9rZW5zQ291bnQ7IGorKykge1xuICAgICAgICAgIGxldCB0b2tlbiA9IHRva2Vuc1tqXVxuICAgICAgICAgIGxldCB3ID0gdG9rZW4uc2NyZWVuRGVsdGFcbiAgICAgICAgICBpZiAoIXRva2VuLmlzT25seVdoaXRlc3BhY2UoKSkge1xuICAgICAgICAgICAgbGV0IGNvbG9yID0gZGlzcGxheUNvZGVIaWdobGlnaHRzID8gdGhpcy5nZXRUb2tlbkNvbG9yKHRva2VuKSA6IHRoaXMuZ2V0RGVmYXVsdENvbG9yKClcblxuICAgICAgICAgICAgbGV0IHZhbHVlID0gdG9rZW4udmFsdWVcbiAgICAgICAgICAgIGlmIChpbnZpc2libGVSZWdFeHAgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoaW52aXNpYmxlUmVnRXhwLCAnICcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4ID0gdGhpcy5kcmF3VG9rZW4oY29udGV4dCwgdmFsdWUsIGNvbG9yLCB4LCByZW5kZXJEYXRhLnlSb3csIGNoYXJXaWR0aCwgY2hhckhlaWdodClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCArPSB3ICogY2hhcldpZHRoXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHggPiBjYW52YXNXaWR0aCkgeyBicmVhayB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5kcmF3RGVjb3JhdGlvbnMoc2NyZWVuUm93LCBkZWNvcmF0aW9ucywgJ2hpZ2hsaWdodC1vdmVyJywgcmVuZGVyRGF0YSwgdGhpcy5kcmF3SGlnaGxpZ2h0RGVjb3JhdGlvbilcblxuICAgICAgdGhpcy5kcmF3RGVjb3JhdGlvbnMoc2NyZWVuUm93LCBkZWNvcmF0aW9ucywgJ2hpZ2hsaWdodC1vdXRsaW5lJywgcmVuZGVyRGF0YSwgdGhpcy5kcmF3SGlnaGxpZ2h0T3V0bGluZURlY29yYXRpb24pXG4gICAgfVxuXG4gICAgY29udGV4dC5maWxsKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByZWdleHAgdG8gcmVwbGFjZSBpbnZpc2libGVzIHN1YnN0aXR1dGlvbiBjaGFyYWN0ZXJzXG4gICAqIGluIGVkaXRvciBsaW5lcy5cbiAgICpcbiAgICogQHBhcmFtICB7VG9rZW5pemVkTGluZX0gbGluZSBhIHRva2VuaXplZCBsaXplIHRvIHJlYWQgdGhlIGludmlzaWJsZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcnNcbiAgICogQHJldHVybiB7UmVnRXhwfSB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGludmlzaWJsZSBjaGFyYWN0ZXJzXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZ2V0SW52aXNpYmxlUmVnRXhwIChsaW5lKSB7XG4gICAgaWYgKChsaW5lICE9IG51bGwpICYmIChsaW5lLmludmlzaWJsZXMgIT0gbnVsbCkpIHtcbiAgICAgIGxldCBpbnZpc2libGVzID0gW11cbiAgICAgIGlmIChsaW5lLmludmlzaWJsZXMuY3IgIT0gbnVsbCkgeyBpbnZpc2libGVzLnB1c2gobGluZS5pbnZpc2libGVzLmNyKSB9XG4gICAgICBpZiAobGluZS5pbnZpc2libGVzLmVvbCAhPSBudWxsKSB7IGludmlzaWJsZXMucHVzaChsaW5lLmludmlzaWJsZXMuZW9sKSB9XG4gICAgICBpZiAobGluZS5pbnZpc2libGVzLnNwYWNlICE9IG51bGwpIHsgaW52aXNpYmxlcy5wdXNoKGxpbmUuaW52aXNpYmxlcy5zcGFjZSkgfVxuICAgICAgaWYgKGxpbmUuaW52aXNpYmxlcy50YWIgIT0gbnVsbCkgeyBpbnZpc2libGVzLnB1c2gobGluZS5pbnZpc2libGVzLnRhYikgfVxuXG4gICAgICByZXR1cm4gUmVnRXhwKGludmlzaWJsZXMuZmlsdGVyKChzKSA9PiB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZydcbiAgICAgIH0pLm1hcChfLmVzY2FwZVJlZ0V4cCkuam9pbignfCcpLCAnZycpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIGEgc2luZ2xlIHRva2VuIG9uIHRoZSBnaXZlbiBjb250ZXh0LlxuICAgKlxuICAgKiBAcGFyYW0gIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHQgdGhlIHRhcmdldCBjYW52YXMgY29udGV4dFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRleHQgdGhlIHRva2VuJ3MgdGV4dCBjb250ZW50XG4gICAqIEBwYXJhbSAge3N0cmluZ30gY29sb3IgdGhlIHRva2VuJ3MgQ1NTIGNvbG9yXG4gICAqIEBwYXJhbSAge251bWJlcn0geCB0aGUgeCBwb3NpdGlvbiBvZiB0aGUgdG9rZW4gaW4gdGhlIGxpbmVcbiAgICogQHBhcmFtICB7bnVtYmVyfSB5IHRoZSB5IHBvc2l0aW9uIG9mIHRoZSBsaW5lIGluIHRoZSBtaW5pbWFwXG4gICAqIEBwYXJhbSAge251bWJlcn0gY2hhcldpZHRoIHRoZSB3aWR0aCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgbWluaW1hcFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGNoYXJIZWlnaHQgdGhlIGhlaWdodCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgbWluaW1hcFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB4IHBvc2l0aW9uIGF0IHRoZSBlbmQgb2YgdGhlIHRva2VuXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd1Rva2VuIChjb250ZXh0LCB0ZXh0LCBjb2xvciwgeCwgeSwgY2hhcldpZHRoLCBjaGFySGVpZ2h0KSB7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvclxuXG4gICAgbGV0IGNoYXJzID0gMFxuICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSB0ZXh0Lmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBsZXQgY2hhciA9IHRleHRbal1cbiAgICAgIGlmICgvXFxzLy50ZXN0KGNoYXIpKSB7XG4gICAgICAgIGlmIChjaGFycyA+IDApIHtcbiAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KHggLSAoY2hhcnMgKiBjaGFyV2lkdGgpLCB5LCBjaGFycyAqIGNoYXJXaWR0aCwgY2hhckhlaWdodClcbiAgICAgICAgfVxuICAgICAgICBjaGFycyA9IDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYXJzKytcbiAgICAgIH1cbiAgICAgIHggKz0gY2hhcldpZHRoXG4gICAgfVxuICAgIGlmIChjaGFycyA+IDApIHtcbiAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCAtIChjaGFycyAqIGNoYXJXaWR0aCksIHksIGNoYXJzICogY2hhcldpZHRoLCBjaGFySGVpZ2h0KVxuICAgIH1cbiAgICByZXR1cm4geFxuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIHRoZSBzcGVjaWZpZWQgZGVjb3JhdGlvbnMgZm9yIHRoZSBjdXJyZW50IGBzY3JlZW5Sb3dgLlxuICAgKlxuICAgKiBUaGUgYGRlY29yYXRpb25zYCBvYmplY3QgY29udGFpbnMgYWxsIHRoZSBkZWNvcmF0aW9ucyBncm91cGVkIGJ5IHR5cGUgYW5kXG4gICAqIHRoZW4gcm93cy5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBzY3JlZW5Sb3cgdGhlIHNjcmVlbiByb3cgaW5kZXggZm9yIHdoaWNoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlciBkZWNvcmF0aW9uc1xuICAgKiBAcGFyYW0gIHtPYmplY3R9IGRlY29yYXRpb25zIHRoZSBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGRlY29yYXRpb25zXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdHlwZSB0aGUgdHlwZSBvZiBkZWNvcmF0aW9ucyB0byByZW5kZXJcbiAgICogQHBhcmFtICB7T2JqZWN0fSByZW5kZXJEYXRhIHRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgcmVuZGVyIGRhdGFcbiAgICogQHBhcmFtICB7RnVuZHRpb259IHJlbmRlck1ldGhvZCB0aGUgbWV0aG9kIHRvIGNhbGwgdG8gcmVuZGVyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGRlY29yYXRpb25zXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd0RlY29yYXRpb25zIChzY3JlZW5Sb3csIGRlY29yYXRpb25zLCB0eXBlLCByZW5kZXJEYXRhLCByZW5kZXJNZXRob2QpIHtcbiAgICBsZXQgcmVmXG4gICAgZGVjb3JhdGlvbnMgPSAocmVmID0gZGVjb3JhdGlvbnNbdHlwZV0pICE9IG51bGwgPyByZWZbc2NyZWVuUm93XSA6IHZvaWQgMFxuXG4gICAgaWYgKGRlY29yYXRpb25zICE9IG51bGwgPyBkZWNvcmF0aW9ucy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBkZWNvcmF0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICByZW5kZXJNZXRob2QuY2FsbCh0aGlzLCBkZWNvcmF0aW9uc1tpXSwgcmVuZGVyRGF0YSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgYSBsaW5lIGRlY29yYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSAge0RlY29yYXRpb259IGRlY29yYXRpb24gdGhlIGRlY29yYXRpb24gdG8gcmVuZGVyXG4gICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSB0aGUgZGF0YSBuZWVkIHRvIHBlcmZvcm0gdGhlIHJlbmRlclxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGRyYXdMaW5lRGVjb3JhdGlvbiAoZGVjb3JhdGlvbiwgZGF0YSkge1xuICAgIGRhdGEuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmdldERlY29yYXRpb25Db2xvcihkZWNvcmF0aW9uKVxuICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCBkYXRhLnlSb3csIGRhdGEuY2FudmFzV2lkdGgsIGRhdGEubGluZUhlaWdodClcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyBhIGhpZ2hsaWdodCBkZWNvcmF0aW9uLlxuICAgKlxuICAgKiBJdCByZW5kZXJzIG9ubHkgdGhlIHBhcnQgb2YgdGhlIGhpZ2hsaWdodCBjb3JyZXNwb25kaW5nIHRvIHRoZSBzcGVjaWZpZWRcbiAgICogcm93LlxuICAgKlxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgdGhlIGRhdGEgbmVlZCB0byBwZXJmb3JtIHRoZSByZW5kZXJcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3SGlnaGxpZ2h0RGVjb3JhdGlvbiAoZGVjb3JhdGlvbiwgZGF0YSkge1xuICAgIGxldCByYW5nZSA9IGRlY29yYXRpb24uZ2V0TWFya2VyKCkuZ2V0U2NyZWVuUmFuZ2UoKVxuICAgIGxldCByb3dTcGFuID0gcmFuZ2UuZW5kLnJvdyAtIHJhbmdlLnN0YXJ0LnJvd1xuXG4gICAgZGF0YS5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZ2V0RGVjb3JhdGlvbkNvbG9yKGRlY29yYXRpb24pXG5cbiAgICBpZiAocm93U3BhbiA9PT0gMCkge1xuICAgICAgbGV0IGNvbFNwYW4gPSByYW5nZS5lbmQuY29sdW1uIC0gcmFuZ2Uuc3RhcnQuY29sdW1uXG4gICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QocmFuZ2Uuc3RhcnQuY29sdW1uICogZGF0YS5jaGFyV2lkdGgsIGRhdGEueVJvdywgY29sU3BhbiAqIGRhdGEuY2hhcldpZHRoLCBkYXRhLmxpbmVIZWlnaHQpXG4gICAgfSBlbHNlIGlmIChkYXRhLnNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93KSB7XG4gICAgICBsZXQgeCA9IHJhbmdlLnN0YXJ0LmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoXG4gICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeCwgZGF0YS55Um93LCBkYXRhLmNhbnZhc1dpZHRoIC0geCwgZGF0YS5saW5lSGVpZ2h0KVxuICAgIH0gZWxzZSBpZiAoZGF0YS5zY3JlZW5Sb3cgPT09IHJhbmdlLmVuZC5yb3cpIHtcbiAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCBkYXRhLnlSb3csIHJhbmdlLmVuZC5jb2x1bW4gKiBkYXRhLmNoYXJXaWR0aCwgZGF0YS5saW5lSGVpZ2h0KVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoMCwgZGF0YS55Um93LCBkYXRhLmNhbnZhc1dpZHRoLCBkYXRhLmxpbmVIZWlnaHQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIGEgaGlnaGxpZ2h0IG91dGxpbmUgZGVjb3JhdGlvbi5cbiAgICpcbiAgICogSXQgcmVuZGVycyBvbmx5IHRoZSBwYXJ0IG9mIHRoZSBoaWdobGlnaHQgY29ycmVzcG9uZGluZyB0byB0aGUgc3BlY2lmaWVkXG4gICAqIHJvdy5cbiAgICpcbiAgICogQHBhcmFtICB7RGVjb3JhdGlvbn0gZGVjb3JhdGlvbiB0aGUgZGVjb3JhdGlvbiB0byByZW5kZXJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBkYXRhIHRoZSBkYXRhIG5lZWQgdG8gcGVyZm9ybSB0aGUgcmVuZGVyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd0hpZ2hsaWdodE91dGxpbmVEZWNvcmF0aW9uIChkZWNvcmF0aW9uLCBkYXRhKSB7XG4gICAgbGV0IGJvdHRvbVdpZHRoLCBjb2xTcGFuLCB3aWR0aCwgeEJvdHRvbVN0YXJ0LCB4RW5kLCB4U3RhcnRcbiAgICBsZXQge2xpbmVIZWlnaHQsIGNoYXJXaWR0aCwgY2FudmFzV2lkdGgsIHNjcmVlblJvd30gPSBkYXRhXG4gICAgbGV0IHJhbmdlID0gZGVjb3JhdGlvbi5nZXRNYXJrZXIoKS5nZXRTY3JlZW5SYW5nZSgpXG4gICAgbGV0IHJvd1NwYW4gPSByYW5nZS5lbmQucm93IC0gcmFuZ2Uuc3RhcnQucm93XG4gICAgbGV0IHlTdGFydCA9IGRhdGEueVJvd1xuICAgIGxldCB5RW5kID0geVN0YXJ0ICsgbGluZUhlaWdodFxuXG4gICAgZGF0YS5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZ2V0RGVjb3JhdGlvbkNvbG9yKGRlY29yYXRpb24pXG5cbiAgICBpZiAocm93U3BhbiA9PT0gMCkge1xuICAgICAgY29sU3BhbiA9IHJhbmdlLmVuZC5jb2x1bW4gLSByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgIHdpZHRoID0gY29sU3BhbiAqIGNoYXJXaWR0aFxuICAgICAgeFN0YXJ0ID0gcmFuZ2Uuc3RhcnQuY29sdW1uICogY2hhcldpZHRoXG4gICAgICB4RW5kID0geFN0YXJ0ICsgd2lkdGhcblxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCB3aWR0aCwgMSlcbiAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCh4U3RhcnQsIHlFbmQsIHdpZHRoLCAxKVxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCAxLCBsaW5lSGVpZ2h0KVxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICB9IGVsc2UgaWYgKHJvd1NwYW4gPT09IDEpIHtcbiAgICAgIHhTdGFydCA9IHJhbmdlLnN0YXJ0LmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoXG4gICAgICB4RW5kID0gcmFuZ2UuZW5kLmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoXG5cbiAgICAgIGlmIChzY3JlZW5Sb3cgPT09IHJhbmdlLnN0YXJ0LnJvdykge1xuICAgICAgICB3aWR0aCA9IGRhdGEuY2FudmFzV2lkdGggLSB4U3RhcnRcbiAgICAgICAgeEJvdHRvbVN0YXJ0ID0gTWF0aC5tYXgoeFN0YXJ0LCB4RW5kKVxuICAgICAgICBib3R0b21XaWR0aCA9IGRhdGEuY2FudmFzV2lkdGggLSB4Qm90dG9tU3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIHdpZHRoLCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeEJvdHRvbVN0YXJ0LCB5RW5kLCBib3R0b21XaWR0aCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCAxLCBsaW5lSGVpZ2h0KVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoY2FudmFzV2lkdGggLSAxLCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWR0aCA9IGNhbnZhc1dpZHRoIC0geFN0YXJ0XG4gICAgICAgIGJvdHRvbVdpZHRoID0gY2FudmFzV2lkdGggLSB4RW5kXG5cbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgeFN0YXJ0LCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoMCwgeUVuZCwgeEVuZCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgeFN0YXJ0ID0gcmFuZ2Uuc3RhcnQuY29sdW1uICogY2hhcldpZHRoXG4gICAgICB4RW5kID0gcmFuZ2UuZW5kLmNvbHVtbiAqIGNoYXJXaWR0aFxuICAgICAgaWYgKHNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93KSB7XG4gICAgICAgIHdpZHRoID0gY2FudmFzV2lkdGggLSB4U3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIHdpZHRoLCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdChjYW52YXNXaWR0aCAtIDEsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH0gZWxzZSBpZiAoc2NyZWVuUm93ID09PSByYW5nZS5lbmQucm93KSB7XG4gICAgICAgIHdpZHRoID0gY2FudmFzV2lkdGggLSB4U3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoMCwgeUVuZCwgeEVuZCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdChjYW52YXNXaWR0aCAtIDEsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgaWYgKHNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93ICsgMSkge1xuICAgICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCB5U3RhcnQsIHhTdGFydCwgMSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NyZWVuUm93ID09PSByYW5nZS5lbmQucm93IC0gMSkge1xuICAgICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCh4RW5kLCB5RW5kLCBjYW52YXNXaWR0aCAtIHhFbmQsIDEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29weSBhIHBhcnQgb2YgdGhlIG9mZnNjcmVlbiBiaXRtYXAgaW50byB0aGUgb25zY3JlZW4gb25lIHRvXG4gICAqIHJlZHVjZSB0aGUgYW1vdW50IG9mIHJlbmRlcmVkIGxpbmVzIGR1cmluZyBzY3JvbGwuXG4gICAqXG4gICAqIEBwYXJhbSAge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY29udGV4dCBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge0hUTUxDYW52YXNFbGVtZW50fSBiaXRtYXBDYW52YXMgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHNyY1JvdyB0aGUgc291cmNlIHJvdyBvZiB0aGUgcmVnaW9uIHRvIGNvcHlcbiAgICogQHBhcmFtICB7bnVtYmVyfSBkZXN0Um93IHRoZSBkZXN0aW5hdGlvbiByb3dcbiAgICogQHBhcmFtICB7bnVtYmVyfSByb3dDb3VudCB0aGUgYW1vdW50IG9mIGxpbmVzIHRvIGNvcHlcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjb3B5Qml0bWFwUGFydCAoY29udGV4dCwgYml0bWFwQ2FudmFzLCBzcmNSb3csIGRlc3RSb3csIHJvd0NvdW50KSB7XG4gICAgbGV0IGxpbmVIZWlnaHQgPSB0aGlzLm1pbmltYXAuZ2V0TGluZUhlaWdodCgpICogZGV2aWNlUGl4ZWxSYXRpb1xuXG4gICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICBiaXRtYXBDYW52YXMsXG4gICAgICAwLCBzcmNSb3cgKiBsaW5lSGVpZ2h0LCBiaXRtYXBDYW52YXMud2lkdGgsIHJvd0NvdW50ICogbGluZUhlaWdodCxcbiAgICAgIDAsIGRlc3RSb3cgKiBsaW5lSGVpZ2h0LCBiaXRtYXBDYW52YXMud2lkdGgsIHJvd0NvdW50ICogbGluZUhlaWdodFxuICAgIClcbiAgfVxuXG4gIC8vICAgICMjIyMjIyMjICAgICAjIyMgICAgIyMgICAgIyMgICMjIyMjIyAgICMjIyMjIyMjICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICAgIyMgIyMgICAjIyMgICAjIyAjIyAgICAjIyAgIyMgICAgICAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICAjIyAgICMjICAjIyMjICAjIyAjIyAgICAgICAgIyMgICAgICAgIyNcbiAgLy8gICAgIyMjIyMjIyMgICMjICAgICAjIyAjIyAjIyAjIyAjIyAgICMjIyMgIyMjIyMjICAgICMjIyMjI1xuICAvLyAgICAjIyAgICMjICAgIyMjIyMjIyMjICMjICAjIyMjICMjICAgICMjICAjIyAgICAgICAgICAgICAjI1xuICAvLyAgICAjIyAgICAjIyAgIyMgICAgICMjICMjICAgIyMjICMjICAgICMjICAjIyAgICAgICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICMjICAjIyMjIyMgICAjIyMjIyMjIyAgIyMjIyMjXG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIGxpbmVzIGJldHdlZW4gdGhlIGludGFjdCByYW5nZXMgd2hlbiBhbiB1cGRhdGUgaGFzIHBlbmRpbmdcbiAgICogY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtICB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjb250ZXh0IHRoZSB0YXJnZXQgY2FudmFzIGNvbnRleHRcbiAgICogQHBhcmFtICB7QXJyYXk8T2JqZWN0Pn0gaW50YWN0UmFuZ2VzIHRoZSBpbnRhY3QgcmFuZ2VzIGluIHRoZSBtaW5pbWFwXG4gICAqIEBwYXJhbSAge251bWJlcn0gZmlyc3RSb3cgdGhlIGZpcnN0IHJvdyBvZiB0aGUgcmVuZGVyZWQgcmVnaW9uXG4gICAqIEBwYXJhbSAge251bWJlcn0gbGFzdFJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJlbmRlcmVkIHJlZ2lvblxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGZpbGxHYXBzQmV0d2VlbkludGFjdFJhbmdlcyAoY29udGV4dCwgaW50YWN0UmFuZ2VzLCBmaXJzdFJvdywgbGFzdFJvdykge1xuICAgIGxldCBjdXJyZW50Um93ID0gZmlyc3RSb3dcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW50YWN0UmFuZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgaW50YWN0ID0gaW50YWN0UmFuZ2VzW2ldXG5cbiAgICAgIHRoaXMuZHJhd0xpbmVzKGNvbnRleHQsIGN1cnJlbnRSb3csIGludGFjdC5zdGFydCAtIDEsIGN1cnJlbnRSb3cgLSBmaXJzdFJvdylcblxuICAgICAgY3VycmVudFJvdyA9IGludGFjdC5lbmRcbiAgICB9XG4gICAgaWYgKGN1cnJlbnRSb3cgPD0gbGFzdFJvdykge1xuICAgICAgdGhpcy5kcmF3TGluZXMoY29udGV4dCwgY3VycmVudFJvdywgbGFzdFJvdywgY3VycmVudFJvdyAtIGZpcnN0Um93KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgcmFuZ2VzIHRoYXQgYXJlIG5vdCBhZmZlY3RlZCBieSB0aGUgY3VycmVudCBwZW5kaW5nIGNoYW5nZXMuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gZmlyc3RSb3cgdGhlIGZpcnN0IHJvdyBvZiB0aGUgcmVuZGVyZWQgcmVnaW9uXG4gICAqIEBwYXJhbSAge251bWJlcn0gbGFzdFJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJlbmRlcmVkIHJlZ2lvblxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fSB0aGUgaW50YWN0IHJhbmdlcyBpbiB0aGUgcmVuZGVyZWQgcmVnaW9uXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY29tcHV0ZUludGFjdFJhbmdlcyAoZmlyc3RSb3csIGxhc3RSb3cpIHtcbiAgICBpZiAoKHRoaXMub2Zmc2NyZWVuRmlyc3RSb3cgPT0gbnVsbCkgJiYgKHRoaXMub2Zmc2NyZWVuTGFzdFJvdyA9PSBudWxsKSkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgbGV0IGludGFjdFJhbmdlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgc3RhcnQ6IHRoaXMub2Zmc2NyZWVuRmlyc3RSb3csXG4gICAgICAgIGVuZDogdGhpcy5vZmZzY3JlZW5MYXN0Um93LFxuICAgICAgICBvZmZzY3JlZW5Sb3c6IDBcbiAgICAgIH1cbiAgICBdXG5cbiAgICBsZXQgY2hhbmdlcyA9IHRoaXMucGVuZGluZ0NoYW5nZXNcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjaGFuZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgY2hhbmdlID0gY2hhbmdlc1tpXVxuICAgICAgbGV0IG5ld0ludGFjdFJhbmdlcyA9IFtdXG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBpbnRhY3RMZW4gPSBpbnRhY3RSYW5nZXMubGVuZ3RoOyBqIDwgaW50YWN0TGVuOyBqKyspIHtcbiAgICAgICAgbGV0IHJhbmdlID0gaW50YWN0UmFuZ2VzW2pdXG5cbiAgICAgICAgaWYgKGNoYW5nZS5lbmQgPCByYW5nZS5zdGFydCAmJiBjaGFuZ2Uuc2NyZWVuRGVsdGEgIT09IDApIHtcbiAgICAgICAgICBuZXdJbnRhY3RSYW5nZXMucHVzaCh7XG4gICAgICAgICAgICBzdGFydDogcmFuZ2Uuc3RhcnQgKyBjaGFuZ2Uuc2NyZWVuRGVsdGEsXG4gICAgICAgICAgICBlbmQ6IHJhbmdlLmVuZCArIGNoYW5nZS5zY3JlZW5EZWx0YSxcbiAgICAgICAgICAgIG9mZnNjcmVlblJvdzogcmFuZ2Uub2Zmc2NyZWVuUm93XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmIChjaGFuZ2UuZW5kIDwgcmFuZ2Uuc3RhcnQgfHwgY2hhbmdlLnN0YXJ0ID4gcmFuZ2UuZW5kKSB7XG4gICAgICAgICAgbmV3SW50YWN0UmFuZ2VzLnB1c2gocmFuZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNoYW5nZS5zdGFydCA+IHJhbmdlLnN0YXJ0KSB7XG4gICAgICAgICAgICBuZXdJbnRhY3RSYW5nZXMucHVzaCh7XG4gICAgICAgICAgICAgIHN0YXJ0OiByYW5nZS5zdGFydCxcbiAgICAgICAgICAgICAgZW5kOiBjaGFuZ2Uuc3RhcnQgLSAxLFxuICAgICAgICAgICAgICBvZmZzY3JlZW5Sb3c6IHJhbmdlLm9mZnNjcmVlblJvd1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNoYW5nZS5lbmQgPCByYW5nZS5lbmQgJiYgY2hhbmdlLmJ1ZmZlckRlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICBuZXdJbnRhY3RSYW5nZXMucHVzaCh7XG4gICAgICAgICAgICAgIHN0YXJ0OiBjaGFuZ2UuZW5kICsgY2hhbmdlLnNjcmVlbkRlbHRhICsgMSxcbiAgICAgICAgICAgICAgZW5kOiByYW5nZS5lbmQgKyBjaGFuZ2Uuc2NyZWVuRGVsdGEsXG4gICAgICAgICAgICAgIG9mZnNjcmVlblJvdzogcmFuZ2Uub2Zmc2NyZWVuUm93ICsgY2hhbmdlLmVuZCArIDEgLSByYW5nZS5zdGFydFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGludGFjdFJhbmdlcyA9IG5ld0ludGFjdFJhbmdlc1xuICAgIH1cblxuICAgIHRoaXMucGVuZGluZ0NoYW5nZXMgPSBbXVxuICAgIHJldHVybiB0aGlzLnRydW5jYXRlSW50YWN0UmFuZ2VzKGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3cpXG4gIH1cblxuICAvKipcbiAgICogVHJ1bmNhdGVzIHRoZSBpbnRhY3QgcmFuZ2VzIHNvIHRoYXQgdGhleSBkb2Vzbid0IGV4cGFuZCBwYXN0IHRoZSB2aXNpYmxlXG4gICAqIGFyZWEgb2YgdGhlIG1pbmltYXAuXG4gICAqXG4gICAqIEBwYXJhbSAge0FycmF5PE9iamVjdD59IGludGFjdFJhbmdlcyB0aGUgaW5pdGlhbCBhcnJheSBvZiByYW5nZXNcbiAgICogQHBhcmFtICB7bnVtYmVyfSBmaXJzdFJvdyB0aGUgZmlyc3Qgcm93IG9mIHRoZSByZW5kZXJlZCByZWdpb25cbiAgICogQHBhcmFtICB7bnVtYmVyfSBsYXN0Um93IHRoZSBsYXN0IHJvdyBvZiB0aGUgcmVuZGVyZWQgcmVnaW9uXG4gICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59IHRoZSBhcnJheSBvZiB0cnVuY2F0ZWQgcmFuZ2VzXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdHJ1bmNhdGVJbnRhY3RSYW5nZXMgKGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3cpIHtcbiAgICBsZXQgaSA9IDBcbiAgICB3aGlsZSAoaSA8IGludGFjdFJhbmdlcy5sZW5ndGgpIHtcbiAgICAgIGxldCByYW5nZSA9IGludGFjdFJhbmdlc1tpXVxuXG4gICAgICBpZiAocmFuZ2Uuc3RhcnQgPCBmaXJzdFJvdykge1xuICAgICAgICByYW5nZS5vZmZzY3JlZW5Sb3cgKz0gZmlyc3RSb3cgLSByYW5nZS5zdGFydFxuICAgICAgICByYW5nZS5zdGFydCA9IGZpcnN0Um93XG4gICAgICB9XG5cbiAgICAgIGlmIChyYW5nZS5lbmQgPiBsYXN0Um93KSB7IHJhbmdlLmVuZCA9IGxhc3RSb3cgfVxuXG4gICAgICBpZiAocmFuZ2Uuc3RhcnQgPj0gcmFuZ2UuZW5kKSB7IGludGFjdFJhbmdlcy5zcGxpY2UoaS0tLCAxKSB9XG5cbiAgICAgIGkrK1xuICAgIH1cblxuICAgIHJldHVybiBpbnRhY3RSYW5nZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEub2Zmc2NyZWVuUm93IC0gYi5vZmZzY3JlZW5Sb3dcbiAgICB9KVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/alholt/.atom/packages/minimap/lib/mixins/canvas-drawer.js
