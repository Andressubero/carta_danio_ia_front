import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../../styles/authLayout.css';
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
        navigate("/getall");
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
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card shadow">
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Usuario
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className="form-control"
                  autoComplete="username"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  autoComplete="current-password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </button>
            </Form>
          )}
        </Formik>

        {message && (
          <div
            className={`alert mt-3 ${success ? "alert-success" : "alert-danger"}`}
            role="alert"
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogin;