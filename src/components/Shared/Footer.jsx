// src/components/shared/Footer.jsx
import React from 'react';
import './Layout.css';
import Logo from '../../images/logobdt.png'

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-left">
        <img src={Logo} alt="Logo bdt" className='footer-logo'/>
        © {new Date().getFullYear()} Carta Daño IA · Todos los derechos reservados
      </div>
      <div className="footer-right">
        <a href="mailto:contacto@cartadaño.com">Contacto</a>
      </div>
    </footer>
  );
};

export default Footer;
