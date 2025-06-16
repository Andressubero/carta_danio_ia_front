import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {VehicleCard} from '../VehicleCard/VehicleCard'
import { useNavigate } from "react-router-dom";

const VehicleDetail = () => {
  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
  const fetchData = async () => {
    try {
      setError(false);
      setLoading(true);
      const response = await fetch(`${apiUrl}/vehicle/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error( error.message);
      setError(error.message);
    }  finally {
      setLoading(false);
    }
  };
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  
  if (loading || !data) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container d-flex justify-content-center">
      <div className="bg-white rounded-3 p-4 mx-auto">
        <VehicleCard vehicle={data} />
        <div className='d-flex flex-column gap-2'>     
          <button onClick={function() { navigate("/vehicle-state/create/" + data.id ,{state: { from: "/vehicleDetail" }})}} className='btn btn-outline-primary'>Nueva Carta de daño</button>
          <button onClick={function(){navigate("/home")}}  className="btn btn-outline-secondary">Volver al listado</button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
