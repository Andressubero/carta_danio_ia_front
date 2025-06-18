import { API_URL } from '../../../config';
import './VehicleStateSummary.css';

const formatValidationReasons = (input) => {
  return [...new Set(input.split(",").map(item => item.trim()))];
};

function VehicleStateSummary({ data }) {
  const {
    vehicle_brand,
    vehicle_model,
    creation_date,
    declared_date,
    validation_state,
    validation_reasons,
    parts_state = [],
  } = data;

  return (
    <div className="vehicle-state-summary">
      <h2>Resumen del Estado del Vehículo</h2>

      <div className="section">
        <p><strong>Marca:</strong> {vehicle_brand}</p>
        <p><strong>Modelo:</strong> {vehicle_model}</p>
        <p><strong>Fecha de creación:</strong> {creation_date}</p>
        <p><strong>Fecha declarada:</strong> {declared_date}</p>
        <p><strong>Estado de validación:</strong> {validation_state}</p>
        {validation_reasons && (
          <>
            <p><strong>Motivos de validación:</strong></p>
            <p>
              <ul>
                {formatValidationReasons(validation_reasons)?.map((vr)=> (<li>{vr}</li>))}            
              </ul>
            </p>  
          </>
        )}
      </div>

      {parts_state.length > 0 && (
        <div className="section">
          <h3>Partes del Vehículo</h3>
          {parts_state.map((part) => (
            <div key={part.id} className="part-block">
              <p><strong>Parte:</strong> {part.vehicle_part_name || 'Sin nombre'}</p>
                {part.image ? (
                <div style={{ width: '100%', margin: '1rem 0' }}>
                    <img
                    src={`${API_URL}/${part.image.replace(/\\/g, '/')}`}
                    alt={`Imagen de ${part.vehicle_part_name}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }}
                    />
                </div>
                ) : (
                <p><strong>Imagen:</strong> No disponible</p>
                )}
              <p><strong>Fecha:</strong> {part.creation_date}</p>

              {part.damages?.length > 0 ? (
                <ul>
                  {part.damages.map((damage) => (
                    <li key={damage.id}>
                      <strong>Tipo:</strong> {damage.damage_type} | <strong>Descripción:</strong> {damage.description} | <strong>¿Reparado?:</strong> {damage.fixed ? 'Sí' : 'No'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay daños registrados.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VehicleStateSummary;
