import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DamageForm.css';
import autoImg from '../../images/sedan_croquis.jpg';
import { SedanParts } from '../../Data/SedanParts.jsx';
import { useLocation } from "react-router-dom";



const puntos = SedanParts;

const VehicleStateForm = () => {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  console.log("ID del vehiculo:", id);
  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;

  const [vehicleId] = useState(id || '');
  const [date, setDate] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});
  const [result, setResult] = useState(null);

  const [estadoPartes, setEstadoPartes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [damageType, setDamageType] = useState("ABOLLADURA");
  const [damageDescription, setDamageDescription] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: "0%", left: "0%" });

const location = useLocation();


useEffect(() => {
  const fetchData = async () => {
    console.log("URL anterior:", location.state?.from);
    try {
      console.log("Fetching vehicle data for ID:", id);
      setError(false);
      setLoading(true);
      const response = await fetch(`${apiUrl}/vehicle/vehicle-with-parts/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      setData(result);
      setEstadoPartes(result.parts.map((p)=>({name: p.name, part_id : p.id, damages: [{damage_type: "SIN_DANO", description: "Sin daño"}]})));

      console.log("Vehicle data fetched:", result);
    } catch (error) {
      console.error( error.message);
      setError(error.message);
    }  finally {
      setLoading(false);
    }
  };
  fetchData();
}, [])
  

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (!files[0]) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImages(prev => ({
        ...prev,
        [name]: { file: files[0], preview: ev.target.result }
      }));
    };
    reader.readAsDataURL(files[0]);
  };

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
    console.log("selectred part", selectedPart);
    const existing = estadoPartes.find((p) => p.part_id === selectedPart.part_id);
    const newDamage = { damage_type: damageType, description: damageDescription };
    debugger
    if (existing) {
      console.log("entro al if de existing");
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
    for (const ep of estadoPartes) {
      const punto = puntos.find(p => p.id === ep.name);
      if (punto && punto.side) sides.add(punto.side);
    }
    return Array.from(sides);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('vehicle_id', vehicleId);
    formData.append('date', date);
    formData.append('brand', vehicleBrand);
    formData.append('model', vehicleModel);
    let filteredEstadoPartes = estadoPartes;
    if (!isFirtsState){
      filteredEstadoPartes = estadoPartes.filter(ep => ep.damages.some((d) => d.damageType !== 'SIN_DANO'));    }
    formData.append('states', JSON.stringify(estadoPartes));

    const sideToField = {
      LATERAL_RIGHT: "lateral_right",
      LATERAL_LEFT: "lateral_left",
      FRONT: "front",
      BACK: "back",
      TOP: "top"
    };

    getSidesInvolved().forEach(side => {
      const field = sideToField[side];
      if (images[field]?.file) {
        formData.append(field, images[field].file);
      }
    });

    
    try {
      const response = await fetch(`${apiUrl}/vehiclestate/create`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error("Error creando estado:", error);
      setResult({ error: "Error en la creación" });
    }
  };

  if (loading || !data) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className="damage-form" encType="multipart/form-data">
      <h1>Crear Estado del Vehículo</h1>

      {step === 1 && (
        <>
          <div className="input-group">
            <label>Marca:</label>
            <input type="text" value={data.brand} onChange={(e) => setVehicleBrand(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Modelo:</label>
            <input type="text" value={data.model} onChange={(e) => setVehicleModel(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Fecha de declaracion (YYYY-MM-DD):</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <button type="button" onClick={nextStep} disabled={!date || loading}>Siguiente</button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="image-container">
            <img src={autoImg} alt="Croquis del auto" className="car-image" />
            {puntos.map((p) => {
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

          <section className="json-preview">
            <h3>JSON generado (solo para debug):</h3>
            <textarea rows="10" value={JSON.stringify(estadoPartes, null, 2)} readOnly />
          </section>

          <button type="button" onClick={prevStep}>Anterior</button>
          <button type="button" onClick={nextStep} disabled={estadoPartes.length === 0}>Siguiente</button>
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

    <button type="button" onClick={prevStep}>Anterior</button>
    <button type="submit">Crear Estado</button>
  </>
)}


      {result && (
        <section className="api-response">
          <h2>Resultado:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </form>
  );
};

export default VehicleStateForm;
