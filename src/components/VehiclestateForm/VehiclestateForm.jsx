import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './DamageForm.css';
import autoImg from '../../images/sedan_croquis.jpg';
import { SedanParts as visualPoints } from '../../Data/SedanParts.jsx';

const VehicleStateForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const isPrimeraCarta = location?.state?.fromCreate === true;

  const [step, setStep] = useState(1);
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState({});
  const [result, setResult] = useState(null);
  const [estadoPartes, setEstadoPartes] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [damageType, setDamageType] = useState("ABOLLADURA");
  const [damageDescription, setDamageDescription] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: "0%", left: "0%" });

  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;

useEffect(() => {
  const fetchVehicleWithParts = async () => {
    try {
      const res = await fetch(`${apiUrl}/vehicle/vehicle-with-parts/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data) {
        console.log("✅ Vehículo obtenido:", data);
        console.log("📦 Partes del backend:");
        data.parts.forEach((p) => console.log(`→ ${p.name} (${p.id})`));

        setVehicleBrand(data.brand);
        setVehicleModel(data.model);
        setDate(new Date().toISOString().split("T")[0]);

        const partMap = new Map(
          data.parts.map((part) => [part.name.trim().toLowerCase(), part.id])
        );

        console.log("🔄 Intentando mapear partes visuales:");
        const puntosConId = visualPoints
          .map((p) => {
            const clave = p.id.trim().toLowerCase();
            const backendId = partMap.get(clave);
            if (!backendId) {
              console.warn(`⚠️ No se encontró ID para la parte visual "${p.id}"`);
            } else {
              console.log(`✔️ Parte "${p.id}" mapeada a ID ${backendId}`);
            }
            return backendId ? { ...p, part_id: backendId } : null;
          })
          .filter(Boolean);

        setPuntos(puntosConId);

        const estadoInicial = puntosConId.map((p) => ({
          part_id: p.part_id,
          damages: [{ damage_type: "SIN_DAÑO", description: "" }],
        }));

        console.log("📄 Estado inicial generado:");
        console.table(estadoInicial);

        setEstadoPartes(estadoInicial);
      }
    } catch (err) {
      console.error("❌ Error cargando datos del vehículo:", err);
    }
  };

  fetchVehicleWithParts();
}, [id]);


  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

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

  const handlePartClick = (part) => {
    setSelectedPart(part);
    setDamageType("ABOLLADURA");
    setDamageDescription("");
    setFormVisible(true);
    setPopupPosition({ top: part.top, left: `calc(${part.left} + 15px)` });
  };

  const addDamage = () => {
    const newDamage = { damage_type: damageType, description: damageDescription };

    setEstadoPartes(prev => {
      const updated = [...prev];
      const index = updated.findIndex(p => p.part_id === selectedPart.part_id);
      if (index !== -1) {
        updated[index].damages.push(newDamage);
      } else {
        updated.push({
          part_id: selectedPart.part_id,
          damages: [newDamage]
        });
      }
      return updated;
    });

    setFormVisible(false);
    setSelectedPart(null);
  };

  const getSidesInvolved = () => {
    const sides = new Set();
    for (const ep of estadoPartes) {
      const punto = puntos.find(p => p.part_id === ep.part_id);
      if (punto?.side) sides.add(punto.side);
    }
    return Array.from(sides);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('vehicle_id', id);
    formData.append('date', date);
    formData.append('brand', vehicleBrand);
    formData.append('model', vehicleModel);
    formData.append('states', JSON.stringify(estadoPartes));

    const sideToField = {
      LATERAL_RIGHT: "lateral_right",
      LATERAL_LEFT: "lateral_left",
      FRONT: "front",
      BACK: "back",
      TOP: "top"
    };

    const sides = getSidesInvolved();
  console.log("🖼️ Lados involucrados con imágenes:");
  console.log(sides);

  sides.forEach((side) => {
    const field = sideToField[side];
    const imageObj = images[side]; // ejemplo: images["LATERAL_RIGHT"]
    if (imageObj?.file) {
      formData.append(field, imageObj.file);
      console.log(`✅ Imagen agregada para ${field}:`, imageObj.file.name);
    } else {
      console.warn(`⚠️ No se encontró imagen para ${field}`);
    }
  });

    try {
      const response = await fetch(`${apiUrl}/vehicle-state/create`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const result = await response.json();
      setResult(result);
      if (result.success) {
        alert("Carta de estado creada con éxito.");
      }
    } catch (error) {
      console.error("Error creando estado:", error);
      setResult({ success: false, message: "Error en la creación" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="damage-form" encType="multipart/form-data">
      <h1>Crear Estado del Vehículo</h1>

      {isPrimeraCarta && (
        <div className="alert alert-info">
          Primera carga de estado del vehículo. Todas las partes están marcadas como <strong>SIN DAÑO</strong> por defecto.
        </div>
      )}

      {step === 1 && (
        <>
          <div className="input-group">
            <label>Marca:</label>
            <input type="text" value={vehicleBrand} readOnly />
          </div>
          <div className="input-group">
            <label>Modelo:</label>
            <input type="text" value={vehicleModel} readOnly />
          </div>
          <div className="input-group">
            <label>Fecha:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <button type="button" onClick={nextStep} disabled={!date}>Siguiente</button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="image-container">
            <img src={autoImg} alt="Croquis del auto" className="car-image" />
            {puntos.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.id}
                className={`marker ${estadoPartes.some(ep => ep.part_id === p.part_id) ? 'selected' : ''}`}
                style={{ top: p.top, left: p.left }}
                onClick={() => handlePartClick(p)}
              />
            ))}
            {formVisible && selectedPart && (
              <div className="damage-popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
                <h4>{selectedPart.id}</h4>
                <label>Tipo de daño:</label>
                <select value={damageType} onChange={(e) => setDamageType(e.target.value)}>
                  <option value="ABOLLADURA">Abolladura</option>
                  <option value="RAYON">Rayón</option>
                  <option value="OTRO">Otro</option>
                  <option value="SIN_DAÑO">Sin daño</option>
                </select>
                <label>Descripción:</label>
                <input type="text" value={damageDescription} onChange={(e) => setDamageDescription(e.target.value)} />
                <button type="button" onClick={addDamage}>Guardar daño</button>
                <button type="button" onClick={() => setFormVisible(false)}>Cancelar</button>
              </div>
            )}
          </div>
          <section className="json-preview">
            <h3>JSON generado (debug):</h3>
            <textarea rows="10" value={JSON.stringify(estadoPartes, null, 2)} readOnly />
          </section>
          <button type="button" onClick={prevStep}>Anterior</button>
          <button type="button" onClick={nextStep}>Siguiente</button>
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
                  onChange={handleImageChange}
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
