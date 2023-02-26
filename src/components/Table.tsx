// create table component
interface TableProps {
  columns: string[]
  data: any[]
}
const Cell = ({ value }: { value: string[] | string }) => {
  return <td className="border-black border-solid border-2 p-2">
    {
      Array.isArray(value) ?
        <ul>
          {value.map((item, i) => <li key={i}>{item}</li>)}
        </ul> :
        value
    }
  </td>
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <table className="table-fixed">
      <thead>
        <tr>
          {columns.map((column, i) => (
            <th key={i}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody >
        {data.map((row, i) => {
          return (
            <tr key={i}>
              {columns.map((cell, _i) => {
                return <Cell key={_i} value={row[cell]} />
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table