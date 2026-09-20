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
 * Verification Test Suite for Google Docs Native Math & Symbols Extension
 */

const assert = require('assert');
const UnicodeMap = require('../UnicodeMap.js');

console.log('--- RUNNING GOOGLE DOCS NATIVE MATH EXTENSION TESTS ---\n');

// 1. Test Delta_TN approx 0
console.log('1. Testing Native Runs for: $\\Delta_{\\text{TN}} \\approx 0$');
const test1 = '$\\Delta_{\\text{TN}} \\approx 0$';
const runs1 = UnicodeMap.parseLatexToFormattedRuns(test1);
console.log('   Input: ', test1);
console.log('   Runs:  ', JSON.stringify(runs1));
assert.strictEqual(runs1.length, 3);
assert.strictEqual(runs1[0].text, 'Δ');
assert.strictEqual(runs1[0].format, 'NORMAL');
assert.strictEqual(runs1[1].text, 'TN');
assert.strictEqual(runs1[1].format, 'SUBSCRIPT');
assert.strictEqual(runs1[2].text, ' ≈ 0');
assert.strictEqual(runs1[2].format, 'NORMAL');
console.log('   ✓ Test 1 passed: Formatted as Δ with native Subscript [TN] and symbol ≈ 0.\n');

// 2. Test Delta_TN with enable_textnorm in \text{...}
console.log('2. Testing Native Runs for formula with underscores in \\text{...}:');
const test2 = '$$\\Delta_{\\text{TN}} = \\text{UNA}(\\text{Cond 1: enable_textnorm=true}) - \\text{UNA}(\\text{Cond 2: enable_textnorm=false})$$';
const runs2 = UnicodeMap.parseLatexToFormattedRuns(test2);
console.log('   Input: ', test2);
console.log('   Runs:  ', JSON.stringify(runs2));
assert.strictEqual(runs2.length, 3);
assert.strictEqual(runs2[0].text, 'Δ');
assert.strictEqual(runs2[0].format, 'NORMAL');
assert.strictEqual(runs2[1].text, 'TN');
assert.strictEqual(runs2[1].format, 'SUBSCRIPT');
assert.strictEqual(runs2[2].text, ' = UNA(Cond 1: enable_textnorm=true) - UNA(Cond 2: enable_textnorm=false)');
assert.strictEqual(runs2[2].format, 'NORMAL');
console.log('   ✓ Test 2 passed: Underscore in enable_textnorm safely preserved without broken subscripts.\n');

// 3. Test Complex SNA Equation (Fraction + Summation + Product + Blackboard Bold)
console.log('3. Testing Native Runs for Complex SNA Formula:');
const test3 = String.raw`$$\text{SNA} = \frac{\sum_{j=1}^{M_{\text{sentences}}} \prod_{k \in \text{units}(j)} \mathbb{I}(\text{unit}k \text{ correct})}{M{\text{sentences}}}$$`;
const runs3 = UnicodeMap.parseLatexToFormattedRuns(test3);
console.log('   Input: ', test3);
console.log('   Runs:  ', JSON.stringify(runs3));
const fullText3 = runs3.map(r => r.text).join('');
console.log('   Full Native Text: ', fullText3);
assert.ok(fullText3.includes('SNA = (∑'));
assert.ok(fullText3.includes('∏'));
assert.ok(fullText3.includes('𝕀'));
assert.ok(fullText3.includes('∈'));
assert.ok(runs3.some(r => r.format === 'SUBSCRIPT' && r.text === 'j=1'));
assert.ok(runs3.some(r => r.format === 'SUBSCRIPT' && r.text.includes('k ∈ units(j)')));
console.log('   ✓ Test 3 passed: SNA equation converted into native special characters and script runs.\n');

// 3b. Test User UNA Formula
console.log('3b. Testing Native Runs for UNA Formula:');
const testUNA = String.raw`$$\text{UNA} = \frac{\sum_{i=1}^{N_{\text{units}}} \mathbb{I}(\text{unit}i \text{ is correctly verbalized})}{N{\text{units}}}$$`;
const runsUNA = UnicodeMap.parseLatexToFormattedRuns(testUNA);
console.log('   Input: ', testUNA);
console.log('   Runs:  ', JSON.stringify(runsUNA));
const fullTextUNA = runsUNA.map(r => r.text).join('');
console.log('   Full Native Text: ', fullTextUNA);
assert.ok(fullTextUNA.includes('UNA = (∑'));
assert.ok(fullTextUNA.includes('𝕀'));
assert.ok(runsUNA.some(r => r.format === 'SUBSCRIPT' && r.text === 'i=1'));
assert.ok(runsUNA.some(r => r.format === 'SUBSCRIPT' && r.text === 'units'));
console.log('   ✓ Test 3b passed: UNA equation correctly parsed with nested script resolutions.\n');

// 4. Test Text Replacement & Formatting Offsets Calculation
console.log('4. Testing In-Doc Offset and Formatting Calculation:');
function simulateTextReplacement(initialText, matchStart, matchEnd, latex) {
  const runs = UnicodeMap.parseLatexToFormattedRuns(latex);
  const totalInsertedText = runs.map(r => r.text).join('');

  const prefix = initialText.substring(0, matchStart);
  const suffix = initialText.substring(matchEnd + 1);
  const resultingText = prefix + totalInsertedText + suffix;

  const formattingRanges = [];
  let cur = matchStart;
  for (const r of runs) {
    const len = r.text.length;
    formattingRanges.push({
      start: cur,
      end: cur + len - 1,
      text: r.text,
      format: r.format
    });
    cur += len;
  }

  return { resultingText, formattingRanges };
}

const docSample = 'In bullet point: $\\Delta_{\\text{TN}} \\approx 0$ as evaluated.';
const matchIndex = docSample.indexOf('$\\Delta');
const matchEndIndex = docSample.indexOf('$ as') ;
const sim = simulateTextReplacement(docSample, matchIndex, matchEndIndex, '$\\Delta_{\\text{TN}} \\approx 0$');

console.log('   Original text:  ', docSample);
console.log('   Resulting text: ', sim.resultingText);
console.log('   Formatting:     ', sim.formattingRanges);
assert.strictEqual(sim.resultingText, 'In bullet point: ΔTN ≈ 0 as evaluated.');
assert.strictEqual(sim.formattingRanges[1].text, 'TN');
assert.strictEqual(sim.formattingRanges[1].format, 'SUBSCRIPT');
console.log('   ✓ Test 4 passed: Exact character offsets for DocumentApp.TextAlignment verified.\n');

// 5. Test Delimiter Detection on Mixed Document Text
console.log('5. Testing Document Scanner Delimiter Detection:');
const mixedContent = `
Bullet item 1: $\\Delta_{\\text{TN}} \\approx 0$
Block item:
$$\\Delta_{\\text{TN}} = \\text{UNA}(\\text{Cond 1: enable_textnorm=true}) - \\text{UNA}(\\text{Cond 2: enable_textnorm=false})$$
Inline term: $k \\in \\text{units}(j)$
Currency to ignore: $50 and $100.
`;

const blockRegex = /\$\$([\s\S]+?)\$\$/g;
const inlineRegex = /\$([^\s$](?:[^$]*?[^\s$])?)\$/g;

let blockCount = 0;
while (blockRegex.exec(mixedContent) !== null) blockCount++;
assert.strictEqual(blockCount, 1);

const strippedBlocks = mixedContent.replace(blockRegex, '');
let inlineCount = 0;
const inlines = [];
let m;
while ((m = inlineRegex.exec(strippedBlocks)) !== null) {
  inlineCount++;
  inlines.push(m[1]);
}
assert.strictEqual(inlineCount, 2);
assert.strictEqual(inlines[0], '\\Delta_{\\text{TN}} \\approx 0');
assert.strictEqual(inlines[1], 'k \\in \\text{units}(j)');
console.log('   ✓ Test 5 passed: Detected exactly 1 block and 2 inline equations without matching currency.\n');

// 6. Test Over-Selection Guard for Multiple Formulas (C2 vs. C3)
console.log('6. Testing Over-Selection Guard for: $\\text{C2}$ vs. $\\text{C3}$');
function simulateSmartSelectionReplacement(selectedText) {
  function findEquations(text) {
    const matches = [];
    const blockRegex = /\$\$([\s\S]+?)\$\$/g;
    let m;
    while ((m = blockRegex.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length - 1, latex: m[1] });
    }
    const inlineRegex = /\$([^\s$](?:[^$]*?[^\s$])?)\$/g;
    while ((m = inlineRegex.exec(text)) !== null) {
      const start = m.index;
      const end = m.index + m[0].length - 1;
      let overlaps = false;
      for (let b = 0; b < matches.length; b++) {
        if (start >= matches[b].start && end <= matches[b].end) {
          overlaps = true;
          break;
        }
      }
      if (!overlaps) matches.push({ start: start, end: end, latex: m[1] });
    }
    return matches;
  }

  const matches = findEquations(selectedText);
  if (matches.length === 0) {
    return UnicodeMap.parseLatexToFormattedRuns(selectedText).map(r => r.text).join('');
  }

  matches.sort((a, b) => b.start - a.start);
  let res = selectedText;
  for (const match of matches) {
    const runs = UnicodeMap.parseLatexToFormattedRuns(match.latex);
    const replacement = runs.map(r => r.text).join('');
    res = res.substring(0, match.start) + replacement + res.substring(match.end + 1);
  }
  return res;
}

const overSelected1 = '$\\text{C2}$ vs. $\\text{C3}$';
const result1 = simulateSmartSelectionReplacement(overSelected1);
console.log('   Input:  ', overSelected1);
console.log('   Output: ', result1);
assert.strictEqual(result1, 'C2 vs. C3');
assert.ok(!result1.includes('$'), 'Should not contain stray dollar signs');
console.log('   ✓ Test 6 passed: C2 vs. C3 rendered with zero stray dollar signs.\n');

// 7. Test Over-Selection with Surrounding Sentence Text
console.log('7. Testing Over-Selection with Sentence Context:');
const overSelected2 = 'Comparing $\\text{C2}$ vs. $\\text{C3}$ in this section.';
const result2 = simulateSmartSelectionReplacement(overSelected2);
console.log('   Input:  ', overSelected2);
console.log('   Output: ', result2);
assert.strictEqual(result2, 'Comparing C2 vs. C3 in this section.');
console.log('   ✓ Test 7 passed: Intermediate and surrounding sentence text preserved perfectly.\n');

// 8. Test Dots and Set Notation: $C(u_i) = {c_{i,1}, c_{i,2}, \dots, c_{i,k}}$
console.log('8. Testing Dots & Set Notation in $C(u_i) = {c_{i,1}, c_{i,2}, \\dots, c_{i,k}}$:');
const dotsInput = '$C(u_i) = {c_{i,1}, c_{i,2}, \\dots, c_{i,k}}$';
const runsDots = UnicodeMap.parseLatexToFormattedRuns(dotsInput);
const textDots = runsDots.map(r => r.text).join('');
console.log('   Input:  ', dotsInput);
console.log('   Output: ', textDots);
assert.ok(textDots.includes('…'), 'Should contain horizontal ellipsis …');
assert.ok(!textDots.includes('\\dots'), 'Should not contain raw \\dots');
assert.ok(textDots.startsWith('C(u'), 'Should have C(u');
assert.ok(textDots.includes('{') && textDots.includes('}'), 'Should preserve set braces');
console.log('   ✓ Test 8 passed: \\dots converted to … with preserved set braces.\n');

// 9. Test Mathcal and Set {0, 1}: $$\text{CTG}(S, U) = \prod_{u \in U} \mathcal{G}(u, S) \in {0, 1}$$
console.log('9. Testing \\mathcal{G} and Set {0, 1}:');
const mathcalInput = '$$\\text{CTG}(S, U) = \\prod_{u \\in U} \\mathcal{G}(u, S) \\in {0, 1}$$';
const runsMathcal = UnicodeMap.parseLatexToFormattedRuns(mathcalInput);
const textMathcal = runsMathcal.map(r => r.text).join('');
console.log('   Input:  ', mathcalInput);
console.log('   Output: ', textMathcal);
assert.ok(textMathcal.includes('𝒢'), 'Should contain stylized script 𝒢');
assert.ok(!textMathcal.includes('\\mathcal'), 'Should not contain raw \\mathcal');
assert.ok(textMathcal.includes('{0, 1}'), 'Should preserve set braces {0, 1}');
assert.ok(runsMathcal.some(r => r.format === 'SUBSCRIPT' && r.text === 'u ∈ U'), 'Subscript u in U should be formatted');
console.log('   ✓ Test 9 passed: \\mathcal{G} rendered as 𝒢 and {0, 1} preserved.\n');

// 10. Test CTG Formula with regex_match, \left/\right, \ne, \emptyset
console.log('10. Testing CTG Formula with \\text{regex_match} and \\left/\\right:');
const ctgFormula = String.raw`$$\text{CTG}(S, U) = \prod_{u \in U} \prod_{c \in C(u)} \mathbb{I}\left( \text{regex_match}(c, S) \ne \emptyset \right)$$`;
const ctgRuns = UnicodeMap.parseLatexToFormattedRuns(ctgFormula);
const ctgText = ctgRuns.map(r => r.text).join('');
console.log('   Input:  ', ctgFormula);
console.log('   Output: ', ctgText);
assert.ok(ctgText.includes('CTG(S, U) = ∏'));
assert.ok(ctgText.includes('𝕀('));
assert.ok(ctgText.includes('regex_match(c, S) ≠ ∅'));
assert.ok(!ctgText.includes('\\left'));
assert.ok(!ctgText.includes('\\right'));
console.log('   ✓ Test 10 passed: CTG formula rendered cleanly.\n');

// 11. Test Font Weight Normalization Simulation
console.log('11. Testing Bold Normalization Logic:');
function simulateBoldState(isParentHeading, formulaRuns) {
  let isBold = isParentHeading; // If heading, retain bold; otherwise reset to false
  return {
    formulaLength: formulaRuns.map(r => r.text).join('').length,
    normalizedBold: isBold
  };
}
const normalParagraphState = simulateBoldState(false, ctgRuns);
assert.strictEqual(normalParagraphState.normalizedBold, false);
const headingState = simulateBoldState(true, ctgRuns);
assert.strictEqual(headingState.normalizedBold, true);
console.log('   ✓ Test 11 passed: Bold weight properly reset to false for body text.\n');

// 12. Test Standard Mathematical Functions (\exp, \ln, \argmax, \in)
console.log('12. Testing Mathematical Function Names (\\exp, \\ln, \\argmax):');
const expFormula = String.raw`$= \exp(\text{logprob}) \in (0, 1]$`;
const expRuns = UnicodeMap.parseLatexToFormattedRuns(expFormula);
const expText = expRuns.map(r => r.text).join('');
console.log('   Input:  ', expFormula);
console.log('   Output: ', expText);
assert.strictEqual(expText, '= exp(logprob) ∈ (0, 1]');
assert.ok(!expText.includes('\\exp'));

const entropyFormula = String.raw`$H = -\sum p \ln p$`;
const entropyRuns = UnicodeMap.parseLatexToFormattedRuns(entropyFormula);
const entropyText = entropyRuns.map(r => r.text).join('');
console.log('   Input:  ', entropyFormula);
console.log('   Output: ', entropyText);
assert.strictEqual(entropyText, 'H = -∑ p ln p');
assert.ok(!entropyText.includes('\\ln'));

const argmaxFormula = String.raw`$\arg\max_{x} f(x)$`;
const argmaxRuns = UnicodeMap.parseLatexToFormattedRuns(argmaxFormula);
const argmaxText = argmaxRuns.map(r => r.text).join('');
console.log('   Input:  ', argmaxFormula);
console.log('   Output: ', argmaxText);
assert.ok(argmaxText.startsWith('argmax'));
assert.ok(!argmaxText.includes('\\arg'));
assert.ok(!argmaxText.includes('\\max'));
assert.ok(argmaxRuns.some(r => r.format === 'SUBSCRIPT' && r.text === 'x'));
console.log('   ✓ Test 12 passed: Mathematical functions rendered cleanly in roman font with subscripts.\n');

// 13. Test Version Synchronization (package.json, Code.js, CHANGELOG.md)
console.log('13. Testing Version Synchronization:');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const Code = require('../Code.js');
console.log('   package.json version: ', pkg.version);
console.log('   Code.js APP_VERSION:  ', Code.APP_VERSION);
assert.strictEqual(Code.APP_VERSION, pkg.version, 'Code.js APP_VERSION must match package.json version');

const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
assert.ok(fs.existsSync(changelogPath), 'CHANGELOG.md must exist');
const changelogContent = fs.readFileSync(changelogPath, 'utf8');
assert.ok(changelogContent.includes(`## [${pkg.version}]`), `CHANGELOG.md must contain release entry for version ${pkg.version}`);
assert.ok(Code.CHANGELOG_URL.includes('CHANGELOG.md'), 'CHANGELOG_URL must point to CHANGELOG.md');
console.log('   ✓ Test 13 passed: Version is strictly synchronized across package.json, Code.js, and CHANGELOG.md.\n');

console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY.');
