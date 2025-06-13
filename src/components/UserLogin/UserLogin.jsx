import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../../styles/authLayout.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { useUser } from "../../context/useUser";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Mínimo 3 caracteres")
    .required("Nombre de usuario requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
});

const UserLogin = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getUserData } = useUser()
const handleSubmit = async (values, actions) => {
  setError(""); // Limpia error anterior
  try {
    const apiUrl = API_URL;
    const response = await fetch(`${apiUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      credentials: "include",  // <- ¡IMPORTANTE!
    });

    const data = await response.json();

    if (response.ok && response.status === 200) {
      await getUserData()
      actions.resetForm();
      navigate("/home", { replace: true });
    } else {
      setError(data.message || "Error de autenticación.");
    }
  } catch (error) {
    setError(error.message);
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

        {/* Solo muestra error si existe */}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        <a className="a-navegar" onClick={() => navigate("/")}>
          Volver
        </a>
      </div>
    </div>
  );
};

export default UserLogin;
