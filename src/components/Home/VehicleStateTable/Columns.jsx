export const getColumns = (navigate) => [
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
  {
    header: 'Acción',
    cell: ({ row }) => (
      <button onClick={() => navigate(`/vehicle/${row.original.vehicle_id}/`)}>
        Ver Vehículo
      </button>
    ),
  },
];
