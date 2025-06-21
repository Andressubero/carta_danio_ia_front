import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL || "";
    try {
      const response = await fetch(`${apiUrl}/user/logout`, {
        method: "POST",
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok && data.message === "Logout exitoso") {
        navigate("/login", { replace: true });
      } else {
        alert("No se pudo cerrar sesión.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <button
      className="btn btn-outline-danger border-0 w-100"
      onClick={handleLogout}
    >
      🚪 Cerrar sesión
    </button>
  );
};

export default LogoutButton;
