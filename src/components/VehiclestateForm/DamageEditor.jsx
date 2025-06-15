import React, { useState } from 'react';
import './DamageEditor.css';
import autoImg from '../../images/moto5sidescroquis.png';

const initialPoints =[
{id: "Manillar izquierdo", top: "10.6%", left: "35.8%", side: "FRONT"},
{id: "Manillar derecho", top: "10.6%", left: "65.3%", side: "FRONT"},
{id: "Espejo retrovisor izquierdo", top: "0.8%", left: "8.0%", side: "FRONT"},
{id: "Espejo retrovisor derecho", top: "0.6%", left: "34.3%", side: "FRONT"},
{id: "Luz delantera", top: "2.7%", left: "21.8%", side: "FRONT"},
{id: "Tanque", top: "9.5%", left: "51.0%", side: "TOP"},
{id: "Asiento", top: "6.0%", left: "50.2%", side: "TOP"},
{id: "Rueda trasera", top: "6.5%", left: "85.0%", side: "BACK"},
{id: "Rueda delantera", top: "6.6%", left: "26.8%", side: "FRONT"},
{id: "Luz trasera", top: "1.9%", left: "80.0%", side: "BACK"},
{id: "Luz trasera derecha", top: "2.0%", left: "93.8%", side: "BACK"},
{id: "Luz trasera izquierda", top: "2.1%", left: "66.8%", side: "BACK"},
{id: "Luz delantera lateral derecha", top: "2.9%", left: "36.0%", side: "FRONT"},
{id: "Luz delantera lateral izquierda", top: "2.8%", left: "8.0%", side: "FRONT"},
{id: "Guardabarro delantero", top: "4.3%", left: "21.8%", side: "FRONT"},
{id: "Estribo izquierdo", top: "7.5%", left: "35.8%", side: "TOP"},
{id: "Estribo derecho", top: "7.4%", left: "63.7%", side: "TOP"},
{id: "Chasis lateral izquierdo", top: "10.6%", left: "19.5%", side: "LATERAL_LEFT"},
{id: "Chasis lateral derecho", top: "10.5%", left: "79.8%", side: "LATERAL_RIGHT"},
{id: "Chasis trasero izquierdo", top: "8.6%", left: "16.3%", side: "LATERAL_LEFT"},
{id: "Chasis trasero derecho", top: "8.7%", left: "83.5%", side: "LATERAL_RIGHT"},
{id: "Guardabarro trasero", top: "3.7%", left: "80.0%", side: "BACK"},
{id: "Tablero", top: "11.5%", left: "50.2%", side: "TOP"}

];

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
