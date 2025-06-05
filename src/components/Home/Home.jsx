import '../../styles/authLayout.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card text-center shadow">
        <h1 className="mb-4">Carta de Daño IA</h1>

        <div className="d-grid gap-3">
          <Link to="/register">
            <button className="btn btn-success w-100">Registrate</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-primary w-100">Iniciar sesión</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
