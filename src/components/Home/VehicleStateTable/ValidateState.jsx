import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { API_URL } from "../../../config";

const ValidateState = ({initialState, onCancel, id }) => {
  const [option, setOption] = useState(initialState);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setOption(e.target.value); // Ahora guarda el valor correctamente
  }

  async function onSubmit(){
    setLoading(true)
    setError(false)
    try {
        await fetch(`${API_URL}/vehicle-state/change-state`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ validation_state: option, id }),
        })
    } catch(e) {
        console.error(e)
        setError('Hubo un error cambiando el estado')
    } finally {
        setLoading(false)
        onCancel(true)
    }
  }

  if (loading) {
    return (<Spinner className='m-auto' animation="border" variant="primary" />)
  }
  if (error) {
    return (<h3>{error}</h3>)
  }

  return (
    <div className="p-3 border rounded">
      {/* Radio Buttons en fila */}
      <div className="d-flex gap-3">
        <input type="radio" id="aprobar" name="estado" value="APROBADA" onChange={handleChange} />
        <label htmlFor="aprobar">Aprobar</label>

        <input type="radio" id="denegar" name="estado" value="DENEGADA" onChange={handleChange} />
        <label htmlFor="denegar">Denegar</label>

        <input type="radio" id="pendiente" name="estado" value="PENDIENTE" onChange={handleChange} defaultChecked />
        <label htmlFor="pendiente">Pendiente</label>
      </div>

      {/* Botones organizados en columna */}
      <div className="d-flex flex-column mt-3">
        <Button onClick={onSubmit} variant="primary" className="mb-2" disabled={!id || !option}>Aceptar</Button>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
};

export default ValidateState;