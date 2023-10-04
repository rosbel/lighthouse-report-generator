# Lighthouse Report Generator

Generate aggregated CSV reports from your Lighthouse audit files.

This tool is designed to process a directory of Lighthouse performance reports, extracting specific metrics, and then saving those metrics into a consolidated CSV file.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contribution](#contribution)
- [License](#license)

## Installation

1. First, clone the `lighthouse-report-generator` repository:

   ```bash
   git clone https://github.com/rosbel/lighthouse-report-generator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd lighthouse-report-generator
   ```

3. Install the necessary dependencies:

   ```bash
   npm install
   ```

## Usage

To use the tool:

```bash
npx lighthouse-report-generator -f <folderPath>
```

If you don't specify a `folderPath`, it will default to the current directory:

```bash
npx lighthouse-report-generator
```

After execution, if there is a valid `manifest.json` and Lighthouse report files are found in the specified directory or its subdirectories, a `results.csv` file will be generated in the current directory containing the aggregated metrics.

## Features

- Processes individual Lighthouse reports or a folder containing multiple reports.
- Generates a comprehensive CSV with aggregated metrics.
- Ensures valid data presence before generating the CSV.

## Contribution

Contributions are welcome! Please fork this repository and open a pull request with your changes, or open an issue if you have suggestions or find a bug.

## License

This project is open-source and available under the [MIT License](LICENSE).