import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../UserLogout/LogoutButton';
import './Layout.css';
const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;

const ADMIN_ROLE_ID = 'b756cc08-b981-4183-9c81-2246937485a2';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('Usuario');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUsername(data.username || 'Usuario');
          setIsAdmin(data.role_id === ADMIN_ROLE_ID);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest('.user-menu')) setOpen(false);
    };
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
          {isAdmin && <Link to="/vehiclestate/getall">Estados</Link>}
        </nav>
        <div className="user-menu" style={{ position: 'relative', marginLeft: '16px' }}>
          <button
            className="user-btn"
            onClick={() => setOpen(!open)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <span role="img" aria-label="user" style={{ marginRight: 6 }}>👤</span>
            {isAdmin ? `${username} (admin)` : username}
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
