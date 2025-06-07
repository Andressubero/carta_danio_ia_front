// src/components/shared/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../UserLogout/LogoutButton'; // Creá este componente como lo armamos antes
import './Layout.css';

const Header = ({ username = "Usuario" }) => {
  const [open, setOpen] = useState(false);

  // Cierra el menú al hacer click fuera
  React.useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (!e.target.closest('.user-menu')) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

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
        {/* Menú de usuario */}
        <div className="user-menu" style={{ position: 'relative', marginLeft: '16px' }}>
          <button
            className="user-btn"
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            <span role="img" aria-label="user" style={{ marginRight: 6 }}>👤</span>
            {username}
          </button>
          {open && (
            <div
              className="user-dropdown"
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.09)',
                minWidth: 150,
                zIndex: 20,
              }}
            >
              <div style={{ padding: '8px 16px', color: '#666' }}>¡Hola, {username}!</div>
              <div style={{ borderTop: '1px solid #eee' }}></div>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
