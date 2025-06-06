import React, { useState } from 'react';
import './DamageEditor.css';
import autoImg from '../../images/foto_danios.jpg';

const initialPoints =[
  {
    "id": "Techo",
    "top": "7.1%",
    "left": "48.7%"
  },
  {
    "id": "Parabrisas",
    "top": "10.6%",
    "left": "49.2%"
  },
  {
    "id": "Luneta Trasera",
    "top": "3.9%",
    "left": "49.2%"
  },
  {
    "id": "Baúl",
    "top": "2.3%",
    "left": "49.4%"
  },
  {
    "id": "Paragolpes trasero",
    "top": "1.0%",
    "left": "49.1%"
  },
  {
    "id": "Capó",
    "top": "13.1%",
    "left": "49.2%"
  },
  {
    "id": "Paragolpes delantero",
    "top": "15.0%",
    "left": "49.2%"
  },
  {
    "id": "Rueda delantera derecha",
    "top": "13.1%",
    "left": "86.4%"
  },
  {
    "id": "Rueda trasera derecha",
    "top": "3.7%",
    "left": "86.2%"
  },
  {
    "id": "Ventana delantera derecha",
    "top": "8.6%",
    "left": "68.4%"
  },
  {
    "id": "Ventana trasera derecha",
    "top": "6.7%",
    "left": "68.7%"
  },
  {
    "id": "Puerta delantera derecha",
    "top": "8.6%",
    "left": "80.7%"
  },
  {
    "id": "Puerta trasera derecha",
    "top": "6.7%",
    "left": "80.7%"
  },
  {
    "id": "Guarda fango delantero derecho",
    "top": "12.1%",
    "left": "74.9%"
  },
  {
    "id": "Guarda fango trasero derecho",
    "top": "4.2%",
    "left": "71.2%"
  },
  {
    "id": "Luz delantera derecha",
    "top": "14.0%",
    "left": "70.7%"
  },
  {
    "id": "Luz trasera derecha",
    "top": "1.7%",
    "left": "75.7%"
  },
  {
    "id": "Retrovisor derecho",
    "top": "10.6%",
    "left": "68.4%"
  },
  {
    "id": "Rueda delantera izquierda",
    "top": "13.1%",
    "left": "11.4%"
  },
  {
    "id": "Rueda trasera izquierda",
    "top": "3.6%",
    "left": "12.2%"
  },
  {
    "id": "Ventana delantera izquierda",
    "top": "8.7%",
    "left": "29.7%"
  },
  {
    "id": "Ventana trasera izquierda",
    "top": "6.7%",
    "left": "29.7%"
  },
  {
    "id": "Puerta delantera izquierda",
    "top": "8.7%",
    "left": "16.7%"
  },
  {
    "id": "Puerta trasera izquierda",
    "top": "6.7%",
    "left": "17.2%"
  },
  {
    "id": "Guarda fango delantero izquierdo",
    "top": "12.1%",
    "left": "23.2%"
  },
  {
    "id": "Guarda fango trasero izquierdo",
    "top": "4.2%",
    "left": "26.7%"
  },
  {
    "id": "Luz delantera izquierda",
    "top": "14.0%",
    "left": "26.9%"
  },
  {
    "id": "Luz trasera izquierda",
    "top": "1.7%",
    "left": "22.2%"
  },
  {
    "id": "Retrovisor izquierdo",
    "top": "10.6%",
    "left": "30.2%"
  }
]
;

const DamageEditor = () => {
  const [points, setPoints] = useState(initialPoints);

  const handleDrag = (e, id) => {
    const container = e.target.closest('.editor-container');
    const rect = container.getBoundingClientRect();

    const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
    const newTop = ((e.clientY - rect.top) / rect.height) * 100;

    setPoints((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, top: `${newTop.toFixed(1)}%`, left: `${newLeft.toFixed(1)}%` }
          : p
      )
    );
  };

  return (
    <div className="editor-container">
      <img src={autoImg} alt="Croquis del auto" className="editor-image" />
      {points.map((p) => (
        <div
          key={p.id}
          className="point"
          title={p.id}
          style={{ top: p.top, left: p.left }}
          draggable
          onDragEnd={(e) => handleDrag(e, p.id)}
        />
      ))}
      <div className="coords">
        <h4>Coordenadas actuales:</h4>
        <pre>{JSON.stringify(points, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DamageEditor;
