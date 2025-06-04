import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import React, { useEffect, useMemo, useState } from 'react'

const VehicleStateTable = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL
  if (!apiUrl) {
    console.warn('Warning: VITE_RUTA_BACKEND_LOCAL is not defined. Usando fallback.')
  }

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/vehiclestate/getall`, {
        method: 'GET',
        credentials: 'include',
      });
      const json = await res.json();
      setData(json);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setIsLoading(false);
    }
  };

  fetchData();
}, []);


  const columns = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
      },
      {
        header: 'Vehículo',
        accessorKey: 'vehicle_id',
      },
      {
        header: 'Fecha de Creación',
        accessorKey: 'creation_date',
      },
      {
        header: 'Fecha Declarada',
        accessorKey: 'declared_date',
      },
      {
        header: 'Motivo de Validación',
        accessorKey: 'validation_reasons',
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) return <p>Cargando datos...</p>

  return (
    <div>
      <table border={1} cellPadding={10}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </button>
        <span style={{ margin: '0 1rem' }}>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default VehicleStateTable
