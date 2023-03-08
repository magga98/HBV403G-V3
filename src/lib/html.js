/**
 * Generate a HTML page with title and content.
 *
 * @param {string} title title of the page
 * @param {string} content HTML content of the page
 * @returns Full HTML page
 */
export function template(title, content) {
  return `<!doctype html>
<html lang="is">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link rel="stylesheet" href="./public/styles.css">
    <script type="module" src="./public/scripts.js"></script>
  </head>
  <body>${content}</body>
</html>`;
}

/**
 * Generate a HTML string for the index page.
 * @param {Array<IndexFile>} departments list of departments
 * @returns {string} HTML string representing the index page
 */
export function indexTemplate(departments) {
  const index = `
    <h1>Kennsluskrá</h1>
    <h2>Deildir</h2>
    <ul>
      ${departments
        .filter((department) => department?.courses?.length > 0)
        .map(
          (department) =>
            `<li><a href="${department.html}">${department.title}</a></li>\n`
        )
        .join('')}
    </ul>`;
  return template('Kennsluskrá', index);
}

export function courseTemplate(course) {
  return `<tr>
      <td>${course.id ?? ''}</td>
      <td>${
        course.url
          ? `<a href="${course.url}">${course.title}</a>`
          : course.title
      }</td>
      <td>${course.units ?? ''}</td>
      <td>${course.semester ?? ''}</td>
      <td>${course.level ?? ''}</td>
    </tr>`;
}

/**
 * Generate a HTML string representing a department.
 *
 * @param {string} title title of the department
 * @param {string} description description of the department
 * @param {Array<Course>} courses list of courses
 * @returns {string} HTML string representing the department
 */
export function departmentTemplate(title, description, courses) {
  const department = `
    <div class="department">
      <h2>${title}</h2>
      <p>${description}</p>
      <h3>Áfangar</h3>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>Númer</th>
              <th>Heiti</th>
              <th>Einingar</th>
              <th>Misseri</th>
              <th>Námsstig</th>
            </tr>
          </thead>
          <tbody>
            ${courses.map(courseTemplate).join('')}
          </tbody>
        </table>
      </div>
      <p><a href="./index.html">Til baka</a></p>
    </div>
  `;

  return template(title, department);
}
