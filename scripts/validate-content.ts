import figuresData from '../src/data/figures.json';
import guidesData from '../src/data/guides.json';
import parksData from '../src/data/parks.json';
import { validateContent } from './validateContent';

const errors = validateContent(parksData, guidesData, figuresData);

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(
  `Content validation passed: ${parksData.length} parks, ` +
    `${guidesData.length} guides, ${figuresData.length} historic figures.`,
);
