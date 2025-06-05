import { useParams } from 'react-router-dom';

const VehicleDetail = () => {
  const { id } = useParams();

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Detalle del Vehículo</h2>
        <p>Estás viendo el detalle del vehículo con ID:</p>
        <div className="card mt-3">
          <strong>{id}</strong>
        </div>
        <a href="/" className="a-navegar">Volver al listado</a>
      </div>
    </div>
  );
};

export default VehicleDetail;
