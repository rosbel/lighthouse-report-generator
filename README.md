# Lighthouse Report Generator

The Lighthouse Report Generator enables you to aggregate key metrics from Lighthouse performance reports and consolidate them into a CSV file. It's designed to work seamlessly with Lighthouse and `@lhci/cli` to streamline the process of comparing performance data across multiple environments.

## Table of Contents

- [Usage](#usage)
  - [Collecting Metrics](#collecting-metrics)
  - [Generating the CSV Report](#generating-the-csv-report)
- [Features](#features)
- [Contribution](#contribution)
- [License](#license)
- [Development](#development)
  - [Installation](#installation)

## Usage

### Collecting Metrics

To begin, you'll need Lighthouse reports in JSON format, which can be generated using the Lighthouse CLI.

Start by collecting baseline metrics. By default, this command will run three Lighthouse audits:

```bash
npx -p @lhci/cli lhci collect --url <url>
```

Next, save your baseline results to a folder, naming it `baseline` or another descriptive name:

```bash
npx -p @lhci/cli lhci upload --target filesystem --outputDir=./<folderName>
```

To compare multiple environments or pages, simply repeat the process for each URL you want to evaluate:

```bash
npx -p @lhci/cli lhci collect --url <new_url>
npx -p @lhci/cli lhci upload --target filesystem --outputDir=./<folderNameForComparison>
```

You can repeat this process as many times as needed, creating separate folders for each environment or page comparison.

### Generating the CSV Report

Once you've gathered the metrics, use the following command to generate a CSV report consolidating the data:

```bash
npx lighthouse-report-generator -f <folderPath>
```

If no `folderPath` is provided, it will default to the current directory:

```bash
npx lighthouse-report-generator
```

As long as the directory contains a valid `manifest.json` and associated Lighthouse report files, a `results.csv` file will be generated, summarizing the key metrics.

## Features

- Processes individual or multiple Lighthouse reports from a specified folder.
- Produces a consolidated CSV file with aggregated metrics.
- Ensures data validity before generating the CSV.

## Contribution

We welcome contributions! If you'd like to contribute, feel free to fork the repository and submit a pull request, or open an issue if you have suggestions or discover bugs.

## License

This project is open-source and is licensed under the [MIT License](LICENSE).

## Development

For those interested in contributing or making modifications, follow these steps to set up your local environment:

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rosbel/lighthouse-report-generator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd lighthouse-report-generator
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

Once setup is complete, you're ready to start contributing or modifying the tool.

---

This version strikes a balance between professionalism and approachability. Let me know if this works for you!