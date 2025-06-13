import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { API_URL } from "../config";

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);

  const setUser = (newUser) => setUserState(newUser);
  const getUser = () => user;
  const clearUser = () => setUserState(null);
    const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
        setLoading(true)
      const res = await fetch(`${API_URL}/user/me`, {
        method: "GET",
        credentials: "include",
      });
        if (res.status !== 200) {
        // Manejar errores como 403, 401, etc.
        throw new Error(`HTTP error! status: ${res.status}`);
        }
      const json = await res.json();
      setUser(json);
    } catch (e) {
      console.error(e);
      clearUser();
    } finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    getUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, getUser, clearUser, loading, getUserData }}>
      {children}
    </UserContext.Provider>
  );
}
