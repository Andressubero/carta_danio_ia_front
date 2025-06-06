// DamageForm.jsx
import React, { useState } from 'react';
import './DamageForm.css';
import autoImg from '../../images/foto_danios.jpg';

/* 
  1) Estas coordenadas (%) fueron obtenidas detectando
     automáticamente los centros de los círculos negros en la imagen.
  2) Como resultado hay 31 puntos. Si quieres usar nombres más descriptivos,
     reemplaza "Punto 1", "Punto 2", etc. por el texto que prefieras.
*/
const puntos = [
  {
    "id": "Techo",
    "top": "43.1%",
    "left": "48.7%"
  },
  {
    "id": "Parabrisas",
    "top": "64.6%",
    "left": "49.2%"
  },
  {
    "id": "Luneta Trasera",
    "top": "23.9%",
    "left": "49.2%"
  },
  {
    "id": "Baúl",
    "top": "13.6%",
    "left": "49.4%"
  },
  {
    "id": "Paragolpes trasero",
    "top": "6.0%",
    "left": "49.1%"
  },
  {
    "id": "Capó",
    "top": "80.6%",
    "left": "49.2%"
  },
  {
    "id": "Paragolpes delantero",
    "top": "92.6%",
    "left": "49.2%"
  },
  {
    "id": "Rueda delantera derecha",
    "top": "80.2%",
    "left": "86.4%"
  },
  {
    "id": "Rueda trasera derecha",
    "top": "21.7%",
    "left": "86.2%"
  },
  {
    "id": "Ventana delantera derecha",
    "top": "52.9%",
    "left": "68.4%"
  },
  {
    "id": "Ventana trasera derecha",
    "top": "41.7%",
    "left": "68.7%"
  },
  {
    "id": "Puerta delantera derecha",
    "top": "53.0%",
    "left": "80.7%"
  },
  {
    "id": "Puerta trasera derecha",
    "top": "41.3%",
    "left": "80.7%"
  },
  {
    "id": "Guarda fango delantero derecho",
    "top": "75.0%",
    "left": "74.9%"
  },
  {
    "id": "Guarda fango trasero derecho",
    "top": "25.8%",
    "left": "71.2%"
  },
  {
    "id": "Luz delantera derecha",
    "top": "86.0%",
    "left": "70.7%"
  },
  {
    "id": "Luz trasera derecha",
    "top": "9.7%",
    "left": "75.7%"
  },
  {
    "id": "Retrovisor derecho",
    "top": "64.6%",
    "left": "68.4%"
  },
  {
    "id": "Rueda delantera izquierda",
    "top": "80.2%",
    "left": "11.4%"
  },
  {
    "id": "Rueda trasera izquierda",
    "top": "21.7%",
    "left": "12.2%"
  },
  {
    "id": "Ventana delantera izquierda",
    "top": "52.9%",
    "left": "29.7%"
  },
  {
    "id": "Ventana trasera izquierda",
    "top": "41.7%",
    "left": "29.7%"
  },
  {
    "id": "Puerta delantera izquierda",
    "top": "53.0%",
    "left": "16.7%"
  },
  {
    "id": "Puerta trasera izquierda",
    "top": "41.3%",
    "left": "17.2%"
  },
  {
    "id": "Guarda fango delantero izquierdo",
    "top": "75.0%",
    "left": "23.2%"
  },
  {
    "id": "Guarda fango trasero izquierdo",
    "top": "25.8%",
    "left": "26.7%"
  },
  {
    "id": "Luz delantera izquierda",
    "top": "86.0%",
    "left": "26.9%"
  },
  {
    "id": "Luz trasera izquierda",
    "top": "9.7%",
    "left": "22.2%"
  },
  {
    "id": "Retrovisor izquierdo",
    "top": "64.6%",
    "left": "30.2%"
  }
];


const DamageForm = () => {
  const [seleccionadas, setSeleccionadas] = useState([]);

  const toggle = (id) =>
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  return (
    <div className="damage-form">
      <div className="image-container">
        <img src={autoImg} alt="Croquis del auto" className="car-image" />

        {puntos.map((p) => (
          <button
            key={p.id}
            title={p.id}
            className={`marker ${seleccionadas.includes(p.id) ? 'active' : ''}`}
            style={{ top: p.top, left: p.left }}
            onClick={() => toggle(p.id)}
          />
        ))}
      </div>

      <section className="result">
        <h4>Partes seleccionadas</h4>
        {seleccionadas.length ? (
          <ul>
            {seleccionadas.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        ) : (
          <p>No hay partes seleccionadas.</p>
        )}
      </section>
    </div>
  );
};

export default DamageForm;
