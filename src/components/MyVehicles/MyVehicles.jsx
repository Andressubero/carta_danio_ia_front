import "../../styles/authLayout.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MyVehicles = () => {
  const [myVehicles, setMyVehicles] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;

  useEffect(() => {
    const fetchMyVehicles = async () => {
      try {
        const response = await fetch(`${apiUrl}/vehicle/myVehicles`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setMyVehicles(data);
      } catch (error) {
        console.log("Error de conexión con el servidor.");
      }
    };

    fetchMyVehicles();
  }, [apiUrl]);

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Mis Vehículos</h1>
      {myVehicles.length === 0 ? (
        <p>Aún no ha registrado ningun vehiculo</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {myVehicles.map((v) => (
            <div className="col" key={v.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    {v.brand} {v.model}
                  </h5>
                  <p className="card-text">
                    <strong>Año:</strong> {v.year} <br />
                    <strong>Patente:</strong> {v.plate} <br />
                    <strong>Tipo de Vehículo:</strong> {v.vehicle_type_id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={{ display: "flex", gap: "16px" }}>
        <a className="a-navegar" onClick={() => navigate("/getall")}>
          Volver al menú
        </a>
        <a className="a-navegar" onClick={() => navigate("/createVehicle")}>
          Registrar un nuevo vehículo
        </a>
      </div>
    </div>
  );
};

export default MyVehicles;
