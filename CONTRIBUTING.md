# Contributing to Google Docs LaTeX Math

Thank you for your interest in improving this project! Contributions are welcome.

## How to Contribute

### Reporting Bugs or Requesting Symbols
- Open an [Issue](https://github.com/) describing the equation that failed to format or the symbol you'd like added.
- Please include the raw LaTeX snippet (e.g. `$\Delta_{\text{TN}} \approx 0$`) and what Google Docs output you expected.

### Development Workflow

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/docs-latex.git
   cd docs-latex
   ```

2. **Run tests**:
   Tests run locally with Node.js without needing any external dependencies:
   ```bash
   npm test
   ```

3. **Adding New Mathematical Symbols**:
   - Symbols, Greek letters, and operator mappings live in `UnicodeMap.js`.
   - Add new mappings to `UnicodeMap.SYMBOLS`, `UnicodeMap.GREEK_LOWER`, etc.
   - Add a test case in `tests/verify.js` to verify your addition.

4. **Testing in Google Docs with clasp**:
   - If using `@google/clasp`:
     ```bash
     npm install -g @google/clasp
     clasp login
     clasp push
     ```

### Pull Request Guidelines
- Ensure `npm test` passes before submitting a pull request.
- Keep changes focused and well-scoped.
- For major architectural changes, please open an issue first to discuss what you would like to change.
