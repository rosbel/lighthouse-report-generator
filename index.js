#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

const packageJson = await readJSON(path.join(__dirname, "package.json"));

const INTERESTING_AUDITS = {
  FCP: { path: "first-contentful-paint" },
  LCP: { path: "largest-contentful-paint" },
  FMP: { path: "first-meaningful-paint" },
  TBT: { path: "total-blocking-time" },
  TTI: { path: "interactive" },
  SI: { path: "speed-index" },
};

const HEADER_BASE = [
  { id: "foldername", title: "foldername" },
  { id: "run", title: "run" },
  { id: "performance", title: "performance" },
];

async function readJSON(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

async function processReport(report) {
  let extractedData = {};
  for (const audit in INTERESTING_AUDITS) {
    extractedData[audit] =
      report.audits[INTERESTING_AUDITS[audit].path]?.numericValue;
  }
  return extractedData;
}

async function processFolder(folderPath) {
  const files = await fs.readdir(folderPath);
  let folderData = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    if (file === "manifest.json") {
      const manifests = await readJSON(filePath);
      if (!manifests) continue;

      for (const manifest of manifests) {
        if (manifest.summary && manifest.jsonPath) {
          const reportFilePath = path.join(
            folderPath,
            path.basename(manifest.jsonPath),
          );
          const report = await readJSON(reportFilePath);
          if (!report) continue;

          const reportData = await processReport(report);
          folderData.push({
            foldername: path.basename(folderPath),
            run: folderData.length + 1,
            performance: manifest.summary.performance,
            ...reportData,
          });
        }
      }
    }
  }

  return folderData;
}

async function processRoot(rootPath) {
  const folders = await fs.readdir(rootPath);
  let results = [];
  let header = [...HEADER_BASE];

  for (const folder of folders) {
    const folderPath = path.join(rootPath, folder);
    const isDirectory = (await fs.lstat(folderPath)).isDirectory();

    if (isDirectory) {
      const folderResults = await processFolder(folderPath);
      results = results.concat(folderResults);

      if (folderResults.length && header.length === HEADER_BASE.length) {
        const auditHeaders = Object.keys(folderResults[0])
          .filter((audit) => audit in INTERESTING_AUDITS)
          .map((audit) => ({ id: audit, title: audit }));
        header = [...header, ...auditHeaders];
      }
    }
  }

  if (results.length === 0) {
    console.log('No lighthouse manifest.json or report.json files found. No results.');
    return;
  }

  const csvWriter = createCsvWriter({ path: './results.csv', header });
  try {
    await csvWriter.writeRecords(results);
    console.log('Finished processing folders, results written to results.csv');
  } catch (error) {
    console.error('Error writing to CSV:', error);
  }
}

// Commander Configuration
program
  .version(packageJson.version)
  .description(packageJson.description)
  .option("-f, --folder <folderPath>", "Specify folder path", process.cwd())
  .action((cmdObj) => {
    processRoot(cmdObj.folder);
  });

program.parse(process.argv);
