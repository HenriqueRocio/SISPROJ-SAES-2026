/* ══════════════════════════════════════════════════════════════
   SISPROJ — Table Sort System
   CGPROJ · SAES · Ministério da Saúde

   Usage: add class="sortable" to <th> elements, then call:
   initTableSort('tableId') or initTableSort(tableElement)
   ══════════════════════════════════════════════════════════════ */

function initTableSort(tableOrId) {
  var table = typeof tableOrId === 'string'
    ? document.getElementById(tableOrId)
    : tableOrId;
  if (!table) return;

  var headers = table.querySelectorAll('th.sortable');
  headers.forEach(function(th, colIdx) {
    th.addEventListener('click', function() {
      var isAsc = th.classList.contains('asc');
      // Reset all headers
      headers.forEach(function(h) { h.classList.remove('asc', 'desc'); });
      // Toggle direction
      if (isAsc) {
        th.classList.add('desc');
      } else {
        th.classList.add('asc');
      }
      var dir = th.classList.contains('asc') ? 1 : -1;
      sortTable(table, colIdx, dir);
    });
  });
}

function sortTable(table, colIdx, dir) {
  var tbody = table.querySelector('tbody') || table;
  var rows = Array.from(tbody.querySelectorAll('tr'));
  if (!rows.length) return;

  rows.sort(function(a, b) {
    var aCell = a.cells[colIdx];
    var bCell = b.cells[colIdx];
    if (!aCell || !bCell) return 0;

    var aText = (aCell.getAttribute('data-sort') || aCell.textContent).trim();
    var bText = (bCell.getAttribute('data-sort') || bCell.textContent).trim();

    // Try numeric comparison (handle R$ currency and K/M suffixes)
    var aNum = parseNumericValue(aText);
    var bNum = parseNumericValue(bText);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return (aNum - bNum) * dir;
    }

    // Date comparison (dd/mm/yyyy)
    var aDate = parseDate(aText);
    var bDate = parseDate(bText);
    if (aDate && bDate) {
      return (aDate - bDate) * dir;
    }

    // String comparison (locale-aware)
    return aText.localeCompare(bText, 'pt-BR', { sensitivity: 'base' }) * dir;
  });

  rows.forEach(function(row) { tbody.appendChild(row); });
}

function parseNumericValue(text) {
  // Remove R$, spaces, dots (thousand separators)
  var clean = text.replace(/R\$\s*/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  // Handle K/M suffixes
  if (/[\d.]+[Kk]$/.test(clean)) {
    return parseFloat(clean) * 1000;
  }
  if (/[\d.]+[Mm]$/.test(clean)) {
    return parseFloat(clean) * 1000000;
  }
  var num = parseFloat(clean);
  return isNaN(num) ? NaN : num;
}

function parseDate(text) {
  // dd/mm/yyyy
  var m = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(m[3], m[2] - 1, m[1]);
  // mm/yyyy
  var m2 = text.match(/^(\d{1,2})\/(\d{4})$/);
  if (m2) return new Date(m2[2], m2[1] - 1, 1);
  return null;
}

/* Auto-init: find all tables with data-sortable attribute */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('table[data-sortable]').forEach(function(tbl) {
    initTableSort(tbl);
  });
});
