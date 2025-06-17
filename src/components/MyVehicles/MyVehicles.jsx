import "../../styles/authLayout.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

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
        console.error(error.message);
      }
    };

    fetchMyVehicles();
  }, [apiUrl]);

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Mis Vehículos</h1>
      {myVehicles.length === 0 ? (
        <p className="bold-text">Aún no ha registrado ningun vehiculo</p>
      ) : (
        <div className="row g-4">
          {myVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="mb-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>
                  {vehicle.brand} {vehicle.model}
                </Card.Title>
                <Card.Text>
                  <strong>Año:</strong> {vehicle.year}
                </Card.Text>
                <Card.Text>
                  <strong>Patente:</strong> {vehicle.plate}
                </Card.Text>
                <Card.Link
                  onClick={function () {
                    navigate("/vehicle-state/create/" + vehicle.id, {
                      state: { from: "/vehicleDetail" },
                    });
                  }}
                  className="btn btn-outline-primary"
                >
                  <strong>Nueva Carta de daño</strong>
                </Card.Link>
              </Card.Body>
              <div className="d-flex flex-row justify-content-center gap-2">
                <a
                  className="a-navegar"
                  onClick={() => navigate("/vehicle/edit/" + vehicle.id)}
                >
                  Editar
                </a>
                <a
                  className="a-navegar"
                  onClick={() => navigate("/createVehicle")}
                >
                  Eliminar
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="d-flex flex-column gap-2">
        <a className="btn btn-secondary" onClick={() => navigate("/home")}>
          Volver al menú
        </a>
        <a
          className="btn btn-primary"
          onClick={() => navigate("/createVehicle")}
        >
          Nuevo vehículo
        </a>
      </div>
    </div>
  );
};

export default MyVehicles;
