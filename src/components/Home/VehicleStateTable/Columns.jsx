import { Fragment } from "react/jsx-runtime";
import { errors } from "../../../constants/errors";
function formatearFechaLocal(fechaISO) {
  const fecha = new Date(fechaISO);

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
  const anio = fecha.getFullYear();

  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  return `${dia}-${mes}-${anio} ${horas}:${minutos}`;
}
// eslint-disable-next-line no-unused-vars
const getErrorMessage = (vr) => {
  if (!vr) {
    return 'Error no encontrado'
  }
  const e = vr.split(',').map((vr)=> errors.find((e)=> vr.includes(e.codigo))?.mensaje)
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
    cell: ({ row }) => (
      <span style={{ display: 'flex', justifyContent: 'space-between' }}>
        {formatearFechaLocal(row.original.creation_date)}
      </span>
    ),
  },
  {
    header: 'Estado',
    cell: (info) => info.row.original.validation_state,
    accessorKey: 'validation_reasons',
  },
  {
    header: 'Acción',
    cell: ({ row }) => (
      <span className="d-flex justify-content-center gap-3">
        {row.original.actions.map((a, i)=> <Fragment  key={`action-${row.original.id}-${i}`}>{a.icon()}</Fragment>)}
      </span>
    ),
  },
];
