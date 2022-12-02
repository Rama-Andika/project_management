
const TableHead = ({ columns, onSort }) => {
  return (
    <thead style={{ backgroundColor: "#569cb8" }} className="text-white">
      <tr>
        {columns.map(({ label, accessor, sortable }) => {
          return (
            <th key={accessor} onClick={sortable ? onSort : null} className="text-nowrap">
              {label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
