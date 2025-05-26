import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div className="home-container">
      <h1 className="home-logo">Carta de Daño IA</h1>
      <div className="home-buttons">
        <Link to={"/register"}><button className="home-button">Registrate</button></Link>
        <Link to={"/login"}><button  className="home-button login">Iniciar sesión</button></Link>
      </div>
    </div>
  );
};

export default Home;