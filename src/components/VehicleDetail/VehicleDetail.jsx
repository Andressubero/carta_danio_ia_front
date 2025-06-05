import { useParams } from 'react-router-dom';

const VehicleDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Detalle del Vehículo</h2>
      <p>ID del vehículo: <strong>{id}</strong></p>
    </div>
  );
};

export default VehicleDetail;
