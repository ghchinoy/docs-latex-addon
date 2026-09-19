# Google Docs Native LaTeX Math & Symbols Extension

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](tests/verify.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Google%20Workspace-4285F4.svg)](https://workspace.google.com/)
[![Runtime](https://img.shields.io/badge/Runtime-Apps%20Script%20V8-blue.svg)](https://developers.google.com/apps-script)

A lightweight Google Docs extension that converts raw LaTeX formulas copied from Markdown, research papers, or AI chatbots (Gemini, ChatGPT, Claude) into **in-built Google Docs special characters and native subscript/superscript formatting** without external rendering servers or PNG images.

---

## Table of Contents

- [Why This Project?](#why-this-project)
- [Quick Installation](#quick-installation)
  - [Method 1: 1-Click Template Copy (Fastest - Zero Setup)](#method-1-1-click-template-copy-fastest---zero-setup)
  - [Method 2: 60-Second Manual Setup in Any Existing Doc](#method-2-60-second-manual-setup-in-any-existing-doc)
  - [Method 3: Developer Setup via Clasp CLI](#method-3-developer-setup-via-clasp-cli)
- [Immediate Usage Examples](#immediate-usage-examples)
- [Key Features](#key-features)
- [Supported Syntax & Symbols](#supported-syntax--symbols)
- [Local Development & Testing](#local-development--testing)
- [Deployment & Distribution](#deployment--distribution)
  - [Option 1: Sharing via "Make a Copy" Template Link](#option-1-sharing-via-make-a-copy-template-link)
  - [Option 2: Deploying to Google Workspace Marketplace](#option-2-deploying-to-google-workspace-marketplace)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## Why This Project?

Markdown and AI chats frequently drop equations like `$\Delta_{\text{TN}} \approx 0$` or `$$\text{CTG}(S, U) = \prod_{u \in U} \mathcal{G}(u, S) \in {0, 1}$$`. When copied into Google Docs, they remain unrendered plaintext.

Existing tools often rely on external image servers (like CodeCogs) that convert formulas into blurry low-res PNGs, introduce network lag, and break when encountering unescaped underscores in variable names. 

This extension operates **100% locally and natively inside Google Docs**:
- Replaces LaTeX commands with **Google Docs' in-built special characters** (`Δ`, `≈`, `∑`, `∏`, `𝒢`, `𝕀`).
- Applies **Google Docs' native `TextAlignment.SUBSCRIPT` and `SUPERSCRIPT`** formatting directly to character ranges.
- Requires **zero external APIs** and generates **zero PNG images**.

---

## Quick Installation

### Method 1: 1-Click Template Copy (Fastest - Zero Setup)

The fastest way to get started without copying or pasting any code:

👉 [**Click here to Make a Copy of the Google Doc Template**](https://docs.google.com/document/d/1vxOw_FoGvNK6dfIUpfEeqINcieskAaXlm9-2W27-_hw/copy)

Clicking this link creates a new copy of the template document directly in your Google Drive with the extension **pre-installed and ready to use**. The document includes a built-in interactive playground with sample equations ready to test and wipe clean. (You can also inspect the [live reference document](https://docs.google.com/document/d/1vxOw_FoGvNK6dfIUpfEeqINcieskAaXlm9-2W27-_hw/edit?tab=t.0)).

---

### Method 2: 60-Second Manual Setup in Any Existing Doc

To add the extension to an existing Google Document:

1. Open your document in [Google Docs](https://docs.google.com).
2. In the top menu bar, click **Extensions** → **Apps Script**.
3. In the Apps Script editor:
   - **`Code.gs`**: Replace the starter code with the contents of [`Code.js`](./Code.js).
   - **`UnicodeMap.gs`**: Click **+** (Add a file) → select **Script** → name it `UnicodeMap` → paste [`UnicodeMap.js`](./UnicodeMap.js).
   - **`Sidebar.html`**: Click **+** → select **HTML** → name it `Sidebar` → paste [`Sidebar.html`](./Sidebar.html).
   - **`appsscript.json`** *(Optional)*: Click **Project Settings** (gear icon) → check *"Show 'appsscript.json' manifest file in editor"* → paste [`appsscript.json`](./appsscript.json).
4. Click **Save** (`Cmd+S` / `Ctrl+S`).
5. Return to your Google Doc and refresh the tab (`Cmd+R` / `F5`). The **LaTeX Math** menu will appear in your toolbar.

*(On first run, Google will prompt you for a standard one-time script authorization: click Advanced → "Go to Untitled project (unsafe)" → Allow).*

---

### Method 3: Developer Setup via Clasp CLI

If you prefer deploying from your terminal using Google's official [`@google/clasp`](https://github.com/google/clasp) CLI:

```bash
# 1. Install clasp globally
npm install -g @google/clasp

# 2. Log in to your Google account
clasp login

# 3. Clone this repository
git clone https://github.com/ghchinoy/docs-latex.git
cd docs-latex

# 4. Create a new Google Doc bound project (or link an existing one)
clasp create --type docs --title "LaTeX Math Extension"

# 5. Push the code to Google Docs
npm run push
```

---

## Immediate Usage Examples

### 1. In-Line Math & Subscripts
Highlight the following text in Google Docs:
```latex
$\Delta_{\text{TN}} \approx 0$
```
Click **LaTeX Math** → **Render Selected into Docs Symbols**.
```text
Output: ΔTN ≈ 0   (TN formatted with native Docs Subscript)
```

### 2. Multi-Equation Phrases (Over-Selection Safe)
Highlight phrases containing multiple formulas and connecting text:
```latex
Comparing $\text{C2}$ vs. $\text{C3}$ in the evaluation
```
Click **LaTeX Math** → **Render Selected into Docs Symbols**.
```text
Output: Comparing C2 vs. C3 in the evaluation   (Zero stray dollar signs)
```

### 3. Products, Script Glyphs & Set Notation
Highlight set relations or products:
```latex
$$\text{CTG}(S, U) = \prod_{u \in U} \mathcal{G}(u, S) \in {0, 1}$$
```
Click **LaTeX Math** → **Render Selected into Docs Symbols**.
```text
Output: CTG(S, U) = ∏u ∈ U 𝒢(u, S) ∈ {0, 1}   (With subscript u ∈ U and stylized 𝒢)
```

### 4. Interactive Sidebar with 2D Fraction Preview
1. Click **LaTeX Math** → **Open LaTeX Sidebar**.
2. Type or paste complex formulas (such as fractions with summation limits):
   ```latex
   \text{SNA} = \frac{\sum_{j=1}^{M_{\text{sentences}}} \prod_{k \in \text{units}(j)} \mathbb{I}(\text{unit}_k)}{M_{\text{sentences}}}
   ```
3. View the instant real-time 2D preview.
4. Click **📐 Insert as 2D Equation (from Preview)** for vertical stacked fraction bars, or **🔤 Insert as Native Symbols (Text)** for native document text.

---

## Key Features

- **In-Doc Native Special Characters**: Uses Google Docs' built-in character sets (Greek, relations, operators, arrows, and double-struck blackboard bold).
- **Native Subscript & Superscript Formatting**: Applies true `DocumentApp.TextAlignment.SUBSCRIPT` and `SUPERSCRIPT` character alignments (identical to `Format > Text > Subscript`).
- **Over-Selection Guard**: Automatically identifies distinct equation boundaries within highlighted sentences, safely transforming each formula while leaving surrounding text intact.
- **Font-Weight Normalization**: Automatically strips inherited Markdown bolding (e.g. `**$$...$$**` or bolded bullet item prefixes) so math symbols render at uniform regular weight.
- **Auto-Healing Syntax**: Protects unescaped underscores and special characters inside `\text{...}` blocks (e.g. `\text{enable_textnorm}` or `\text{regex_match}`).
- **Container-Safe**: Polymorphically operates inside regular paragraphs, bulleted/numbered lists (`ListItem`), and table cells without container-casting exceptions.

---

## Supported Syntax & Symbols

| LaTeX Command | Google Docs Output | Description |
| :--- | :--- | :--- |
| `\Delta`, `\alpha`, `\beta`, `\Omega`, `\pi` | **Δ**, **α**, **β**, **Ω**, **π** | Greek lowercase & uppercase |
| `\approx`, `\le`, `\ge`, `\ne`, `\equiv` | **≈**, **≤**, **≥**, **≠**, **≡** | Math relations |
| `\in`, `\notin`, `\subset`, `\subseteq` | **∈**, **∉**, **⊂**, **⊆** | Set theory relations |
| `\sum`, `\prod`, `\coprod`, `\int`, `\oint` | **∑**, **∏**, **∐**, **∫**, **∮** | $N$-ary operators |
| `\dots`, `\ldots`, `\cdots`, `\vdots`, `\ddots` | **…**, **…**, **⋯**, **⋮**, **⋱** | Horizontal, vertical & diagonal ellipses |
| `\pm`, `\mp`, `\times`, `\cdot`, `\div` | **±**, **∓**, **×**, **·**, **÷** | Arithmetic operators |
| `\to`, `\leftarrow`, `\Rightarrow`, `\Leftrightarrow` | **→**, **←**, **⇒**, **⇔** | Directional & logical arrows |
| `\mathbb{I}`, `\mathbb{R}`, `\mathbb{C}`, `\mathbb{N}` | **𝕀**, **ℝ**, **ℂ**, **ℕ** | Double-struck blackboard bold |
| `\mathcal{G}`, `\mathcal{L}`, `\mathcal{S}` | **𝒢**, **ℒ**, **𝒮** | Mathematical script calligraphic |
| `_{subscript}`, `^{superscript}` | <sub>**subscript**</sub>, <sup>**superscript**</sup> | Native Docs character text alignment |
| `{0, 1}`, `\{c_{i,1}, \dots\}` | **{0, 1}**, **{c<sub>i,1</sub>, …}** | Preserved literal set brackets |
| `\text{word_with_underscore}` | **word_with_underscore** | Protected text block unwrapping |

---

## Local Development & Testing

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (used exclusively for running the offline verification suite).

### Setup & Test Execution
```bash
# Clone the repo
git clone https://github.com/ghchinoy/docs-latex.git
cd docs-latex

# Run the automated verification test suite
npm test
```

The test suite in [`tests/verify.js`](./tests/verify.js) automatically validates:
- Native symbol mappings and character code conversions.
- Subscript/superscript run tokenization and character offset calculations.
- Auto-healing of underscores inside `\text{...}` blocks.
- Over-selection isolation (`$\text{C2}$ vs. $\text{C3}$`).
- Preservation of set braces and ellipsis mappings.
- Bold font weight normalization.

---

## Deployment & Distribution

### Option 1: Sharing via "Make a Copy" Template Link (Zero-Friction Sharing)

You can share this extension with colleagues or the public without requiring them to touch any code:

1. Create a blank Google Document and install the project files in its Apps Script editor (or use the existing [live template](https://docs.google.com/document/d/1vxOw_FoGvNK6dfIUpfEeqINcieskAaXlm9-2W27-_hw/edit?tab=t.0)).
2. In Google Docs, click **Share** → set to **"Anyone with the link can view"**.
3. Replace the URL ending `/edit...` with `/copy`:
   ```
   https://docs.google.com/document/d/1vxOw_FoGvNK6dfIUpfEeqINcieskAaXlm9-2W27-_hw/copy
   ```
4. Share that link. When recipients click it, Google Docs creates a new copy in their Google Drive with the extension **already pre-installed and ready to use**.

---

### Option 2: Deploying to Google Workspace Marketplace

To publish this extension as a globally installable Google Workspace Add-on:

1. **Google Cloud Project**:
   - In Google Apps Script, click **Project Settings** → **Change Project** and link to a standard GCP Project.
2. **Enable APIs**:
   - In Google Cloud Console, enable the **Google Workspace Marketplace SDK** and **Google Docs API**.
3. **Configure OAuth Consent Screen**:
   - Because this add-on only requires `documents.currentonly` and `script.container.ui`, it operates under **Non-Sensitive scopes** (no third-party CASA security assessment required).
4. **Publish**:
   - Create a store listing in the Google Workspace Marketplace SDK with screenshots and icon assets.
   - Pay the one-time $5 Google Developer registration fee and submit for verification.

---

## Troubleshooting & FAQ

### Q: Why does Google Docs show an "Authorization Required" warning on first run?
**A:** This is Google's standard security prompt for any custom Apps Script. Because this project is container-bound and uses `documents.currentonly`, it only requests permission to modify the specific open document. Click **Advanced** → **Go to Untitled project (unsafe)** → **Allow**.

### Q: Why do some math symbols (like `∏` or `𝒢`) look slightly heavier than surrounding text?
**A:** Standard document fonts like Arial do not contain specialized math glyphs like $N$-ary product (`U+220F`) or script capital G (`U+1D4A2`). Google Docs automatically pulls these characters from a fallback math font (such as *Cambria Math* or *STIX*), which naturally features thicker mathematical display strokes.

### Q: Can I run this offline?
**A:** Yes. The native symbol transformation logic runs 100% inside your Google Document without sending data to external web servers.

---

## Contributing

Contributions, symbol additions, and bug reports are welcome! Please review [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines on submitting pull requests and adding new mathematical symbols.

---

## License

This project is open-source and licensed under the [MIT License](./LICENSE).

---

## Disclaimer

This is an independent open-source project and is not an official Google product or project. Google, Google Docs, and Google Workspace are trademarks of Google LLC.
