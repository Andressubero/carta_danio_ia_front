import "../../styles/authLayout.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const MyVehicles = () => {
  const [myVehicles, setMyVehicles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
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

  useEffect(() => {
  }, [myVehicles]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}/vehicle/delete/${vehicleToDelete}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        navigate("/myVehicles");
      } else {
        console.error("error borrando vehiculo")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setShowConfirm(false);
      window.location.reload();
    }
  };

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
                  onClick={() => {
                    setVehicleToDelete(vehicle.id);
                    setShowConfirm(true);
                  }}
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

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>¿Está seguro que desea eliminar este vehículo?</h5>
            <div className="d-flex justify-content-around mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
