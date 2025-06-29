/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { FaCarSide, FaRobot, FaInfo } from "react-icons/fa";
import { BiBookmarkPlus } from "react-icons/bi";
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
import { useUser } from "../../../context/useUser";
import ValidateState from "./ValidateState";

const VehicleStateTable = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsOpen] = useState(false);
  const [vehicleStateIdForReport, setVehicleStateIdForReport] = useState("");
  const [vehicleStateIdForDetail, setVehicleStateIdForDetail] = useState("");
  const [vehicleStateIdForValidate, setVehicleStateIdForValidate] =
    useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  function closeModal(v) {
    setIsOpen(v);
    setVehicleStateIdForDetail("");
    setVehicleStateIdForReport("");
    setVehicleStateIdForValidate("");
  }

  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;
  const addActions = (row) => {
    const report = {
      icon: () => (
        <FaRobot
          style={{ fontSize: 30, color: "#b5b5c3", cursor: "pointer" }}
          onClick={() => {
            setVehicleStateIdForReport(row.id);
            setIsOpen(true);
          }}
        />
      ),
    };
    const stateDetail = {
      icon: () => (
        <FaInfo
          style={{ fontSize: 30, color: "#b5b5c3", cursor: "pointer" }}
          onClick={() => {
            setVehicleStateIdForDetail(row.id);
            setIsOpen(true);
          }}
        />
      ),
    };
    const validateState = {
      icon: () => (
        <BiBookmarkPlus
          style={{ fontSize: 30, color: "#b5b5c3", cursor: "pointer" }}
          onClick={() => {
            setVehicleStateIdForValidate(row.id);
            setIsOpen(true);
          }}
        />
      ),
    };
    row.actions = [
      {
        icon: () => (
          <FaCarSide
            style={{ fontSize: 30, color: "#b5b5c3", cursor: "pointer" }}
            onClick={() => navigate(`/vehicle/${row.vehicle_id}`)}
          />
        ),
      },
    ];
    if (user.role === "admin") {
      row.actions.push(report), row.actions.push(stateDetail);
      row.actions.push(validateState);
    }
    return row;
  };
  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/vehicle-state/get-all-summary`, {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/vehicle-state/get-all-summary`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();

        // If the backend returns { data: [...] }, use json.data; otherwise, use json directly if it's an array
        const vehicleStates = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : [];
        setData(vehicleStates.map(addActions));
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
    initialState: {
    pagination: {
      pageSize: 7, // ← Cantidad de items por página
    },
  },
  });

  if (isLoading) return <p className="text-light">Cargando datos...</p>;

  return (
    <>
      <div className="table-container">
        <div className="table-card">
          <h2 className="mb-4">Cartas de daño</h2>
          <div className="table-responsive">
            <table className="custom-table">
              <TableHeader table={table} />
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.getPageCount() > 1 && (
            <div className="mt-3 d-flex justify-content-end gap-5">
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
          )}
          {user.role !== 'admin' && (
            <div className="d-flex justify-content-around mt-5"> 
              <button className="me-3 btn btn-primary btn-sm" onClick={() => navigate("/createVehicle")}> 
                Registrar Un Vehículo 
              </button>
              <button className="ms-3 btn btn-primary btn-sm" onClick={() => navigate("/myVehicles")}              >
                Mis Vehículos
              </button>
            </div>
          )}
        </div>
      </div>
      <ModalComponent isOpen={isModalOpen} setIsOpen={closeModal}>
        {vehicleStateIdForReport && <AIReport id={vehicleStateIdForReport} />}
        {vehicleStateIdForDetail && (
          <VehicleStateSummary
            data={data?.find((vs) => vs.id === vehicleStateIdForDetail)}
          />
        )}
        {vehicleStateIdForValidate && (
          <ValidateState
            initialState={
              data?.find((vs) => vs.id === vehicleStateIdForValidate)
                ?.validation_state || "PENDIENTE"
            }
            onCancel={function (reload) {
              if (reload) {
                fetchData();
              }
              closeModal(false);
            }}
            id={vehicleStateIdForValidate}
          />
        )}
      </ModalComponent>
    </>
  );
};

export default VehicleStateTable;
