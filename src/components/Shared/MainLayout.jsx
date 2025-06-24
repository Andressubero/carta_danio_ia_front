import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const MainLayout = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_RUTA_BACKEND_LOCAL}/user/me`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setUsername(data.username || "Usuario");
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Header username={username} />
      <main className="main-scrollable">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
