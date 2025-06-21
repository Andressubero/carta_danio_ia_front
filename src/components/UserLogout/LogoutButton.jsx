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
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 16px",
        background: "none",
        border: "none",
        color: "#c00",
        cursor: "pointer",
        fontWeight: 500,
      }}
      onClick={handleLogout}
    >
      🚪 Cerrar sesión
    </button>
  );
};

export default LogoutButton;
