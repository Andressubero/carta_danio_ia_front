import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/authLayout.css';


const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Email requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Confirmá tu contraseña"),
});

const UserRegister = () => {
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (values, actions) => {
  try {
    const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;
    const response = await fetch(`${apiUrl}/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.email,
        email: values.email,
        password: values.password,
      }),
    });

    const data = await response.json();
    setSuccess(data.success);
    setMessage(data.message);

    if (data.success) {
      actions.resetForm();
      navigate("/login");
    }
  } catch (error) {
    setSuccess(false);
    setMessage("Error de conexión con el servidor");
  } finally {
    actions.setSubmitting(false);
  }
};


  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card shadow">
        <h2 className="text-center mb-4">Registrarse</h2>
      
        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <Field name="email" type="email" className="form-control"/>
                <ErrorMessage name="email" component="div" className="text-danger mt-1" />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña:</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              <div className="mb-3">
                <label tmlFor="confirmPassword" className="form-label">Confirmar contraseña:</label>
                <Field name="confirmPassword" type="password" className="form-control"/>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                Registrarse
              </button>
            </Form>
          )}
        </Formik>

        {message && (
          <div className={`alert mt-3 ${success ? "alert-success" : "alert-danger"}`} role="alert">
            {message}
          </div>
        )}

      {message !== "" ? (
        <p style={{ color: success ? "green" : "red", marginTop: "1rem" }}>
          {message}
        </p>
      ) : (
        <></>
      )}

      <a className="a-navegar" onClick={() => navigate("/")}>
        Volver
      </a>
      </div>
    </div>
  );
};

export default UserRegister;
