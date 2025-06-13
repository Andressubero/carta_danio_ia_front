import { useEffect, useState } from "react";
import { FaCarSide, FaRobot, FaInfo } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getColumns } from "./Columns";
import TableHeader from "./TableHeader";
import { useNavigate } from "react-router-dom";
import "./TableStyles.css";
import { ModalComponent } from "./Modal";
import AIReport from "./AIReport";
import VehicleStateSummary from "./VehicleStateSummary";

const VehicleStateTable = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsOpen] = useState(false);
  const [vehicleStateIdForReport, setVehicleStateIdForReport] = useState('');
  const [vehicleStateIdForDetail, setVehicleStateIdForDetail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;
  const addActions = (row) => {
    row.actions = [
      {
        icon: () => <FaCarSide style={{ fontSize: 30, color: '#b5b5c3', cursor: 'pointer' }} onClick={() => navigate(`/vehicle/${row.vehicle_id}`)} />

      },
      {
        icon: () =>  <FaRobot style={{ fontSize: 30, color: '#b5b5c3', cursor: 'pointer' }} onClick={() => { setVehicleStateIdForReport(row.id); setIsOpen(true)}} />
      },
      {
        icon: () => <FaInfo style={{ fontSize: 30, color: '#b5b5c3', cursor: 'pointer' }} onClick={() => {setVehicleStateIdForDetail(row.id); setIsOpen(true)}} />
      }
    ]
    return row;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/vehicle-state/get-all`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        
        setData(json.map(addActions));
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns: getColumns(navigate),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <p className="text-light">Cargando datos...</p>;

  return (
    <> 
      <div className="table-container">
        <div className="table-card">
          <h2 className="mb-4">Cartas de daño</h2>
          <table className="custom-table">
            <TableHeader table={table} />
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {table.getPageCount() > 1 && 
          (
            <div className="mt-3 d-flex justify-content-between">
              <button
                className="btn btn-primary"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </button>
              <span>
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </span>
              <button
                className="btn btn-primary"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </button>
            </div>
          )
          }

          <div className="d-flex justify-content-around mt-5">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/createVehicle")}
            >
              Registrar Un Vehículo
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/myVehicles")}
            >
              Mis Vehículos
            </button>
          </div>
        </div>
      </div>
      <ModalComponent isOpen={isModalOpen} setIsOpen={setIsOpen}>
        {
          vehicleStateIdForReport && (<AIReport id={vehicleStateIdForReport} />)
        }
        {
          vehicleStateIdForDetail && (<VehicleStateSummary data={data?.find((vs) => vs.id === vehicleStateIdForDetail)} />)
        }
        
      </ModalComponent>
    </>
  );
};

export default VehicleStateTable;
