import { basename } from 'path';

/**
 * Index file with list of departments.
 * @typedef {object} IndexFile
 * @property {string} title - title of the department
 * @property {string} description - description of the department
 * @property {string} csv - filename of the CSV file
 * @property {string} html - filename of the HTML file
 */

/**
 * Course data.
 * @typedef {object} Course
 * @property {string | undefined} id - ID of the course
 * @property {string} title - title of the course
 * @property {number | undefined} units - course units
 * @property {'Vor' | 'Sumar' | 'Haust' | undefined} semester - semester the course is offered
 * @property {string | undefined} level - level of the course
 * @property {string | undefined} url - url of the course
 */

/**
 * Parse JSON data representing index files.
 * @param {string} input string with JSON data
 * @returns {Array<IndexFile>} parsed list of files
 */
export function parseJson(input) {
  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    console.error('error parsing JSON', e);
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const items = [];
  for (const item of parsed) {
    if (!item.title || !item.description || !item.csv) {
      console.warn('missing required properties in JSON');
    } else {
      items.push({
        title: item.title,
        description: item.description,
        csv: item.csv,
        html: `${basename(item.csv, '.csv')}.html`,
      });
    }
  }

  return items;
}

function parseLine(line) {
  const [
    id = '',
    title = '',
    lineUnits = '',
    lineSemester = '',
    lineLevel = '',
    lineUrl = '',
  ] = line.split(';');

  // TODO simplify this
  const formattedUnits = lineUnits.replace(/\./g, '').replace(',', '.');
  const parsedUnits = Number.parseFloat(formattedUnits, 10);
  const units =
    lineUnits.indexOf('.') < 0 &&
    !Number.isNaN(parsedUnits) &&
    formattedUnits === parsedUnits.toString()
      ? parsedUnits
      : undefined;

  const allowedSemester = ['Vor', 'Sumar', 'Haust'];
  const semester = allowedSemester.includes(lineSemester)
    ? lineSemester
    : undefined;

  const level =
    typeof lineLevel === 'string' && lineLevel.length ? lineLevel : undefined;

  let url;

  try {
    url = new URL(lineUrl).href;
  } catch (e) {
    // do nothing if URL is invalid
  }

  return {
    id: id || undefined,
    title,
    units,
    semester,
    level,
    url,
  };
}

/**
 * Parse CSV data for a course.
 * @param {string} data string with CSV data
 * @returns {Array<Course>} parsed list of courses
 */
export function parseCsv(data) {
  if (!data) {
    return [];
  }

  const courses = [];
  const lines = data.split('\n').slice(1);

  for (const line of lines) {
    const parsed = parseLine(line);

    if (parsed.title) {
      courses.push(parsed);
    }
  }

  return courses;
}
