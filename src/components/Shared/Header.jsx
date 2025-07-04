import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../../context/useUser"; 
import LogoutButton from '../UserLogout/LogoutButton';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';


const Header = () => {
  const [open, setOpen] = useState(false);
  const { getUser } = useUser()
  const navigate = useNavigate();
  const user = getUser();
  // Cierra el menú al hacer click fuera
  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (!e.target.closest('.user-menu')) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <Navbar className="py-4 z-3" bg="primary" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Carta de Daños IA 🚗
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-end">
          {/* Menú de usuario */}
          <div className="user-menu position-relative ms-3">
            <button
              onClick={() => setOpen(!open)}
              className="btn btn-light d-flex align-items-center"
              style={{ fontWeight: 500 }}
            >
              <span role="img" aria-label="user" className="me-2">👤</span>
              {user?.username}
            </button>

            {open && (
              <div
                className="bg-white border rounded position-absolute mt-2 shadow-sm"
                style={{
                  right: 0,
                  zIndex: 1050,
                  minWidth: 200,
                }}
              >
                <div className="px-3 py-2 text-muted p-5">¡Hola, {user?.username}!</div>
                <button onClick={function(){navigate('/user/edit-password')}} className='btn btn-outline-info border-0 w-100'>
                  Editar contraseña
                </button>
                  <LogoutButton />
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;