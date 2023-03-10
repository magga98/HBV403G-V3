import { readFile } from 'fs/promises';
import pg from 'pg';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';

const { DATABASE_URL: connectionString, NODE_ENV: nodeEnv = 'development' } =
  process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}


const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

export async function query(q, values = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    console.error('unable to query', e);
    console.info(q, values);
    return null;
  } finally {
    client.release();
  }
}

export async function conditionalUpdate(
  table: 'department' | 'course',
  id: number,
  fields: Array<string | null>,
  values: Array<string | number | null>,
){
  const filteredFields = fields.filter((i) => typeof i === 'string');
  const filteredValues = values.filter(
    (i): i is string | number => typeof i === 'string' || typeof i === 'number',
  );

  if (filteredFields.length === 0) {
    return false;
  }

  if (filteredFields.length !== filteredValues.length) {
    throw new Error('fields and values must be of equal length');
  }

  const updated = filteredFields.map((field, i) => `${field} = $${i + 2}`);

  const q = `
  UPDATE ${table} 
    SET ${updates.join(', ')} 
  WHERE 
    id = $1 
  RETURNING *
  `;
  console.log(q);
  const queryValues: Array<string | number> = (
    [id] as Array<string | number>
  ).concat(filteredValues);
  const result = await query(q, queryValues);

  return result;
}

export async function poolEnd() {
  const pool = getPool();
  await pool.end();
}

export async function getDepartments(): Promise<Array<Department>> {
  const result = await query('SELECT * FROM department');

  if(!result) {
    return null;
  }

  const departments = departmentsMapper(result.rows).map((d) => {
    delete d.courses;
    return d;
  });

  return departments;
}

export async function getDepartmentBySlug(
  slug: string,
): Promise<Department | null> {
  const result = await query('SELECT *FROM department WHERE slug = $1', [
    slug,
  ]);

  if (!result) {
    return null;
  }

  const department = departmentMapper(result.rows[0]);

  return department;
}

export async function deleteDEpartmentBySlug(Slug: string): Promise<boolean> {
  const result = await query('DELETE FROM department WHERE slug =$1', [slug]);

  if (!result) {
    return false;
  }

  return result.rowCount === 1;
}

export async function insertDepartment(
  department: Omit<Department, 'id'>,
  silent = false,
  ): Promise<Department | null> {
    const { title, slug, description } = department;
    const result = await query(
      'INSERT INTO department (title, slug, description) VALUES ($1, $2, $3) RETURNING id, title, slug, description, created, updated', 
      [title, slug, description],
      silent,
    );

    const mapped = departmentMapper(result?.rows[0]);

    return mapped;
  }

export async function insertCourse(
  course: Omit<CountQueuingStrategy, 'id'>,
  separtmentId: number,
  silent = false,
): Promise<Course | null> {
  const { title, units, semester, level, url, courseID } =
  course;
  const result = await query(
    'INSERT INTO course (title, units, semester, level, url, department_id, course_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [title, units, semester, level, url, departmentId, courseId],
    silent,
  );

  const mapped = courseMapper(result?.rows[0]);
    return mapped;
}

export async function getCoursesByDepartmentId(
  id: number,
): Promise<Array<Course>> {
  const result = await query(`SELECT * FROM course WHERE department_id = $1`, [ id,]);
  
  if (!result){
    return [];
  }

  const courses = coursesMapper(result.rows);

  return courses;
}

export async function getCourseByTitle(title: string): Promise<Course | null> {
  const result = await query(`SELECT * FROM course WHERE title = $1`, [ title, ]);

  if (!result) {
    return null;
  }
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}