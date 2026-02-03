# CLAUDE.md - AI Assistant Guidelines

This document provides context and guidelines for AI assistants working with the lighthouse-report-generator codebase.

## Project Overview

**lighthouse-report-generator** is a lightweight CLI tool that aggregates Lighthouse performance metrics into a consolidated CSV file. It processes Lighthouse JSON reports (generated via Lighthouse CLI or `@lhci/cli`) and extracts key performance audit data for cross-environment comparison.

- **Repository**: rosbel/lighthouse-report-generator
- **Version**: 0.0.3
- **License**: MIT
- **Author**: rosbel

## Directory Structure

```
lighthouse-report-generator/
├── index.js          # Main source file (CLI entry point)
├── package.json      # Project metadata and dependencies
├── yarn.lock         # Dependency lock file
├── .prettierrc       # Prettier configuration (uses defaults)
├── .gitignore        # Git ignore rules
└── README.md         # User documentation
```

This is a minimal, single-file project. All source code is contained in `index.js`.

## Tech Stack

- **Runtime**: Node.js with ES Modules (`"type": "module"`)
- **Package Manager**: Yarn (lock file present) or npm
- **CLI Framework**: Commander.js (^11.0.0)
- **CSV Generation**: csv-writer (^1.6.0)
- **Code Formatting**: Prettier (3.0.3)

## Development Commands

```bash
# Install dependencies
npm install
# or
yarn install

# Run the tool locally
npm start
# or
npm start -- -f <folderPath>

# Run directly via node
node index.js -f <folderPath>
```

## CLI Usage

```bash
# Process reports in current directory
lighthouse-report-generator

# Process reports from a specific folder
lighthouse-report-generator -f ./path/to/reports
```

**Output**: Generates `results.csv` in the current working directory.

## Code Architecture

### Entry Point (`index.js`)

The tool follows a simple data processing pipeline:

```
CLI Args → processRoot() → Iterate folders → processFolder() →
Read manifest.json → processReport() → Extract metrics → Generate CSV
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `readJSON(filePath)` | Reads and parses JSON files with error handling |
| `processReport(report)` | Extracts performance metrics from a Lighthouse report |
| `processFolder(folderPath)` | Processes a folder containing manifest.json |
| `processRoot(rootPath)` | Main orchestrator that processes all subdirectories |

### Constants

```javascript
// Performance metrics extracted from Lighthouse reports
const INTERESTING_AUDITS = {
  FCP: { path: "first-contentful-paint" },
  LCP: { path: "largest-contentful-paint" },
  FMP: { path: "first-meaningful-paint" },
  TBT: { path: "total-blocking-time" },
  TTI: { path: "interactive" },
  SI: { path: "speed-index" },
};

// Base CSV headers
const HEADER_BASE = [
  { id: "foldername", title: "foldername" },
  { id: "run", title: "run" },
  { id: "performance", title: "performance" },
];
```

## Code Conventions

### Module System
- Uses ES Modules (import/export) - **not CommonJS**
- Shebang `#!/usr/bin/env node` for CLI execution
- ES Module `__dirname` workaround pattern:
  ```javascript
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  ```

### Naming Conventions
- **Functions**: camelCase (`readJSON`, `processReport`)
- **Constants**: UPPER_SNAKE_CASE (`INTERESTING_AUDITS`, `HEADER_BASE`)
- **Variables**: camelCase (`folderPath`, `reportData`)

### Error Handling
- Try-catch blocks for file operations
- Graceful error logging via `console.error()`
- Functions return `null` on failure for safe chaining
- Validation checks before processing (e.g., manifest existence)

### Async Patterns
- All file I/O uses `fs.promises` with async/await
- Top-level await is used in the module root

### Code Formatting
- Prettier with default settings
- Semicolons are used
- Run `npx prettier --write .` to format

## Input/Output Format

### Expected Input Structure
```
<rootFolder>/
├── environment1/
│   ├── manifest.json           # Lighthouse CI manifest
│   ├── lhr-<hash>.json         # Lighthouse report files
│   └── ...
├── environment2/
│   ├── manifest.json
│   └── lhr-<hash>.json
└── ...
```

### manifest.json Format
Array of objects containing:
- `summary.performance` - Overall performance score
- `jsonPath` - Path to the full Lighthouse report

### Output CSV Columns
- `foldername` - Source folder name
- `run` - Run number within folder
- `performance` - Overall performance score
- `FCP`, `LCP`, `FMP`, `TBT`, `TTI`, `SI` - Performance metrics (numeric values in ms)

## Guidelines for AI Assistants

### When Making Changes

1. **Maintain ES Module syntax** - Do not convert to CommonJS
2. **Keep the single-file structure** - Avoid creating additional source files unless necessary
3. **Follow existing error handling patterns** - Return null on failure, log errors
4. **Preserve async/await consistency** - All file operations should be async
5. **Run Prettier before committing** - `npx prettier --write .`

### Adding New Metrics

To add a new Lighthouse audit metric:
1. Add entry to `INTERESTING_AUDITS` constant
2. The metric will be automatically included in CSV output

### Testing Changes Locally

1. Generate Lighthouse reports using `@lhci/cli`:
   ```bash
   npx -p @lhci/cli lhci collect --url <url>
   npx -p @lhci/cli lhci upload --target filesystem --outputDir=./test-reports
   ```
2. Run the tool against test reports:
   ```bash
   node index.js -f ./test-reports
   ```
3. Verify `results.csv` output

### Common Pitfalls

- This project uses **ES Modules** - `require()` will not work
- Output file `results.csv` is written to **current working directory**, not the input folder
- The tool expects Lighthouse CI manifest structure, not raw Lighthouse JSON output

## No Automated Tests

This project currently has no test suite. When making changes:
- Manually verify functionality with real Lighthouse reports
- Test error handling scenarios (missing files, malformed JSON)
- Ensure CSV output is valid and contains expected columns
