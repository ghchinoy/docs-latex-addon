/**
 * Copyright (c) 2026 Hussain Chinoy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * LaTeX-to-Unicode Mapping & Translation Engine for Google Docs
 * Provides direct conversion of mathematical symbols, Greek letters,
 * superscripts, subscripts, blackboard bold, and operators into
 * native Google Docs special characters and formatted runs.
 */

var UnicodeMap = (function() {
  // Greek Lowercase (Google Docs Symbols)
  var GREEK_LOWER = {
    'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ',
    'epsilon': 'ε', 'varepsilon': 'ϵ', 'zeta': 'ζ', 'eta': 'η',
    'theta': 'θ', 'vartheta': 'ϑ', 'iota': 'ι', 'kappa': 'κ',
    'lambda': 'λ', 'mu': 'μ', 'nu': 'ν', 'xi': 'ξ',
    'pi': 'π', 'varpi': 'ϖ', 'rho': 'ρ', 'varrho': 'ϱ',
    'sigma': 'σ', 'varsigma': 'ς', 'tau': 'τ', 'upsilon': 'υ',
    'phi': 'ϕ', 'varphi': 'φ', 'chi': 'χ', 'psi': 'ψ', 'omega': 'ω'
  };

  // Greek Uppercase (Google Docs Symbols)
  var GREEK_UPPER = {
    'Gamma': 'Γ', 'Delta': 'Δ', 'Theta': 'Θ', 'Lambda': 'Λ',
    'Xi': 'Ξ', 'Pi': 'Π', 'Sigma': 'Σ', 'Upsilon': 'Υ',
    'Phi': 'Φ', 'Psi': 'Ψ', 'Omega': 'Ω'
  };

  // Blackboard Bold (Double-Struck Characters)
  var BLACKBOARD_BOLD = {
    'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾',
    'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ',
    'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌',
    'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
    '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞',
    '7': '𝟟', '8': '𝟠', '9': '𝟡'
  };

  // Mathematical Script / Calligraphic Characters (\mathcal{A}..\mathcal{Z})
  var MATHCAL = {
    'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢',
    'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩',
    'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰',
    'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
  };

  // Mathematical Operators, Relations & Symbols (Google Docs Symbols)
  var SYMBOLS = {
    // Arithmetic & Operators
    'pm': '±', 'mp': '∓', 'times': '×', 'div': '÷', 'cdot': '·',
    'ast': '∗', 'star': '★', 'circ': '∘', 'bullet': '•',
    'sum': '∑', 'prod': '∏', 'coprod': '∐',
    'int': '∫', 'iint': '∬', 'iiint': '∭', 'oint': '∮',
    'nabla': '∇', 'partial': '∂', 'infty': '∞',
    'aleph': 'ℵ', 'hbar': 'ℏ', 'ell': 'ℓ',

    // Relations & Logic
    'le': '≤', 'leq': '≤', 'ge': '≥', 'geq': '≥',
    'ne': '≠', 'neq': '≠', 'approx': '≈', 'sim': '∼', 'simeq': '≃',
    'equiv': '≡', 'cong': '≅', 'propto': '∝',
    'll': '≪', 'gg': '≫', 'parallel': '∥', 'perp': '⊥',
    'forall': '∀', 'exists': '∃', 'nexists': '∄',
    'neg': '¬', 'lor': '∨', 'land': '∧',
    'in': '∈', 'notin': '∉', 'ni': '∋',
    'subset': '⊂', 'subseteq': '⊆', 'supset': '⊃', 'supseteq': '⊇',
    'cap': '∩', 'cup': '∪', 'setminus': '∖', 'emptyset': '∅',

    // Arrows
    'to': '→', 'rightarrow': '→', 'leftarrow': '←',
    'leftrightarrow': '↔', 'Rightarrow': '⇒', 'Leftarrow': '⇐',
    'Leftrightarrow': '⇔', 'mapsto': '↦', 'longmapsto': '⟼',
    'longrightarrow': '⟶', 'longleftarrow': '⟵', 'longleftrightarrow': '⟷',
    'Longrightarrow': '⟹', 'Longleftarrow': '⟸', 'Longleftrightarrow': '⟺',
    'nearrow': '↗', 'searrow': '↘',
    'swarrow': '↙', 'nwarrow': '↖', 'uparrow': '↑', 'downarrow': '↓',

    // Brackets & Punctuations
    'langle': '⟨', 'rangle': '⟩', 'lceil': '⌈', 'rceil': '⌉',
    'lfloor': '⌊', 'rfloor': '⌋', 'dots': '…', 'ldots': '…', 'cdots': '⋯',
    'ddots': '⋱', 'vdots': '⋮', 'prime': '′', 'dag': '†', 'ddag': '‡'
  };

  // Standard Mathematical Function & Operator Names (e.g. \exp, \ln, \sin, \cos, \argmax)
  var MATH_FUNCTIONS = {
    // Inverse Trigonometric & Hyperbolic
    'arcsin': 'arcsin', 'arccos': 'arccos', 'arctan': 'arctan',
    'arccot': 'arccot', 'arcsec': 'arcsec', 'arccsc': 'arccsc',
    'arsinh': 'arsinh', 'arcosh': 'arcosh', 'artanh': 'artanh',
    'sinh': 'sinh', 'cosh': 'cosh', 'tanh': 'tanh', 'coth': 'coth',
    'sech': 'sech', 'csch': 'csch',

    // Trigonometric
    'sin': 'sin', 'cos': 'cos', 'tan': 'tan',
    'csc': 'csc', 'sec': 'sec', 'cot': 'cot',

    // Exponential & Logarithmic
    'exp': 'exp', 'ln': 'ln', 'log': 'log', 'lg': 'lg',

    // Limits, Optimization & Calculus
    'liminf': 'liminf', 'limsup': 'limsup', 'lim': 'lim',
    'argmax': 'argmax', 'argmin': 'argmin',
    'max': 'max', 'min': 'min', 'sup': 'sup', 'inf': 'inf',

    // Linear Algebra & Abstract Algebra
    'det': 'det', 'dim': 'dim', 'ker': 'ker', 'deg': 'deg',
    'gcd': 'gcd', 'hom': 'hom', 'arg': 'arg', 'Pr': 'Pr',
    'rank': 'rank', 'trace': 'trace', 'tr': 'tr', 'diag': 'diag',
    'span': 'span',

    // Statistics & Probability
    'var': 'var', 'Var': 'Var', 'cov': 'cov', 'Cov': 'Cov',

    // Modulo
    'bmod': 'mod', 'mod': 'mod'
  };

  var MATH_FUNC_KEYS = Object.keys(MATH_FUNCTIONS).sort(function(a, b) {
    return b.length - a.length;
  });

  // Unicode Superscript fallbacks
  var SUPERSCRIPTS = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
    'n': 'ⁿ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'T': 'ᵀ', 't': 'ᵗ',
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ',
    'm': 'ᵐ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 'u': 'ᵘ', 'v': 'ᵛ',
    'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ'
  };

  // Unicode Subscript fallbacks
  var SUBSCRIPTS = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
    'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
    'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
    'v': 'ᵥ', 'x': 'ₓ'
  };

  function toSuperscript(str) {
    var out = '';
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      out += SUPERSCRIPTS[c] || c;
    }
    return out;
  }

  function toSubscript(str) {
    var out = '';
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      out += SUBSCRIPTS[c] || c;
    }
    return out;
  }

  function findMatchingBrace(str, openPos) {
    var depth = 0;
    for (var i = openPos; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  /**
   * Tokenizes a LaTeX math formula into structured runs for Google Docs.
   * Each run contains:
   *   text: the string with Greek and math symbols resolved
   *   format: "NORMAL", "SUBSCRIPT", or "SUPERSCRIPT"
   * Protects text commands (\text{...}) so words with underscores aren't broken.
   */
  function parseLatexToFormattedRuns(latex) {
    if (!latex) return [];

    var s = latex.trim();
    // Strip outer quotes if selected with quotes
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      s = s.substring(1, s.length - 1).trim();
    }
    // Strip math delimiters ONLY if the interior does not contain additional matching delimiters
    if (s.startsWith('$$') && s.endsWith('$$') && s.length >= 4) {
      var innerBlock = s.substring(2, s.length - 2);
      if (innerBlock.indexOf('$$') === -1) {
        s = innerBlock.trim();
      }
    } else if (s.startsWith('$') && s.endsWith('$') && s.length >= 2) {
      var innerInline = s.substring(1, s.length - 1);
      if (innerInline.indexOf('$') === -1) {
        s = innerInline.trim();
      }
    } else if (s.startsWith('\\[') && s.endsWith('\\]') && s.length >= 4) {
      var innerBracket = s.substring(2, s.length - 2);
      if (innerBracket.indexOf('\\]') === -1) {
        s = innerBracket.trim();
      }
    } else if (s.startsWith('\\(') && s.endsWith('\\)') && s.length >= 4) {
      var innerParen = s.substring(2, s.length - 2);
      if (innerParen.indexOf('\\)') === -1) {
        s = innerParen.trim();
      }
    }

    // 1. Protect underscores and symbols inside text commands (\text, \mathrm, \operatorname, etc.)
    var textCommands = ['text', 'mathrm', 'mathbf', 'mathit', 'operatorname*', 'operatorname', 'textbf', 'textit'];
    for (var c = 0; c < textCommands.length; c++) {
      var cmd = textCommands[c];
      var search = '\\' + cmd + '{';
      var idx = 0;
      while ((idx = s.indexOf(search, idx)) !== -1) {
        var openPos = idx + search.length - 1;
        var closePos = findMatchingBrace(s, openPos);
        if (closePos === -1) { idx++; continue; }
        var inner = s.substring(openPos + 1, closePos);
        var safeInner = inner.replace(/\\_/g, '_').replace(/_/g, '\uE000')
                             .replace(/\\%/g, '%').replace(/%/g, '\uE001')
                             .replace(/\\&/g, '&').replace(/&/g, '\uE002')
                             .replace(/\\#/g, '#').replace(/#/g, '\uE003');
        s = s.substring(0, idx) + safeInner + s.substring(closePos + 1);
        idx = idx + safeInner.length;
      }
    }

    // 2. Fractions: \frac{num}{den} -> (num) / (den)
    idx = 0;
    while ((idx = s.indexOf('\\frac{', idx)) !== -1) {
      var numOpen = idx + 5;
      var numClose = findMatchingBrace(s, numOpen);
      if (numClose === -1) break;
      var afterNum = numClose + 1;
      if (s[afterNum] !== '{') { idx = afterNum; continue; }
      var denClose = findMatchingBrace(s, afterNum);
      if (denClose === -1) break;
      var num = s.substring(numOpen + 1, numClose);
      var den = s.substring(afterNum + 1, denClose);
      s = s.substring(0, idx) + '(' + num + ') / (' + den + ')' + s.substring(denClose + 1);
    }

    // 3. Roots: \sqrt{x} -> √(x)
    idx = 0;
    while ((idx = s.indexOf('\\sqrt{', idx)) !== -1) {
      var openPos = idx + 5;
      var closePos = findMatchingBrace(s, openPos);
      if (closePos === -1) break;
      var inner = s.substring(openPos + 1, closePos);
      s = s.substring(0, idx) + '√(' + inner + ')' + s.substring(closePos + 1);
    }

    // 4. Blackboard bold: \mathbb{X} -> 𝕀, ℝ, ℂ
    s = s.replace(/\\mathbb\{([A-Za-z0-9])\}/g, function(_, char) {
      return BLACKBOARD_BOLD[char] || char;
    });

    // 4b. Mathematical Script / Calligraphic: \mathcal{X} -> 𝒢, ℒ, ℛ
    s = s.replace(/\\mathcal\{([A-Za-z])\}/g, function(_, char) {
      return MATHCAL[char] || char;
    });

    // Escaped set braces: \{ -> {, \} -> }
    s = s.replace(/\\\{/g, '{').replace(/\\\}/g, '}');

    // 5. Greek lowercase & uppercase
    for (var k in GREEK_LOWER) {
      s = s.replace(new RegExp('\\\\' + k + '(?![a-zA-Z])', 'g'), GREEK_LOWER[k]);
    }
    for (var k in GREEK_UPPER) {
      s = s.replace(new RegExp('\\\\' + k + '(?![a-zA-Z])', 'g'), GREEK_UPPER[k]);
    }

    // 6. Math operators, relations, arrows
    for (var k in SYMBOLS) {
      s = s.replace(new RegExp('\\\\' + k + '(?![a-zA-Z])', 'g'), SYMBOLS[k]);
    }

    // 6b. Standard mathematical functions & operators (\exp, \ln, \log, \sin, \cos, \max, \argmax, etc.)
    s = s.replace(/\\pmod\{([^{}]+)\}/g, '(mod $1)');
    s = s.replace(/\\arg\s*\\max(?![a-zA-Z])/g, '\\argmax');
    s = s.replace(/\\arg\s*\\min(?![a-zA-Z])/g, '\\argmin');
    for (var f = 0; f < MATH_FUNC_KEYS.length; f++) {
      var fn = MATH_FUNC_KEYS[f];
      s = s.replace(new RegExp('\\\\' + fn + '(?![a-zA-Z])', 'g'), MATH_FUNCTIONS[fn]);
    }

    // 7. Formatting spaces & sizing modifiers
    s = s.replace(/\\left\s*\\\{/g, '{')
         .replace(/\\right\s*\\\}/g, '}')
         .replace(/\\left\s*\./g, '')
         .replace(/\\right\s*\./g, '')
         .replace(/\\left\s*([(\[|])/g, '$1')
         .replace(/\\right\s*([)\]|])/g, '$1')
         .replace(/\\,/g, ' ').replace(/\\;/g, ' ').replace(/\\:/g, ' ')
         .replace(/\\quad/g, '   ').replace(/\\qquad/g, '      ').replace(/\\!/g, '');

    // 7b. Extensible arrows (\xrightarrow, \xleftarrow, etc.) & stacked operators (\overset, \underset, \stackrel)
    var xArrows = [
      { cmd: 'xleftrightarrow', left: '←', right: '→' },
      { cmd: 'xLeftrightarrow', left: '⇐', right: '⇔' },
      { cmd: 'xrightarrow',     left: '',  right: '→' },
      { cmd: 'xleftarrow',      left: '←', right: ''  },
      { cmd: 'xRightarrow',     left: '',  right: '⇒' },
      { cmd: 'xLeftarrow',      left: '⇐', right: ''  }
    ];
    for (var xa = 0; xa < xArrows.length; xa++) {
      var arrowSpec = xArrows[xa];
      var searchCmd = '\\' + arrowSpec.cmd;
      var xaIdx = 0;
      while ((xaIdx = s.indexOf(searchCmd, xaIdx)) !== -1) {
        var afterCmd = xaIdx + searchCmd.length;
        if (afterCmd < s.length && /[a-zA-Z]/.test(s[afterCmd])) {
          xaIdx = afterCmd;
          continue;
        }
        var cursor = afterCmd;
        while (cursor < s.length && s[cursor] === ' ') cursor++;
        var belowText = '';
        if (cursor < s.length && s[cursor] === '[') {
          var closeBracket = s.indexOf(']', cursor + 1);
          if (closeBracket !== -1) {
            belowText = s.substring(cursor + 1, closeBracket).trim();
            cursor = closeBracket + 1;
            while (cursor < s.length && s[cursor] === ' ') cursor++;
          }
        }
        if (cursor < s.length && s[cursor] === '{') {
          var braceClose = findMatchingBrace(s, cursor);
          if (braceClose !== -1) {
            var aboveText = s.substring(cursor + 1, braceClose).trim();
            var replacement = arrowSpec.left +
              (aboveText ? '\uE004{ ' + aboveText + ' }' : '') +
              arrowSpec.right +
              (belowText ? '_{' + belowText + '}' : '');
            s = s.substring(0, xaIdx) + replacement + s.substring(braceClose + 1);
            xaIdx += replacement.length;
            continue;
          }
        }
        xaIdx = afterCmd;
      }
    }

    var stackCmds = ['overset', 'stackrel', 'underset'];
    for (var sc = 0; sc < stackCmds.length; sc++) {
      var sCmd = stackCmds[sc];
      var sSearch = '\\' + sCmd + '{';
      var sIdx = 0;
      while ((sIdx = s.indexOf(sSearch, sIdx)) !== -1) {
        var firstOpen = sIdx + sSearch.length - 1;
        var firstClose = findMatchingBrace(s, firstOpen);
        if (firstClose === -1) break;
        var nextPos = firstClose + 1;
        while (nextPos < s.length && s[nextPos] === ' ') nextPos++;
        if (nextPos >= s.length || s[nextPos] !== '{') { sIdx = firstClose + 1; continue; }
        var secondClose = findMatchingBrace(s, nextPos);
        if (secondClose === -1) break;
        var firstArg = s.substring(firstOpen + 1, firstClose).trim();
        var secondArg = s.substring(nextPos + 1, secondClose).trim();
        var stackRep = '';
        if (sCmd === 'underset') {
          stackRep = secondArg + '_{' + firstArg + '}';
        } else if (/^[→←↔⇒⇐⇔⟶⟵⟷⟹⟸⟺↦⟼]$/.test(secondArg)) {
          if (secondArg === '←' || secondArg === '⇐' || secondArg === '⟵' || secondArg === '⟸') {
            stackRep = secondArg + '\uE004{ ' + firstArg + ' }';
          } else {
            stackRep = '\uE004{ ' + firstArg + ' }' + secondArg;
          }
        } else {
          stackRep = secondArg + '^{' + firstArg + '}';
        }
        s = s.substring(0, sIdx) + stackRep + s.substring(secondClose + 1);
        sIdx += stackRep.length;
      }
    }

    // 8. Fix common syntax typos like N{units} or M{sentences} missing the subscript underscore
    s = s.replace(/([a-zA-Z])\{([a-zA-Z0-9_\uE000]+)\}/g, '$1_{$2}');

    // 9. Tokenize into runs of NORMAL, SUBSCRIPT, SUPERSCRIPT (and underlined superscripts for extensible arrows)
    var rawRuns = [];
    var i = 0;
    var cur = '';

    while (i < s.length) {
      if (s[i] === '_' || s[i] === '^' || s[i] === '\uE004') {
        var marker = s[i];
        var isSub = (marker === '_');
        var isUnderlinedSup = (marker === '\uE004');
        if (cur) {
          rawRuns.push({ text: cur, format: 'NORMAL' });
          cur = '';
        }
        i++;
        var scriptContent = '';
        if (i < s.length && s[i] === '{') {
          var closePos = findMatchingBrace(s, i);
          if (closePos !== -1) {
            scriptContent = s.substring(i + 1, closePos);
            i = closePos + 1;
          } else {
            scriptContent = s[i];
            i++;
          }
        } else if (i < s.length) {
          scriptContent = s[i];
          i++;
        }

        // Clean any residual braces and resolve nested scripts
        scriptContent = scriptContent.replace(/_\{([^{}]+)\}/g, function(_, c) { return toSubscript(c); });
        scriptContent = scriptContent.replace(/_([a-zA-Z0-9]+)/g, function(_, c) { return toSubscript(c); });
        scriptContent = scriptContent.replace(/\^\{([^{}]+)\}/g, function(_, c) { return toSuperscript(c); });
        scriptContent = scriptContent.replace(/\^([a-zA-Z0-9]+)/g, function(_, c) { return toSuperscript(c); });
        scriptContent = scriptContent.replace(/\{([^{}]+)\}/g, '$1');
        var runObj = { text: scriptContent, format: isSub ? 'SUBSCRIPT' : 'SUPERSCRIPT' };
        if (isUnderlinedSup) {
          runObj.underline = true;
        }
        rawRuns.push(runObj);
      } else {
        cur += s[i];
        i++;
      }
    }
    if (cur) rawRuns.push({ text: cur, format: 'NORMAL' });

    // 10. Restore placeholders and merge adjacent runs with identical formatting
    var mergedRuns = [];
    for (var r = 0; r < rawRuns.length; r++) {
      var run = rawRuns[r];
      var restoredText = run.text.replace(/\uE000/g, '_')
                                 .replace(/\uE001/g, '%')
                                 .replace(/\uE002/g, '&')
                                 .replace(/\uE003/g, '#');
      if (!restoredText) continue;

      if (
        mergedRuns.length > 0 &&
        mergedRuns[mergedRuns.length - 1].format === run.format &&
        Boolean(mergedRuns[mergedRuns.length - 1].underline) === Boolean(run.underline)
      ) {
        mergedRuns[mergedRuns.length - 1].text += restoredText;
      } else {
        var newRun = { text: restoredText, format: run.format };
        if (run.underline) {
          newRun.underline = true;
        }
        mergedRuns.push(newRun);
      }
    }

    return mergedRuns;
  }

  /**
   * Helper that converts LaTeX directly to a single formatted string with Unicode sub/superscripts.
   */
  function toUnicode(latex) {
    var runs = parseLatexToFormattedRuns(latex);
    var out = '';
    for (var i = 0; i < runs.length; i++) {
      var r = runs[i];
      if (r.format === 'SUBSCRIPT') {
        out += toSubscript(r.text);
      } else if (r.format === 'SUPERSCRIPT') {
        var supStr = toSuperscript(r.text);
        if (r.underline) {
          supStr = supStr.split('').map(function(ch) { return ch + '\u0332'; }).join('');
        }
        out += supStr;
      } else {
        out += r.text;
      }
    }
    return out;
  }

  return {
    toUnicode: toUnicode,
    parseLatexToFormattedRuns: parseLatexToFormattedRuns,
    toSuperscript: toSuperscript,
    toSubscript: toSubscript,
    GREEK_LOWER: GREEK_LOWER,
    GREEK_UPPER: GREEK_UPPER,
    BLACKBOARD_BOLD: BLACKBOARD_BOLD,
    MATHCAL: MATHCAL,
    SYMBOLS: SYMBOLS,
    MATH_FUNCTIONS: MATH_FUNCTIONS
  };
})();

// Export for Node testing environment if present
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UnicodeMap;
}
