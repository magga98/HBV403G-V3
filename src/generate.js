import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createDirIfNotExists, readFile } from './lib/file.js';
import { departmentTemplate, indexTemplate } from './lib/html.js';
import { parseCsv, parseJson } from './lib/parse.js';

const INPUT_DIR = './data';
const OUTPUT_DIR = './dist';

async function main() {
  await createDirIfNotExists(OUTPUT_DIR);

  const indexFile = await readFile(join(INPUT_DIR, 'index.json'));
  const indexData = parseJson(indexFile);

  const departments = [];

  for await (const item of indexData) {
    const csvFile = await readFile(join(INPUT_DIR, item.csv), {
      encoding: 'latin1',
    });
    const courses = parseCsv(csvFile);

    await writeFile(
      join(OUTPUT_DIR, item.html),
      departmentTemplate(item.title, item.description, courses),
      { flag: 'w+' }
    );
    item.courses = courses;

    departments.push(item);
  }

  await writeFile(join(OUTPUT_DIR, 'index.html'), indexTemplate(departments), {
    flag: 'w+',
  });
}

main().catch((error) => {
  console.error('error generating', error);
});
