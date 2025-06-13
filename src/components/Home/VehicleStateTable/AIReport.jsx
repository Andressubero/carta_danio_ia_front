import { useEffect, useState } from 'react'
import { API_URL } from '../../../config'
import './Modal.css';

function AIReportSummary({ report }) {
  const {
    estimated_brand,
    estimated_model,
    vehicle_type,
    image_type,
    image_quality,
    is_vehicle_valid,
    total_vehicle_damage_percentage,
    same_unit_confidence,
    is_same_unit_as_reference,
    comparison_with_reference,
    additional_comments,
    part_damages = [],
  } = report;

  return (
    <div className="ai-report-summary">
      <h2>Resumen del Análisis</h2>
      
      <div className="section">
        <strong>Marca estimada:</strong> {estimated_brand}<br />
        <strong>Modelo estimado:</strong> {estimated_model}<br />
        <strong>Tipo de vehículo:</strong> {vehicle_type}<br />
        <strong>Calidad de imagen:</strong> {image_quality}<br />
        <strong>Tipo de imagen:</strong> {image_type}<br />
        <strong>¿Vehículo válido?:</strong> {is_vehicle_valid ? 'Sí' : 'No'}<br />
        <strong>Daño total estimado:</strong> {total_vehicle_damage_percentage}<br />
        <strong>¿Es la misma unidad que la de referencia?:</strong> {is_same_unit_as_reference ? 'Sí' : 'No'}<br />
        <strong>Confianza de coincidencia:</strong> {same_unit_confidence}%
      </div>

      <div className="section">
        <strong>Comparación con referencia:</strong><br />
        {comparison_with_reference}
      </div>

      <div className="section">
        <strong>Comentarios adicionales:</strong><br />
        {additional_comments}
      </div>

      {part_damages.length > 0 && (
        <div className="section">
          <strong>Daños por parte:</strong>
          <ul>
            {part_damages.map((damage) => (
              <li key={damage.id}>
                <strong>{damage.part_name}</strong>: {damage.damage_description} (Severidad: {damage.severity}, Confianza: {damage.confidence_percentage}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const AIReport = ({id}) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    console.log(id)
 const getReport = async () => {
    if (!id) {
        return
    }
    try {
        setError(false)
        setLoading(true)
           const res = await fetch(`${API_URL}/report/get-detail/${id}`, {
        method: "GET",
        credentials: "include",
      });
    if (res.status !== 200) {
        // Manejar errores como 403, 401, etc.
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    setData(json)

    } catch(e) {
        console.error(e)
        setError(true)
    } finally {
        setLoading(false)
    }
 }
 useEffect(() => {
    getReport()
 }, [])

 if (loading) {
    return <h3>Cargando</h3>
 }

 if (error) {
    return <h3>Error consultando el reporte</h3>
 }
  return (
    <AIReportSummary report={data}/>
  )
}

export default AIReport