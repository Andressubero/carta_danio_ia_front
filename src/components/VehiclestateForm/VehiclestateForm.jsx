import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import './DamageForm.css';
import autoImg from '../../images/sedan_croquis.jpg';
import { SedanParts } from '../../Data/SedanParts.jsx';
import { useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { NavigateModal } from '../Modal/NavigateModal.jsx';

const puntos = [
  {
    type: 'sedan',
    points: SedanParts
  }
]

const VehicleStateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const [points, setPoints] = useState([])
  const [step, setStep] = useState(1);
  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;
  const [isFirstState, setFirstState] = useState(false)
  const [vehicleId] = useState(id || '');
  const [date, setDate] = useState('');
  const [result, setResult] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [showSucessModal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});

  const [estadoPartes, setEstadoPartes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [damageType, setDamageType] = useState("ABOLLADURA");
  const [damageDescription, setDamageDescription] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: "0%", left: "0%" });

const location = useLocation();


useEffect(() => {
  setFirstState(location.state?.from === '/createVehicle')
  const fetchData = async () => {
    try {
      setError(false);
      setLoading(true);
      const response = await fetch(`${apiUrl}/vehicle/vehicle-with-parts/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      setData(result);
      setEstadoPartes(result.parts.map((p)=>({name: p.name, part_id : p.id, damages: [{damage_type: "SIN_DANO", description: "Sin daño"}]})));
      const vehicleType = result?.type?.toLowerCase();
      setPoints(puntos.find((p)=> p.type.includes(vehicleType.substring(0,3)))?.points || [])
    } catch (error) {
      console.error( error.message);
      setError(error.message);
    }  finally {
      setLoading(false);
    }
  };
  fetchData();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
  

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handlePartClick = (punto) => {
    console.log("Punto seleccionado:", punto);
    setSelectedPart(estadoPartes.find(ep => ep.name === punto.name));
    console.log("Estado de partes:", estadoPartes.find(ep => ep.name === punto.name));
    setDamageType("ABOLLADURA");
    setDamageDescription("");
    setFormVisible(true);
    setPopupPosition({ top: punto.top, left: `calc(${punto.left} + 15px)` });
  };

  const addDamage = () => {
    const existing = estadoPartes.find((p) => p.part_id === selectedPart.part_id);
    const newDamage = { damage_type: damageType, description: damageDescription };
    if (existing) {
      setEstadoPartes((current) => (current.map((c) => {if (c.part_id === selectedPart.part_id) {
        return {
          ...c,
          damages: [...c.damages.filter((d) => d.damage_type !== 'SIN_DANO'), newDamage]
        }
      }
      return c; })));
    } else {
      console.log("entro al else de existing");
      setEstadoPartes([
        ...estadoPartes,
        { part_id: selectedPart.part_id, damages: [newDamage] }
      ]);
    }

    setFormVisible(false);
    setSelectedPart(null);
  };

  const getSidesInvolved = () => {
    const sides = new Set();
    let states = estadoPartes;

    if (!isFirstState) {
      states = estadoPartes.filter(ep => ep.damages.some((d) => d.damage_type !== 'SIN_DANO'));    
    }

    for (const ep of states) {
      const punto = points.find(p => p.name === ep.name);
      if (punto && punto.side) sides.add(punto.side);
    }
    return Array.from(sides);
  };

  const handleSubmit = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append('vehicle_id', vehicleId);
    const formattedDate = new Date(date).toISOString().split("T")[0]
    formData.append('date', formattedDate);
    formData.append('brand', data.brand);
    formData.append('model', data.model);
    let filteredEstadoPartes = estadoPartes;

    if (!isFirstState){
      filteredEstadoPartes = estadoPartes.filter(ep => ep.damages.some((d) => d.damage_type !== 'SIN_DANO'));    
    }

    formData.append('states', JSON.stringify(filteredEstadoPartes));
    const sideToField = {
      LATERAL_RIGHT: "lateral_right",
      LATERAL_LEFT: "lateral_left",
      FRONT: "front",
      BACK: "back",
      TOP: "top"
    };

    getSidesInvolved().forEach(side => {
      const field = sideToField[side];
      console.log(field, images, images[field]?.file)
      if (images[side]?.file) {
        formData.append(field, images[side]?.file);
      }
    });
    
    try {
      const response = await fetch(`${apiUrl}/vehicle-state/create`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok || response.status !== 201){
        throw Error('Error creando la carta de daño')
      }
    } catch (error) {
      console.error(error);
      setError(error.message)
    } finally {
      setResult(true)
      setModal(true)
      setLoading(false)
    }
  };

  if (loading || !data) return (
    <div className='m-auto h-80vh d-flex flex-column gap-5 justify-content-center'>
      <h4>Esto puede demorar unos segundos</h4>
      <Spinner className='m-auto' animation="border" variant="primary" />
    </div>
  )

  if (error && !result) return <p>Error: {error.message}</p>;

  return (
    <div className="damage-form" encType="multipart/form-data">
      <h1>Crear Estado del Vehículo</h1>

      {step === 1 && (
        <>
          <Form.Group className="w-100">
            <Form.Label>Marca</Form.Label>
            <Form.Control 
              required
              type="text" 
              value={data.brand} 
              readOnly
              className="p-2 border rounded"
            />
          </Form.Group>
              <Form.Group className="w-100">
            <Form.Label>Modelo</Form.Label>
            <Form.Control 
              required
              type="text" 
              value={data.model} 
              readOnly
              className="p-2 border rounded"
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label>Fecha del estado declarado</Form.Label>
            <Form.Control 
              required
              type="date" 
              value={date} 
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border rounded"
            />
          </Form.Group>
          <button className='btn btn-outline-primary mt-5' type="button" onClick={nextStep} disabled={!date || loading}>Siguiente</button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="image-container">
            <img src={autoImg} alt="Croquis del auto" className="car-image" />
            {points.map((p) => {
              const isSelected = estadoPartes.some(ep => ep.name === p.name);
              return (
                <button
                  key={p.id}
                  type="button"
                  title={p.id}
                  className={`marker ${isSelected ? 'selected' : ''}`}
                  style={{ top: p.top, left: p.left }}
                  onClick={() => handlePartClick(p)}
                />
              );
            })}
            {formVisible && selectedPart && (
              <div className="damage-popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
                <h4>{selectedPart.id}</h4>
                <label>Tipo de daño:</label>
                <select value={damageType} onChange={(e) => setDamageType(e.target.value)}>
                  <option value="ABOLLADURA">Abolladura</option>
                  <option value="RAYON">Rayón</option>
                  <option value="OTRO">Otro</option>
                  <option value="SIN_DANO">Sin danio</option>
                </select>
                <label>Descripción:</label>
                <input type="text" value={damageDescription} onChange={(e) => setDamageDescription(e.target.value)} />
                <button type="button" onClick={addDamage}>Guardar daño</button>
                <button type="button" onClick={() => setFormVisible(false)}>Cancelar</button>
              </div>
            )}
          </div>

          {/* <section className="json-preview">
            <h3>JSON generado (solo para debug):</h3>
            <textarea rows="10" value={JSON.stringify(estadoPartes, null, 2)} readOnly />
          </section> */}
          <div className='d-flex mb-5 gap-5 justify-content-center p-5'>
          <button type="button" onClick={prevStep}>Anterior</button>
          <button type="button" onClick={nextStep} disabled={estadoPartes.length === 0}>Siguiente</button>

          </div>
        </>
      )}

      {step === 3 && (
  <>
    <h3>Subí imágenes de los lados afectados</h3>
    {getSidesInvolved().map((sideKey) => {
      const label = {
        LATERAL_RIGHT: "Lateral derecho",
        LATERAL_LEFT: "Lateral izquierdo",
        FRONT: "Frente",
        BACK: "Parte trasera",
        TOP: "Techo"
      }[sideKey];

      const exampleMap = {
        LATERAL_RIGHT: "sedan_right_example.png",
        LATERAL_LEFT: "sedan_left_example.png",
        FRONT: "sedan_front_example.png",
        BACK: "sedan_back_example.png",
        TOP: "sedan_top_example.png"
      };

      const exampleImg = `/src/images/sedan_photos_example/${exampleMap[sideKey]}`;


      return (
        <div className="input-group" key={sideKey}>
          <div className="label-with-tooltip">
            <label>{label}</label>
            <span className="info-icon">ℹ️
              <div className="tooltip-image">
                <img src={exampleImg} alt={`Ejemplo ${label}`} />
              </div>
            </span>
          </div>

          <input
            type="file"
            name={sideKey}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = (ev) => {
                setImages((prev) => ({
                  ...prev,
                  [sideKey]: {
                    file,
                    preview: ev.target.result,
                  },
                }));
              };
              reader.readAsDataURL(file);
            }}
          />

          {images[sideKey]?.preview && (
            <img
              src={images[sideKey].preview}
              alt={`Preview ${label}`}
              className="image-preview"
            />
          )}
        </div>
      );
    })}
    <div className='d-flex justify-content-center gap-3'>
      <NavigateModal
      buttonText={"Aceptar"}
      state={showSucessModal}
      onClick={function(){navigate("/")}}
      text={!error ? "Carta de daño registrada" : "Error creando la carta de daño"}
      comment={!error ? "Puedes verla desde la página inicial" : "Inténtalo nuevamente"} />
      <button className='btn btn-outline-secondary' type="button" onClick={prevStep}>Anterior</button>
      <button onClick={handleSubmit} className='btn btn-outline-primary' type="submit">Crear Estado</button>
    </div>
  </>
)}
    </div>
  );
};

export default VehicleStateForm;
