import React from 'react';

/**
 * Reusable, generic table component.
 * columns: array of { key, label }
 * data: array of row objects
 */
function Table({ columns = [], data = [] }) {
  if (!data.length) {
    return <p className="table-empty">No data to display yet.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={row.id || idx}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
