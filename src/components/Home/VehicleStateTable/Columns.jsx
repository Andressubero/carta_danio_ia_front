import { Fragment } from "react/jsx-runtime";
import { errors } from "../../../constants/errors";

// eslint-disable-next-line no-unused-vars
const getErrorMessage = (vr) => {
  if (!vr) {
    return 'Error no encontrado'
  }
  const e = vr.split(',').map((vr)=> errors.find((e)=> vr.includes(e.codigo))?.mensaje)
  console.log(e)
  return e.concat(' ')
}
export const getColumns = () => [
  {
    header: 'Marca',
    accessorKey: 'vehicle_brand',
  },
    {
    header: 'Modelo',
    accessorKey: 'vehicle_model',
  },
  {
    header: 'Fecha',
    accessorKey: 'creation_date',
  },
  {
    header: 'Estado',
    cell: (info) => info.row.original.validation_state,
    accessorKey: 'validation_reasons',
  },
  {
    header: 'Acción',
    cell: ({ row }) => (
      <span style={{ display: 'flex', justifyContent: 'space-between' }}>
        {row.original.actions.map((a, i)=> <Fragment  key={`action-${row.original.id}-${i}`}>{a.icon()}</Fragment>)}
      </span>
    ),
  },
];
