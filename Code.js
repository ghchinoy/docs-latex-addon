/**
 * LaTeX to Google Docs Native Symbols & Math Formatting Extension
 * 
 * Converts LaTeX formulas into Google Docs native characters and formatting:
 * - Google Docs Special Characters: Greek letters (Δ, α, β), math relations (≈, ≤, ≥),
 *   operators (∑, ∏, ±, ×, ·), arrows (→, ⇒), and blackboard bold (𝕀, ℝ, ℂ).
 * - Google Docs Native Script Formatting: Applies native DocumentApp.TextAlignment.SUBSCRIPT
 *   and SUPERSCRIPT directly to characters (identical to Format > Text > Subscript).
 * - 100% Local: Zero PNG images, zero external rendering APIs, zero network dependencies.
 * - Container-Safe: Full support for regular Paragraphs, bullet/numbered ListItems, and Tables.
 */

var APP_VERSION = '1.1.0';
var CHANGELOG_URL = 'https://github.com/ghchinoy/docs-latex-addon/blob/main/CHANGELOG.md';

/**
 * Returns the current extension version.
 */
function getVersion() {
  return APP_VERSION;
}

/**
 * Creates the "LaTeX Math" menu when document is opened.
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('LaTeX Math')
    .addItem('Render Selected into Docs Symbols', 'renderSelectedToNativeSymbols')
    .addItem('Render All in Doc into Docs Symbols', 'renderAllInDocToNativeSymbols')
    .addSeparator()
    .addItem('Open LaTeX Sidebar', 'showSidebar')
    .addSeparator()
    .addItem("What's New & Changelog (v" + APP_VERSION + ")", 'showAboutDialog')
    .addToUi();
}

/**
 * Opens the interactive LaTeX sidebar with KaTeX live preview.
 */
function showSidebar() {
  var template = HtmlService.createTemplateFromFile('Sidebar');
  template.version = APP_VERSION;
  template.changelogUrl = CHANGELOG_URL;
  var html = template.evaluate()
    .setTitle('LaTeX Equation Renderer (v' + APP_VERSION + ')')
    .setWidth(340);
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Opens a modal dialog showing version details and direct access to the Changelog.
 */
function showAboutDialog() {
  var html = [
    '<!DOCTYPE html>',
    '<html>',
    '  <head>',
    '    <base target="_blank">',
    '    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap" rel="stylesheet">',
    '    <style>',
    '      body { font-family: "Google Sans", Roboto, Arial, sans-serif; margin: 0; padding: 20px; color: #202124; background: #fff; }',
    '      .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border-bottom: 1px solid #dadce0; padding-bottom: 10px; }',
    '      .title { font-size: 15px; font-weight: 700; color: #1a73e8; }',
    '      .badge { background: #e8f0fe; color: #1967d2; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; border: 1px solid #c2e7ff; }',
    '      p { font-size: 12px; line-height: 1.5; color: #3c4043; margin-bottom: 12px; }',
    '      .card { background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 12px; }',
    '      .card-title { font-weight: 600; color: #202124; margin-bottom: 6px; }',
    '      ul { margin: 0; padding-left: 18px; color: #3c4043; }',
    '      li { margin-bottom: 5px; line-height: 1.4; }',
    '      .btn-bar { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }',
    '      .btn { font-family: inherit; font-size: 12px; font-weight: 500; padding: 7px 14px; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }',
    '      .btn-primary { background: #1a73e8; color: #fff; border: 1px solid #1a73e8; }',
    '      .btn-primary:hover { background: #1557b0; }',
    '      .btn-secondary { background: #fff; color: #5f6368; border: 1px solid #dadce0; }',
    '      .btn-secondary:hover { background: #f1f3f4; }',
    '    </style>',
    '  </head>',
    '  <body>',
    '    <div class="header">',
    '      <div class="title">LaTeX Math & Symbols Extension</div>',
    '      <span class="badge">v' + APP_VERSION + '</span>',
    '    </div>',
    '    <p>Converts LaTeX math into native Google Docs characters and subscript/superscript formatting without external servers or images.</p>',
    '    <div class="card">',
    '      <div class="card-title">What\'s New in v' + APP_VERSION + ':</div>',
    '      <ul>',
    '        <li><strong>Math Functions:</strong> <code>\\exp</code>, <code>\\ln</code>, <code>\\log</code>, <code>\\sin</code>, <code>\\cos</code>, <code>\\min</code>, <code>\\max</code>, <code>\\argmax</code> render cleanly into Roman font.</li>',
    '        <li><strong>Sub/Superscript Operators:</strong> Support for <code>\\operatorname*{...}</code> with subscript limits.</li>',
    '        <li><strong>Changelog Navigation:</strong> Direct version link from sidebar and document toolbar.</li>',
    '      </ul>',
    '    </div>',
    '    <div class="btn-bar">',
    '      <button class="btn btn-secondary" onclick="google.script.host.close()">Close</button>',
    '      <a class="btn btn-primary" href="' + CHANGELOG_URL + '" target="_blank">Open Full Changelog &rarr;</a>',
    '    </div>',
    '  </body>',
    '</html>'
  ].join('\n');
  var output = HtmlService.createHtmlOutput(html)
    .setWidth(450)
    .setHeight(320);
  DocumentApp.getUi().showModalDialog(output, "What's New & Changelog");
}

/**
 * Action: Converts the currently highlighted LaTeX formula into
 * native Google Docs symbols and subscript/superscript formatting.
 */
function renderSelectedToNativeSymbols() {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();

  if (!selection) {
    DocumentApp.getUi().alert(
      'Selection Required',
      'Please highlight a LaTeX expression (e.g. $\\Delta_{\\text{TN}} \\approx 0$) first.',
      DocumentApp.getUi().ButtonSet.OK
    );
    return { success: false, message: 'No text selected.' };
  }

  var rangeElements = selection.getRangeElements();
  var renderedCount = 0;

  for (var i = 0; i < rangeElements.length; i++) {
    var rangeElement = rangeElements[i];
    var element = rangeElement.getElement();

    if (element.getType() === DocumentApp.ElementType.TEXT) {
      var textElement = element.asText();
      var startOffset = rangeElement.isPartial() ? rangeElement.getStartOffset() : 0;
      var endOffset = rangeElement.isPartial() ? rangeElement.getEndOffsetInclusive() : textElement.getText().length - 1;
      var selectedText = textElement.getText().substring(startOffset, endOffset + 1);

      if (selectedText.trim().length > 0) {
        var matches = findEquationsInText(selectedText);

        if (matches.length > 0) {
          // The user highlighted text containing one or more delimited formulas (e.g. $C2$ vs. $C3$)
          // Sort descending by start index so right-to-left replacement preserves character offsets
          matches.sort(function(a, b) { return b.start - a.start; });
          for (var mIdx = 0; mIdx < matches.length; mIdx++) {
            var eqMatch = matches[mIdx];
            var matchStartInElem = startOffset + eqMatch.start;
            var matchEndInElem = startOffset + eqMatch.end;
            replaceTextWithNativeFormattedMath(textElement, matchStartInElem, matchEndInElem, eqMatch.latex);
            renderedCount++;
          }
        } else {
          // The user highlighted a raw formula without dollar signs (e.g. \Delta_{\text{TN}} \approx 0)
          replaceTextWithNativeFormattedMath(textElement, startOffset, endOffset, selectedText);
          renderedCount++;
        }
      }
    }
  }

  return {
    success: true,
    count: renderedCount,
    message: 'Rendered ' + renderedCount + ' expression(s) into native Google Docs symbols.'
  };
}

/**
 * Action: Finds all LaTeX expressions ($$...$$ and $...$) across the entire document
 * and converts them in-place into native Google Docs symbols and script formatting.
 */
function renderAllInDocToNativeSymbols() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var containers = getAllDocumentContainers(body);
  var totalRendered = 0;

  for (var p = 0; p < containers.length; p++) {
    var container = containers[p];
    totalRendered += renderEquationsInContainer(container);
  }

  return {
    success: true,
    count: totalRendered,
    message: totalRendered > 0
      ? 'Successfully rendered ' + totalRendered + ' equation(s) into native Google Docs symbols.'
      : 'No LaTeX expressions ($$...$$ or $...$) found in document.'
  };
}

/**
 * Replaces a character range in a Text element with formatted runs
 * (applying native Google Docs SUBSCRIPT and SUPERSCRIPT text alignments).
 */
function replaceTextWithNativeFormattedMath(textElement, startOffset, endOffsetInclusive, latex) {
  var runs = UnicodeMap.parseLatexToFormattedRuns(latex);
  if (!runs || runs.length === 0) return;

  // Build the total replacement string
  var totalInsertedText = '';
  for (var r = 0; r < runs.length; r++) {
    totalInsertedText += runs[r].text;
  }

  // To safely handle replacing 100% of a text element without triggering
  // Apps Script's "Cannot delete all characters" exception, insert first, then delete old.
  textElement.insertText(startOffset, totalInsertedText);
  var oldTextStart = startOffset + totalInsertedText.length;
  var oldTextEnd = endOffsetInclusive + totalInsertedText.length;
  textElement.deleteText(oldTextStart, oldTextEnd);

  // Normalize font weight: prevent inherited bolding from markdown (e.g. **$$...$$**)
  // from clinging to math symbols, unless the container is a designated Heading
  var isHeading = false;
  try {
    var parentElem = textElement.getParent();
    if (parentElem && typeof parentElem.getHeading === 'function') {
      var heading = parentElem.getHeading();
      isHeading = (heading !== DocumentApp.ParagraphHeading.NORMAL);
    }
  } catch (_) {}

  if (!isHeading) {
    try {
      textElement.setBold(startOffset, startOffset + totalInsertedText.length - 1, false);
    } catch (_) {}
  }

  // Apply native Google Docs text alignments (SUBSCRIPT, SUPERSCRIPT, NORMAL)
  var currentOffset = startOffset;
  for (var i = 0; i < runs.length; i++) {
    var run = runs[i];
    var len = run.text.length;
    var runStart = currentOffset;
    var runEnd = currentOffset + len - 1;

    if (run.format === 'SUBSCRIPT') {
      textElement.setTextAlignment(runStart, runEnd, DocumentApp.TextAlignment.SUBSCRIPT);
    } else if (run.format === 'SUPERSCRIPT') {
      textElement.setTextAlignment(runStart, runEnd, DocumentApp.TextAlignment.SUPERSCRIPT);
    } else {
      textElement.setTextAlignment(runStart, runEnd, DocumentApp.TextAlignment.NORMAL);
    }

    currentOffset += len;
  }
}

/**
 * Scans a text string for LaTeX equation blocks ($$...$$, \[...\]) and
 * inline math expressions ($...$, \(...\)), returning an array of matches.
 */
function findEquationsInText(text) {
  if (!text || (text.indexOf('$') === -1 && text.indexOf('\\') === -1)) {
    return [];
  }

  var matches = [];

  // Match block math: $$...$$
  var blockRegex = /\$\$([\s\S]+?)\$\$/g;
  var m;
  while ((m = blockRegex.exec(text)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length - 1, latex: m[1], raw: m[0] });
  }

  // Match block math: \[...\]
  var bracketRegex = /\\\[([\s\S]+?)\\\]/g;
  while ((m = bracketRegex.exec(text)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length - 1, latex: m[1], raw: m[0] });
  }

  // Match inline math: $...$ (ignoring currency like $10 or empty $)
  var inlineRegex = /\$([^\s$](?:[^$]*?[^\s$])?)\$/g;
  while ((m = inlineRegex.exec(text)) !== null) {
    var start = m.index;
    var end = m.index + m[0].length - 1;
    var overlaps = false;
    for (var b = 0; b < matches.length; b++) {
      if (start >= matches[b].start && end <= matches[b].end) {
        overlaps = true;
        break;
      }
    }
    if (!overlaps) {
      matches.push({ start: start, end: end, latex: m[1], raw: m[0] });
    }
  }

  // Match inline math: \(...\)
  var parenRegex = /\\\(([\s\S]+?)\\\)/g;
  while ((m = parenRegex.exec(text)) !== null) {
    var pStart = m.index;
    var pEnd = m.index + m[0].length - 1;
    var pOverlaps = false;
    for (var pb = 0; pb < matches.length; pb++) {
      if (pStart >= matches[pb].start && pEnd <= matches[pb].end) {
        pOverlaps = true;
        break;
      }
    }
    if (!pOverlaps) {
      matches.push({ start: pStart, end: pEnd, latex: m[1], raw: m[0] });
    }
  }

  return matches;
}

/**
 * Scans a single container (Paragraph or ListItem) for LaTeX delimiters ($$...$$, $...$, \[...\], \(...\))
 * and renders them in-place from right to left to avoid index displacement.
 */
function renderEquationsInContainer(container) {
  var text = container.getText();
  var matches = findEquationsInText(text);
  if (matches.length === 0) return 0;

  // Sort matches in descending order by start index so right-to-left replacement preserves offsets
  matches.sort(function(a, b) { return b.start - a.start; });

  var count = 0;
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    var textElemInfo = findTextElementAtOffset(container, match.start);
    if (textElemInfo) {
      var startInElem = match.start - textElemInfo.offsetInParagraph;
      var endInElem = match.end - textElemInfo.offsetInParagraph;
      replaceTextWithNativeFormattedMath(textElemInfo.element, startInElem, endInElem, match.latex);
      count++;
    }
  }

  return count;
}

/**
 * Action: Inserts custom LaTeX equation at the cursor position
 * using native Google Docs symbols and script formatting.
 */
function insertNativeMathAtCursor(latex) {
  if (!latex || !latex.trim()) {
    return { success: false, message: 'Please enter a LaTeX formula.' };
  }

  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();

  var runs = UnicodeMap.parseLatexToFormattedRuns(latex);
  if (!runs || runs.length === 0) {
    return { success: false, message: 'Could not parse formula.' };
  }

  var totalInsertedText = '';
  for (var r = 0; r < runs.length; r++) {
    totalInsertedText += runs[r].text;
  }

  var textElement = null;
  var insertOffset = 0;

  if (cursor) {
    var element = cursor.getElement();
    var offset = cursor.getOffset();

    if (element.getType() === DocumentApp.ElementType.TEXT) {
      textElement = element.asText();
      insertOffset = (offset !== -1 && offset !== null) ? offset : textElement.getText().length;
      textElement.insertText(insertOffset, totalInsertedText);
    } else {
      var container = getInsertableContainer(element) || element;
      if (typeof container.editAsText === 'function') {
        textElement = container.editAsText();
        insertOffset = textElement.getText().length;
        textElement.appendText(totalInsertedText);
      } else if (typeof container.appendText === 'function') {
        textElement = container.appendText(totalInsertedText);
        insertOffset = 0;
      }
    }
  } else if (selection) {
    var rangeElements = selection.getRangeElements();
    if (rangeElements.length > 0) {
      var firstElem = rangeElements[0];
      if (firstElem.getElement().getType() === DocumentApp.ElementType.TEXT) {
        textElement = firstElem.getElement().asText();
        var startOffset = firstElem.isPartial() ? firstElem.getStartOffset() : 0;
        var endOffset = firstElem.isPartial() ? firstElem.getEndOffsetInclusive() : textElement.getText().length - 1;
        replaceTextWithNativeFormattedMath(textElement, startOffset, endOffset, latex);
        return { success: true, message: 'Replaced selection with native Google Docs symbols.' };
      }
    }
  } else {
    DocumentApp.getUi().alert('Cursor Required', 'Please click inside the document where you want to insert the symbols.', DocumentApp.getUi().ButtonSet.OK);
    return { success: false, message: 'No cursor position found.' };
  }

  if (textElement) {
    // Normalize font weight unless container is a heading
    var isHeading = false;
    try {
      var parentElem = textElement.getParent();
      if (parentElem && typeof parentElem.getHeading === 'function') {
        var heading = parentElem.getHeading();
        isHeading = (heading !== DocumentApp.ParagraphHeading.NORMAL);
      }
    } catch (_) {}

    if (!isHeading) {
      try {
        textElement.setBold(insertOffset, insertOffset + totalInsertedText.length - 1, false);
      } catch (_) {}
    }

    var currentOffset = insertOffset;
    for (var i = 0; i < runs.length; i++) {
      var run = runs[i];
      var len = run.text.length;
      var runStart = currentOffset;
      var runEnd = currentOffset + len - 1;

      if (run.format === 'SUBSCRIPT') {
        textElement.setTextAlignment(runStart, runEnd, DocumentApp.TextAlignment.SUBSCRIPT);
      } else if (run.format === 'SUPERSCRIPT') {
        textElement.setTextAlignment(runStart, runEnd, DocumentApp.TextAlignment.SUPERSCRIPT);
      } else {
        textElement.setTextAlignment(runStart, runEnd, DocumentApp.TextAlignment.NORMAL);
      }
      currentOffset += len;
    }
    return { success: true, message: 'Inserted native Google Docs symbols at cursor.' };
  }

  return { success: false, message: 'Could not find a valid insertion point at cursor.' };
}

/**
 * Action: Inserts a high-res 2D equation image rendered client-side by KaTeX / MathJax
 * directly at cursor position (or replaces selection) with ZERO external server calls.
 */
function insert2DEquationImage(base64Data, latex) {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  var selection = doc.getSelection();

  var cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  var bytes = Utilities.base64Decode(cleanBase64);
  var blob = Utilities.newBlob(bytes, 'image/png', 'equation.png');

  var insertedImage = null;

  if (cursor) {
    var element = cursor.getElement();
    var offset = cursor.getOffset();
    if (element.getType() === DocumentApp.ElementType.TEXT) {
      var parent = getInsertableContainer(element) || element.getParent();
      var idx = parent.getChildIndex(element);
      var fullText = element.asText().getText();
      if (offset <= 0) {
        insertedImage = parent.insertInlineImage(idx, blob);
      } else if (offset >= fullText.length) {
        insertedImage = parent.insertInlineImage(idx + 1, blob);
      } else {
        var suffix = element.asText().copy();
        suffix.deleteText(0, offset - 1);
        element.asText().deleteText(offset, fullText.length - 1);
        insertedImage = parent.insertInlineImage(idx + 1, blob);
        parent.insertText(idx + 2, suffix);
      }
    } else {
      var container = getInsertableContainer(element) || element;
      if (typeof container.appendInlineImage === 'function') {
        insertedImage = container.appendInlineImage(blob);
      }
    }
  } else if (selection) {
    var rangeElements = selection.getRangeElements();
    if (rangeElements.length > 0) {
      var firstElem = rangeElements[0];
      var container = getInsertableContainer(firstElem.getElement());
      if (firstElem.getElement().getType() === DocumentApp.ElementType.TEXT) {
        var textElem = firstElem.getElement().asText();
        var sOff = firstElem.isPartial() ? firstElem.getStartOffset() : 0;
        var eOff = firstElem.isPartial() ? firstElem.getEndOffsetInclusive() : textElem.getText().length - 1;
        var full = textElem.getText();
        var cIdx = container.getChildIndex(textElem);

        if (sOff === 0 && eOff >= full.length - 1) {
          insertedImage = container.insertInlineImage(cIdx, blob);
          textElem.removeFromParent();
        } else if (sOff === 0) {
          insertedImage = container.insertInlineImage(cIdx, blob);
          textElem.deleteText(0, eOff);
        } else if (eOff >= full.length - 1) {
          insertedImage = container.insertInlineImage(cIdx + 1, blob);
          textElem.deleteText(sOff, eOff);
        } else {
          var suff = textElem.copy().asText();
          suff.deleteText(0, eOff);
          textElem.deleteText(sOff, full.length - 1);
          insertedImage = container.insertInlineImage(cIdx + 1, blob);
          container.insertText(cIdx + 2, suff);
        }
      }
    }
  }

  if (insertedImage) {
    insertedImage.setAltDescription(latex);
    insertedImage.setAltTitle('LaTeX: ' + latex);
    var origW = insertedImage.getWidth();
    var origH = insertedImage.getHeight();
    if (origW && origH) {
      insertedImage.setWidth(Math.max(10, Math.round(origW / 2.5)));
      insertedImage.setHeight(Math.max(10, Math.round(origH / 2.5)));
    }
    return { success: true, message: 'Inserted 2D equation into document.' };
  }

  return { success: false, message: 'Could not find a valid insertion position.' };
}

/**
 * Resolves the nearest ancestor that supports text operations (Paragraph or ListItem).
 */
function getInsertableContainer(element) {
  var current = element;
  while (current) {
    var type = current.getType ? current.getType() : null;
    if (type === DocumentApp.ElementType.PARAGRAPH || type === DocumentApp.ElementType.LIST_ITEM) {
      return current;
    }
    current = current.getParent ? current.getParent() : null;
  }
  return null;
}

/**
 * Finds the child Text element within a container that contains the given character offset.
 */
function findTextElementAtOffset(container, targetOffset) {
  var currentOffset = 0;
  for (var i = 0; i < container.getNumChildren(); i++) {
    var child = container.getChild(i);
    if (child.getType() === DocumentApp.ElementType.TEXT) {
      var t = child.asText();
      var len = t.getText().length;
      if (targetOffset >= currentOffset && targetOffset < currentOffset + len) {
        return {
          element: t,
          childIndex: i,
          offsetInParagraph: currentOffset
        };
      }
      currentOffset += len;
    }
  }
  return null;
}

/**
 * Collects all Paragraph and ListItem containers from body and tables.
 */
function getAllDocumentContainers(body) {
  var containers = [];

  for (var i = 0; i < body.getNumChildren(); i++) {
    var child = body.getChild(i);
    var type = child.getType();

    if (type === DocumentApp.ElementType.PARAGRAPH || type === DocumentApp.ElementType.LIST_ITEM) {
      containers.push(child);
    } else if (type === DocumentApp.ElementType.TABLE) {
      var table = child.asTable();
      for (var r = 0; r < table.getNumRows(); r++) {
        var row = table.getRow(r);
        for (var c = 0; c < row.getNumCells(); c++) {
          var cell = row.getCell(c);
          for (var p = 0; p < cell.getNumChildren(); p++) {
            var cellChild = cell.getChild(p);
            var cellType = cellChild.getType();
            if (cellType === DocumentApp.ElementType.PARAGRAPH || cellType === DocumentApp.ElementType.LIST_ITEM) {
              containers.push(cellChild);
            }
          }
        }
      }
    }
  }

  return containers;
}

// Export for Node testing environment if present
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APP_VERSION: APP_VERSION,
    CHANGELOG_URL: CHANGELOG_URL,
    getVersion: getVersion
  };
}
