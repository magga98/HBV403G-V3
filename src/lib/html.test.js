import { describe, expect, it } from '@jest/globals';
import { departmentTemplate, indexTemplate, template } from './html';

describe('html', () => {
  describe('generate page template', () => {
    it('generates correct template', () => {
      const result = template('title', 'content');

      expect(result).toEqual(`<!doctype html>
<html lang="is">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <link rel="stylesheet" href="./public/styles.css">
    <script type="module" src="./public/scripts.js"></script>
  </head>
  <body>content</body>
</html>`);
    });
  });

  describe('generate index template', () => {
    it('generates correct template', () => {
      const result = indexTemplate([
        { title: 'foo', html: 'bar.html', courses: [1] },
      ]);

      expect(result).toEqual(`<!doctype html>
<html lang="is">
  <head>
    <meta charset="utf-8">
    <title>Kennsluskrá</title>
    <link rel="stylesheet" href="./public/styles.css">
    <script type="module" src="./public/scripts.js"></script>
  </head>
  <body>
    <h1>Kennsluskrá</h1>
    <h2>Deildir</h2>
    <ul>
      <li><a href="bar.html">foo</a></li>

    </ul></body>
</html>`);
    });
  });

  describe('generate department template', () => {
    it('generates correct department template', async () => {
      const courses = [{ title: 'foo' }];
      const result = departmentTemplate('title', 'description', courses);

      expect(result).toEqual(`<!doctype html>
<html lang="is">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <link rel="stylesheet" href="./public/styles.css">
    <script type="module" src="./public/scripts.js"></script>
  </head>
  <body>
    <div class="department">
      <h2>title</h2>
      <p>description</p>
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
            <tr>
      <td></td>
      <td>foo</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
          </tbody>
        </table>
      </div>
      <p><a href="./index.html">Til baka</a></p>
    </div>
  </body>
</html>`);
    });
  });
});
