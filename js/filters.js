/* ══════════════════════════════════════════════════════════════
   SISPROJ — Filter System
   CGPROJ · SAES · Ministério da Saúde

   Reusable filter bar logic for dashboard panels.
   ══════════════════════════════════════════════════════════════ */

/**
 * Initialize filter bar: binds input/select events and calls the
 * provided filterCallback whenever any filter changes.
 *
 * @param {string} containerId - ID of the .fbar container
 * @param {Function} filterCallback - called with {field: value} map on each change
 */
function initFilters(containerId, filterCallback) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var inputs = container.querySelectorAll('input, select');

  function collectValues() {
    var values = {};
    inputs.forEach(function(el) {
      var key = el.getAttribute('data-filter') || el.name || el.id;
      values[key] = el.value.trim().toLowerCase();
    });
    return values;
  }

  function onChange() {
    filterCallback(collectValues());
  }

  inputs.forEach(function(el) {
    el.addEventListener('input', onChange);
    el.addEventListener('change', onChange);
  });

  // Clear all button
  var clearBtn = container.querySelector('.btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      inputs.forEach(function(el) {
        if (el.tagName === 'SELECT') {
          el.selectedIndex = 0;
        } else {
          el.value = '';
        }
      });
      onChange();
    });
  }

  return { collect: collectValues, reset: function() { clearBtn && clearBtn.click(); } };
}

/**
 * Filter an array of data objects by a set of filter values.
 *
 * @param {Array} data - array of objects
 * @param {Object} filters - {field: value} from initFilters callback
 * @param {Object} fieldMap - maps filter key to data field(s), e.g. {search: ['nome','cpf']}
 * @returns {Array} filtered data
 */
function applyFilters(data, filters, fieldMap) {
  return data.filter(function(item) {
    return Object.keys(filters).every(function(key) {
      var val = filters[key];
      if (!val) return true;

      var fields = fieldMap[key];
      if (!fields) return true;
      if (!Array.isArray(fields)) fields = [fields];

      return fields.some(function(f) {
        var itemVal = String(item[f] || '').toLowerCase();
        return itemVal.indexOf(val) !== -1;
      });
    });
  });
}
