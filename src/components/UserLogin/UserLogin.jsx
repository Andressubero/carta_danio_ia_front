import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./userLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Mínimo 3 caracteres")
    .required("Nombre de usuario requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
});

const UserLogin = () => {
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (values, actions) => {
    try {
      const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL
      if (!import.meta.env.VITE_RUTA_BACKEND_LOCAL) {
        console.warn("Warning: VITE_RUTA_BACKEND_LOCAL is not defined. Using fallback URL.");
      }

      const response = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
        credentials: "include", // Asegura que las cookies se envíen
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token); 
        setSuccess(true);
        setMessage("Login exitoso.");
        actions.resetForm();
        navigate("/  "); // ✅ redirección inmediata
      } else {
        setSuccess(false);
        setMessage(data.message || "Error de autenticación.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Error de conexión con el servidor.");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <h1>Iniciar sesión</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="username">Nombre de usuario:</label>
            <Field
              id="username"
              name="username"
              type="text"
              className="input-field"
              autoComplete="username"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="error-text"
            />

            <label htmlFor="password">Contraseña:</label>
            <Field
              id="password"
              name="password"
              type="password"
              className="input-field"
              autoComplete="current-password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="error-text"
            />

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              Ingresar
            </button>
          </Form>
        )}
      </Formik>

      {message && (
        <p
          style={{
            color: success ? "green" : "red",
            marginTop: "1rem",
          }}
        >
          {message}
        </p>
      )}
    </>
  );
};

export default UserLogin;
