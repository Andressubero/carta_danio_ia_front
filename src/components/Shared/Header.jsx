// src/components/shared/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="logo">Carta de Daños IA🚗</h1>
      </div>
      <div className="header-right">
        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/register">Registro</Link>
          <Link to="/vehiclestate/getall">Estados</Link>
        </nav>
        <div className="username">Usuario</div> {/* lo vas a reemplazar después */}
      </div>
    </header>
  );
};

export default Header;
