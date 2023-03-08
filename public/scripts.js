/**
 *
 * @param {element} table
 * @param {HTMLElement} target
 */
function sortTable(table, target) {
  const header = table.querySelector('thead tr');
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  const index = Array.from(header.children).indexOf(target);
  const isDescending = target.dataset.order === 'desc';

  rows.sort((a, b) => {
    const aValue = a.children[index].textContent;
    const bValue = b.children[index].textContent;

    if (aValue < bValue) {
      return isDescending ? 1 : -1;
    }

    if (aValue > bValue) {
      return isDescending ? -1 : 1;
    }

    return 0;
  });

  table.querySelector('tbody').append(...rows);

  header.querySelectorAll('[data-order]').forEach((element) => {
    element.removeAttribute('data-order');

    const button = element.querySelector('button');
    button.textContent = '-';
  });

  target.dataset.order = isDescending ? 'asc' : 'desc';
  const button = target.querySelector('button');
  button.textContent = isDescending ? '↑' : '↓';
}

function makeTableSortable(table) {
  const ths = table.querySelectorAll('thead tr th');

  Array.from(ths).forEach((th) => {
    const button = document.createElement('button');
    button.textContent = '-';
    button.addEventListener('click', sortTable.bind(null, table, th));
    th.append(button);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');

  if (table) {
    makeTableSortable(table);

    // Sort by course number by default
    sortTable(table, table.querySelector('thead tr th:nth-child(1)'));
  }
});
